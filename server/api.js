const express = require('express');
const router = express.Router();
const filename = './database/database.sqlite';
const sqlite3 = require( 'sqlite3' ).verbose();

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

  var sql = 'select * from customers';

  db.all(sql, [], (err, rows ) => {
    res.status(200).json({
      customers: rows
    });
  });
});


router.get('/customer/:id', function(req, res) {
  const id = req.params.id;
  const sql = 'select * from customers where id = ?';

  db.get(sql, [id], (err, rows) => {
    res.status(200).json(rows);
  });
});


router.get('/customers/:surname', function(req, res) {
  const surname = req.params.surname == undefined ?
    req.params.surname : '%' + req.params.surname + '%';
  const sql = 'select * from customers where surname like ?';

  console.log(sql);
  console.log(surname);
  db.all(sql, ['%'+surname+'%'], function(err, rows) {
    res.status(200).json({
      customers: rows
    });
  });
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

  const user = {
    title: req.body.title,
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email
  };

  console.log(req.body);

  db.run(`INSERT INTO customers (title, firstname, surname, email) VALUES (?, ?, ?, ?)`, [user.title, user.firstname, user.surname, user.email], function(err) {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }

    return res.status(201).send('Customer added successfully.');
  });
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

router.put('/customer/:id', function(req, res) {
  // EXPECTED JSON Object:
  // {
  //   title: 'Mr',
  //   firstname: 'Laurie',
  //   surname: 'Ainley',
  //   email: 'laurie@ainley.com'
  // }

  const id = req.params.id;

  const user = {
    title: req.body.title,
    firstname: req.body.firstname,
    surname: req.body.surname,
    email: req.body.email
  };

  // Functional and 'One function should only do one thing'
  const propsToUpdate = filterColumnsToUpdate(user);
  if (propsToUpdate.length == 0) {
    console.log('Nothing to update: bad request');
    return res.sendStatus(400, 'Nothing to update on user ' + id);
  }

  const setStatements = generateSetSubStatements(propsToUpdate);
  const valuesToUpdate = getValuesToUpdate(user, propsToUpdate);

  const sql = 'UPDATE customers set ' + setStatements.join() + ' where id = ?';
  db.run(sql, valuesToUpdate.concat(id), function (err) {
    if (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }

    return res.status(200).send('Updated customer ' + id + ' on the database successfully.');
  });
});

// ////////////////////////////////////
// STEP: Create reservations table
// TODO: create SQL file to insert a few reservations - should match the existing rooms and customer data.
// ////////////////////////////////////

router.get('/reservations', function(req, res) {
  const sql = 'select * from reservations';
  console.log(sql);

  db.all(sql, [], (err, rows) => {
    res.status(200).json({
      customers: rows
    });
  });
});


// Homework exercise - similar to what we already have
router.get('/reservation/:id', function(req, res) {
  const id = req.params.id;
  const sql = 'select * from reservations where id = ' + id;
  console.log(sql);

  db.get(sql, [], (err, rows) => {
    res.status(200).json({
      customers: rows
    });
  });
});


router.get('/reservations/starting-on/:startDate', function(req, res) {
  const startDate = req.params.from_day;
  const sql = 'select * from reservations where check_in_date = ?';

  db.all(sql, [startDate], (err, rows) => {
    res.status(200).json({
      customers: rows
    });
  });
});


// Stretch/Homework exercise
router.get('/reservations/active-on/:date', function(req, res) {
  const date = req.params.from_day;
  const sql = 'select * from reservations  \
      where check_in_date < ? and check_out_date > ?';

  db.all(sql, [date, date], (err, rows) => {
    res.status(200).json({
      customers: rows
    });
  });
});


// Stretch/Homework exercise
router.post('/reservation', function(req, res) {
  // EXPECTED JSON Object:
  // {
  //   customer_id: 1,
  //   room_id: 1,
  //   check_in_date: '2018-01-20',
  //   check_out_date: '2018-01-22',
  //   room_price: 129.90
  // }

  const reservation = {
    customer_id: req.body.customer_id,
    room_id: req.body.room_id,
    check_in_date: req.body.check_in_date,
    check_out_date: req.body.check_out_date,
    room_price: req.body.room_price
  }

  const sql = 'INSERT INTO reservations (customer_id, room_id, check_in_date, check_out_date, room_price) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [
    reservation.customer_id,
    reservation.room_id,
    reservation.check_in_date,
    reservation.check_out_date,
    reservation.room_price
  ], function(err) {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }

    return res.status(201).send('Reservation added successfully.');
  });
});


