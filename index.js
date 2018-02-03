'use strict';

const express = require( 'express' );
const bodyparser = require( 'body-parser' );
const class2 = require( './server/class2' );
const class3 = require( './server/class3' );

const app = express();

app.use( express.static( 'public' ));
app.use( bodyparser.json() );

app.use( '/api', class2 );
app.use( '/api', class3 );

app.listen( process.env.PORT || 8080 );
