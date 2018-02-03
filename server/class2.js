const express = require('express');
const sqlite3 = require( 'sqlite3' ).verbose();

const filename = './database/database.sqlite';
let db = new sqlite3.Database(filename);

const router = express.Router();


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


router.get('/customers/:id', function(req, res) {
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


router.post('/customers/', function(req, res) {
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

router.put('/customers/:id', function(req, res) {
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
router.get('/reservations/:id', function(req, res) {
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
router.post('/reservations', function(req, res) {
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

module.exports = router;