// ------------------------------------------------------------------------
// Second class practical part


router.get('/reservations/between/:from_day/:to_day', function(req, res) {
  const startDate = req.params.from_day;
  const endDate = req.params.to_day;

  const sql = '\
    select * from reservations \
    where check_in_date < ? \
    and check_out_date > ? \
    order by check_in_date';

  db.all(sql, [endDate, startDate], (err, rows) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }

    res.status(200).json({
      reservations: rows,
      startDate, endDate
    });
  });
});


router.get('/reservations/details-between/:from_day/:to_day', function(req, res) {
  const startDate = req.params.from_day;
  const endDate = req.params.to_day;

  const sql = '\
    select reservations.*, rooms.*, customers.* from reservations \
    join rooms on reservations.room_id = rooms.id \
    join customers on reservations.customer_id = customers.id \
    where check_in_date < ? \
    and check_out_date > ? \
    order by check_in_date';

  db.all(sql, [endDate, startDate], (err, rows) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }

    res.status(200).json({
      reservations: rows,
      startDate, endDate
    });
  });
});


router.delete('/reservation/:id/', function(req, res) {
  // SQL injected url to delete all reservation entries:
  // curl -X DELETE http://localhost:8080/api/reservation/6%20or%201%3D1

  const id = req.params.id;
  const sql = 'delete from reservations where id = ' + id;

  // alternative that prevents sql-injection
  // const sql = 'delete from reservations where id = ?';

  db.run(sql, [id], (err, rows) => {
    res.status(200).json({
      customers: rows
    });
  });
});


router.get('/reservations/for-customer/:customer_id', function(req, res) {
  const id = req.params.customer_id;

  const sql = 'select reservations.* \
    from reservations join customers \
    on customers.id = reservations.customer_id \
    where customers.id = ? \
    order by reservations.check_in_date';

  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }

    res.status(200).json({
      reservations: rows,
      customer_id: id,
    });
  });
});


router.get('/rooms/available-in/:from_day/:to_day', function(req, res) {
  const startDate = req.params.from_day;
  const endDate = req.params.to_day;

  const params = [endDate, startDate];
  const sql = 'select * \
      from rooms join room_types \
      on rooms.room_type_id = room_types.id \
      where rooms.id not in ( \
        select rooms.id from rooms join reservations \
        on rooms.id = reservations.room_id \
        where reservations.check_in_date < ? \
        and reservations.check_out_date > ? \
      )';

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }

    res.status(200).json({
      rooms: rows,
      startDate, endDate
    });
  });
});


function maybeDefineWhereClause(startDate, endDate) {
  let args = [];
  let maybeWhere = '';

  if (startDate != undefined || endDate != undefined) {
    maybeWhere = ' where'
  }

  if (startDate != undefined) {
    maybeWhere += ' reservations.check_out_date > ?';
    args = args.concat(startDate);
  }

  if (startDate != undefined && endDate != undefined) {
    maybeWhere += ' and';
  }

  if (endDate != undefined) {
    maybeWhere += ' reservations.check_in_date < ?'
    args = args.concat(endDate);
  }

  return {
    args, maybeWhere
  }
}


router.get('/reservations-per-room', function(req, res) {
  // Optional query parameters
  // .../most-reserved-rooms?limit=10
  // .../most-reserved-rooms?startDate=2018-01-01
  // .../most-reserved-rooms?endDate=2018-01-01

  const queryLimit = req.query.limit;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const {args, maybeWhere} = maybeDefineWhereClause(startDate, endDate);
  let completeArgs = args;

  let sql = 'select rooms.*, count(1) as count \
      from rooms join reservations \
      on rooms.id = reservations.room_id \
      ' + maybeWhere + ' \
      group by rooms.id \
      order by count desc';

  if (queryLimit != undefined) {
    completeArgs = completeArgs.concat(queryLimit);
    sql += ' limit ?';
  }

  db.all(sql, completeArgs, (err, rows) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send(err.message);
    }

    res.status(200).json({
      rooms: rows
    });
  });
});


// TODO: Use cases to include group by and other fancy stuff

// Stuff to delete - probably
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
