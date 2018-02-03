# Code Your Future DB Module Exercises

## Installation

Install the dependencies using `npm i`.

Launch server using `npm start` and go to [http://localhost:8080/](http://localhost:8080/)

## Introduction

This exercise involves implementing various aspects of a hotel booking system. It involves a variety of operations on the database to fetch, insert and update data.

The tasks build on your previous experience using SQL with SQLite and Node.js. The key components of the application are as follows:

* `index.js` - sets up the application for use
* `server/class2.js` - router for simple application logic and interaction with the database;
* `server/class3.js` - routes for advanced application logic and interaction with the database;
* `database/database.sqlite` - SQLite database containing some seed data

In order to interact with the server we will be using [Postman]() to perform the HTTP requests.

## Database Schema

![ERD](http://i.imgur.com/Wlqfao1.png)

**Note** For simplicity, the exercises on this module will focus on the following tables: `customers`, `rooms`, `reservations` and `room_types`.


## Instructions

In order to complete the exercises below, you will need to edit the code in `/server/class2.js` and `/server/class3.js`, generally guided by the TODO comments.


# Class 2

Use `/server/class2.js` for the exercises of this class.


### Exercise
**User Story:** As a staff member, I want to be able to view a list of customers so that I can see who has visited our hotel.

Use what you have learned about to SQL to fill in the query that fetches all the customers from the database.

- simple select everything


### Exercise
**User Story:** As a staff member I need to check the details of a given customer given its id.

Complete the end-point `/customers/:id`, so that it extracts that customer information from the database, and replies back with that information as JSON.

- select and filter by id


### Exercise
**User Story:** As a staff member I want to search for a customer through its `surname`, but we don't know that it might be misspelled.

Complete the end-point `/customers/:surname`, so that it extracts that customer information from the database, and replies back with that information as JSON. Consider using `like` instead of `=` to filter the customers.

- select and filter through like


### Exercise
**User Story:** As a guest, I want to register my details in the system so that I can check availability for my stay.

Take the data being POSTed to the `/customers` endpoint and insert it into the database.

- insert into


### Exercise
**User Story:** As a guest, I noticed that there is a typo on my details and wish to correct it.

Take the data being PUTed to the `/customers/:id` endpoint and update the corresponding entry on the database.

Note that the end-point should properly detect which customer properties are being updated, and generate the appropriate SQL update statement.

- update table


### Exercise

**Task**: Add the `reservations` table to the database - and schema file - so that we start handling reservations.

Then run the provided `reservations.sql` in order to insert a few reservation entries.

- create table
- insert into


### Exercise
**User Story:** As a staff member, I want to get a list of all the existing reservations.

Create an end-point to get from `/reservations` all existing reservations.

- simple select
- create the enpoint from scratch


### Exercise
**User Story:** As a customer, I want to check the details of a reservation.

Create and end-point to get from `/reservations/:id` the details of a resrevation through its `id`.

- simple filtering
- create the enpoint from scratch


### Exercise
**User Story:** As a staff member, I want to get a list of all the reservations that start at a given date.

Create and end-point to get from `/reservations/starting-on/:startDate` all the reservations that start at a given date.

- simple filtering
- create the enpoint from scratch


### Exercise
**User Story:** As a staff member, i want to get a list of all the reservations that are active at a given date.

Create and end-point to get from `/reservations/active-on/:date` all the reservations that are active on a given date - some customer has a room reserved on that day.

- multiple filtering.
- create the enpoint from scratch



### Exercise
**User Story:** As a staff member, I want to create a new reservation.

Create and end-point to post a new reservation to `/reservations/`.

- insert into
- create the enpoint from scratch


# Class 3

Use `/server/class3.js` for the exercises of this class.


### Exercise
**User Story:** As a staff member, I want to get a list of all the reservations that are active within a period of time

Create an end-point to get from `/reservations/between/:from_day/:to_day` all the reservations that are active within a particular date range.

- Multiple filters
- More elaborate logic


### Exercise
**Task** Change the previous enpoint to deliever details about the rooms and customers that the reservarions reffer to.

- multiple joins


### Exercise
**User Story:** As a staff member, I want to delete a canceled reservation from the database.

Create an end-point to delete a given reservation from `/reservation/:id/`.

- delete
- sql-injection


**Sub-Task** Try calling that endpoin with provided delete request.
**TODO:** Define the request in a way that the students can execute.
**Sub-Task** Fix the current endpoint, as well as all the existing ones, to use sql parameters in order to preven sql-injection.


### Exercise
**User Story:** As a staff member, I want to get all the reservations for a target customer-id.

Create an end-point that gets from `/reservations/for-customer/:customer_id` all the reservations for a particular customer.

- join
- filtering the join


### Exercise
**User Story:** As a customer, I want to get a list of the available rooms within a date range, so that I can make my reservation. Also, I need the details of the room type in order to choose the best room possible.

Create and end-point that gets from `/rooms/available-in/:from_day/:to_day` the rooms available within a date range.

- join
- filtering the join
- sub-query
- join and filtering on sub-query


### Exercise
**User Story:** As a manager, I want to get a list of the reservations each room has had, so that I can evaluate which are the preffered rooms. In addition, I need to be able to:
- get a limited number of results - as in the top 10 most reserved rooms,
- filter for a particular time range (e.g. checking which roms usually get more reservations during summer, or during winter).

Create and end-point that gets from `/reservations-per-room` the number of reservations each room has. Additionally, use query parameters to make it possible to limit the number of results, and/or filter the results by a specific date range.

- join
- filtering the join
- group by
- limit
