# Code Your Future DB Exercise 3

## Installation

Install the dependencies using `npm i`.

Launch server using `npm start` and go to [http://localhost:8080/](http://localhost:8080/)

## Introduction

This exercise involves implementing various aspects of a hotel booking system. It involves a variety of operations on the database to fetch, insert and update data.

The tasks build on your previous experience using SQL with SQLite and Node.js. The key components of the application are as follows:

* `index.js` - sets up the application for use
* `server/api.js` - routes and application logic for the API
* `public/*` - each folder contains the front-end code that interacts with the API for each exercise below
* `database/database.sqlite` - SQLite database containing some seed data

Below is the database schema that will be used for the exercise.

## Database Schema

![ERD](http://i.imgur.com/Wlqfao1.png)

## Instructions

In order to complete the exercises below, you will need to edit the code in `/server/api.js`, generally guided by the TODO comments.

Go to http://localhost:8080/ to get started.

# Class 2

**User story:** As a staff member, I want to be able to view a list of customers so that I can see who has visited our hotel

An example has been provided for this exercise, showing how to interact with the SQLite database. Simply uncomment the TODO section, and comment out the existing JSON response being returned.

Or:

Use what you have learned about to SQL to fill in the query that fetches all the customers from the database.

- simple select everything

**User story:** As a staff member I need to check the details of a given customer given its id.

Complete the end-point `/customer/:id`, so that it extracts that customer information from the database, and replies back with that information as JSON.

- simple and single filter by id

**User story:** As a staff member I want to search for a customer through its `surname`.

Complete the end-point `/customers/:surname`, so that it extracts that customer information from the database, and replies back with that information as JSON.

- select and filter through like

**User story:** As a guest, I want to register my details so that I can check availability for my stay

Take the data being POSTed to the `/customer` endpoint and insert it into the database.

- insert into

**User story:** As a guest, I noticed that there is a typo on my details and wish to correct it.

Take the data being PUTed to the `/customer/:id` endpoint and update the corresponding entry on the database.

Note that the end-point should properly detect which cuseomer properties are being sent to update, and generate the appropriate SQL update statement.

- update table

**Task:** Add the `reservations` table to the datbase - and schema file - so that we start handling reservations.

- create table

Then run the provided `reservations.sql` in order to insert a few reservation entries.

**User story** As a staff member, I want to get a list of all the existing reservations.

Create an end-point to get from `/reservations` all existing reservations.

- simple select
- create the enpoint from scratch

**User story** As a customer, I want to check the details of by reservation.

Create and end-point to get from `/reservation/:id`, the information of a given resrevation.

- simple filtering

**User story** As a staff member, I want to get a list of all the reservations that start at a given date.

Create and end-point to get from `/reservations/starting-on/:startDate`, all the reservations that start at a given date.

- Simple filtering

**User story** As a staff member, i want to get a list of all the reservations that are active at a given date.

- Multiple filtering.


# Class 3

**User story** As a staff member, I want to get a list of all the reservations that are active within a period of time

- Multiple filters
- More elaborate logic

**User story:** As a staff member, I want to delete a canceled reservation from the database.

- delete
- introduce sql-injection

**Sub-Task** Fix the current endpoint, as well as all the existing ones, to use sql parameters in order to preven sql-injection.

**User story:** As a staff member, I want to get all the reservations for a target customer-id.

- join
- filtering the join

**User story** As a staff member, I want to get a list of all the reservations active within a specific date range, including room and customer information, ordered by `check_in_date`.

- Multiple filters.
- Multiple joins.
- Ordered

**User story** As a customer, I want to get a list of the available rooms withing a date range, so that I can make my reservation.

I need the details of the room type in order to choose the best room possible.

- join
- filtering the join
- sub-query
- join and filtering on sub-query


**User story** As a manager, I want to get a list of the reservations each room has ad, so that I can evaluate which are the most proffitable, and which are the preffered rooms. In addition, I need to be able to:
  - get a limited number of results - as in the top 10 most reserved rooms,
  - filter for a particular time range (e.g. checking which roms usually get more reservations during summer, or during winter).
  - specify which

- join
- filtering the join
- group by
- limit
