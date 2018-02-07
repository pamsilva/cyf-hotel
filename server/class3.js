const express = require('express');
const sqlite3 = require( 'sqlite3' ).verbose();

const filename = './database/database.sqlite';
let db = new sqlite3.Database(filename);

const router = express.Router();


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


router.delete('/reservations/:id/', function(req, res) {
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

module.exports = router;
