const express = require('express');
const router = express.Router();
const filename = './database/database.sqlite';
const sqlite3    = require( 'sqlite3' ).verbose();

// open the database
let db = new sqlite3.Database(filename);

router.get('/customers', function(req, res) {

  // res.status(200).json({
  //   customers: [{
  //     id: 2,
  //     title: 'Mr',
  //     firstname: 'Laurie',
  //     surname: 'Ainley',
  //     email: 'laurie@ainley.com'
  //   }
  // ]});

  // TODO comment out response above and uncomment the below
  db.serialize(function() {

    var sql = 'select * from customers';

    db.all(sql, [],(err, rows ) => {
      res.status(200).json({
        customers: rows
      });
    });
  });

});

router.get('/customers/:surname', function(req, res) {
  db.serialize(function() {
    const surname = req.params.surname;
    const sql = 'select * from customers where surname like ?';

    db.get(sql, [surname], function(err, rows) {
      res.status(200).json({
        customers: rows
      });
    });
  });
});

router.get('/customer/:id', function(req, res) {
  db.serialize(function() {
    const id = req.params.id;
    const sql = 'select * from customers where id = ?';

    db.get(sql, [id], (err, rows) => {
      res.status(200).json(rows);
    });
  })
});

router.post('/customer/', function(req, res) {
  // EXPECTED JSON Object:
  // {
  //   title: 'Mr',
  //   firstname: 'Laurie',
  //   surname: 'Ainley',
  //   email: 'laurie@ainley.com'
  // }

  // EXAMPLE CURL REQUEST
  // curl -X POST -d @payload.json http://localhost:8080/api/customer --header "Content-Type:application/json"

  db.serialize(function() {

    const user = {
      title: req.body.title,
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email
    };

    db.run(`INSERT INTO customers (title, firstname, surname, email) VALUES (?, ?, ?, ?)`, [user.title, user.firstname, user.surname, user.email], function(error) {
      if (error) {
        console.log(error.message);
        res.status(500).send(error.message);
      }

      return res.status(201).send('Customer added successfully.');
    });
  })
});


function filterColumnsToUpdate(templateObject) {
  const columnsToUpdate = Object.keys(templateObject);
  return columnsToUpdate.filter(column => templateObject[column] != undefined);
};


function generateSetSubStatements(columnsToUpdate) {
  return columnsToUpdate.map(column => column + ' = ? ');
};

function getValuesToUpdate(baseObject, relevantKeys) {
  return relevantKeys.map(key => baseObject[key]);
};

function extractColumnsToSetStatementsAndTheirValues(receivedObject) {
  let setStatements = [];
  let valuesToUpdate = [];
  for(let propName in receivedObject){
    if (receivedObject[propName] != undefined) {
      setStatements = setStatements.concat(propName + '= ? ');
      valuesToUpdate = valuesToUpdate.concat(receivedObject[propName]);
    }
  }

  return {setStatements, valuesToUpdate};
};

router.put('/customer/:id', function(req, res) {
  // EXPECTED JSON Object:
  // {
  //   title: 'Mr',
  //   firstname: 'Laurie',
  //   surname: 'Ainley',
  //   email: 'laurie@ainley.com'
  // }

  db.serialize(function() {
    const id = req.params.id;

    const user = {
      title: req.body.title,
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email
    };

    // Functional and 'One function should only do one thing'
    // const propsToUpdate = filterColumnsToUpdate(user);
    // if (propsToUpdate.length == 0) {
    //   console.log('Nothing to update: bad request');
    //   return res.sendStatus(400, 'Nothing to update on user ' + id);
    // }
    //
    // const setStatements = generateSetSubStatements(propsToUpdate);
    // const valuesToUpdate = getValuesToUpdate(user, propsToUpdate);

    // Aproximation, but function does more than one thing
    const {setStatements, valuesToUpdate} = extractColumnsToSetStatementsAndTheirValues(user);

    if (setStatements.length == 0) {
      return res.status(400).send('Nothing to update on user ' + id);
    }

    const sql = 'UPDATE customers set ' + setStatements.join() + ' where id = ?';
    db.run(sql, valuesToUpdate.concat(id), function (error) {
      if (error) {
        console.log(error.message);
        return res.status(500).send(error.message);
      }

      return res.status(200).send('Updated customer ' + id + ' on the database successfully.');
    })

  });
});

router.post('/reservation', function(req, res) {
  // TODO read req.body.reservation, look up price by room id and insert reservation into DB
  res.status(400).send("No reservation data provided.");
});

router.get('/reservation/:id', function(req, res) {
  db.serialize(function() {
    const id = req.params.tagId;
    const sql = 'select * from reservations where ' + id;

    // TODO: add alternative that prevents sqlinjection

    db.get(sql, [],(err, rows) => {
      res.status(200).json({
        customers: rows
      });
    });
  });
});

router.get('/reservations', function(req, res) {
  // TODO read req.query.name or req.query.id to look up reservations and return
  res.status(200).json({
    reservations:[{
      title: 'Mr',
      firstname: 'Laurie',
      surname: 'Ainley',
      email: 'laurie@ainley.com',
      roomId: 1,
      checkInDate: '2017-10-10',
      checkOutDate: '2017-10-17'
    }]
  });
});

router.get('/reservations/date-from/:dateFrom', function(req, res) {
  // TODO read req.params.dateFrom to look up reservations and return
  res.status(200).json({
    reservations:[{
      title: 'Mr',
      firstname: 'Laurie',
      surname: 'Ainley',
      email: 'laurie@ainley.com',
      roomId: 1,
      checkInDate: '2017-10-10',
      checkOutDate: '2017-10-17'
    }, {
      title: 'Miss',
      firstname: 'Someone',
      surname: 'Else',
      email: 'someone@else.com',
      roomId: 2,
      checkInDate: '2017-11-12',
      checkOutDate: '2017-11-15'
    }]
  });
});

router.delete('/reservation/:id', function(req, res) {
  res.status(400).send("No valid reservation_id was provided.");
});

router.get('/reservations/for-customer/:customer_id', function(req, res) {
  res.status(400).send("No valid customer_id was provided.");
});

router.get('/rooms/available-in/:from_day/:to_day', function(req, res) {
  res.status(400).send("No valid date range was provided.");
});

// router.put('/invoice', function(req, res) {
//   // TODO read req.query.reservationId and req.body.invoice and insert into DB
//   res.status(200).json({
//     reservationId: req.query.reservationId,
//     invoice: req.body.invoice
//   });
// });
//
// router.post('/reviews', function(req, res) {
//   // TODO read req.body.review
//   res.status(200).json(req.body);
// });

// router.get('/room-types', function(req, res) {
//   // TODO return DB row here
//   res.status(200).json({
//     roomtypes: [{
//       id: 2,
//       name: 'premium',
//       standard_price: 60,
//       current_price: 50
//     }
//   ]});
// });

// router.put('/discount', function(req, res) {
//   // TODO read roomId from req.query.id and update discount
//   res.status(200).json({
//     id: req.query.id,
//     discount: req.body.discount
//   });
// });


module.exports = router;
