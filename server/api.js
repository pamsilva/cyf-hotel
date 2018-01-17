const express = require('express');
const router = express.Router();
const filename = './database/database.sqlite';
const sqlite3    = require( 'sqlite3' ).verbose();

// open the database
let db = new sqlite3.Database(filename);

router.get('/customers', function(req, res) {

  res.status(200).json({
    customers: [{
      id: 2,
      title: 'Mr',
      firstname: 'Laurie',
      surname: 'Ainley',
      email: 'laurie@ainley.com'
    }
  ]});

  // TODO comment out response above and uncomment the below
  // db.serialize(function() {
  //
  //   var sql = 'select * from customers';
  //
  //   db.all(sql, [],(err, rows ) => {
  //     res.status(200).json({
  //       customers: rows
  //     });
  //   });
  // });

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

  db.serialize(function() {
    // EXAMPLE CURL REQUEST
    // curl -X POST -d @payload.json http://localhost:8080/api/customer --header "Content-Type:application/json"

    const user = {
      title: req.body.title,
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email
    };

    db.run(`INSERT INTO customers (title, firstname, surname, email) VALUES (?, ?, ?, ?)`, [user.title, user.firstname, user.surname, user.email], function(error) {
      if (error) {
        return console.log(error.message);
      }

      console.log('Inserted 1 customer on the database.')
      return res.sendStatus(201);
    });
  })
});

router.post('/reservations', function(req, res) {
  // TODO read req.body.reservation, look up price by room id and insert reservation into DB
  res.status(200).json(req.body.reservation);
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
