'use strict';

var express = require('express');
const path = require("path");
var app = express();
var mysql = require('mysql');
var schedule = require('node-schedule');
var monitor = require('./monitor');
var moment = require('moment');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var randomstring = require("randomstring");
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var router = express.Router();
const port = process.env.PORT || 8000;


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'neotracker_db'
});


connection.getConnection(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

global.db = connection;

schedule.scheduleJob({hour:0, minute:0}, () => {
  if (moment(Date.now()).day() == 1) {
    sql = "INSERT INTO week (week) VALUES ('"+ moment(Date.now()).format("YYYY-MM-DD") + "')"
    db.query(sql);
  }
  monitor.start();
});

// monitor.start();
var members = require('./routes/members');
var site = require('./routes/index');
var neomail = require('./routes/neomail');
var sendNeomail = require('./routes/create-neomail');
var login = require('./routes/login');
var logout = require('./routes/logout');
var register = require('./routes/register');

app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    rolling: true,
    resave: true,
    saveUninitialized: false,
    secret: randomstring.generate()
  })
);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// all the routes/paths
app.use('/', site);
app.use('/members', members);
app.use('/neomail', neomail);
app.use('/create-neomail', sendNeomail);
app.use('/login', login);
app.use('/logout', login);
app.use('/register', register);

app.use(router);

module.exports = app;

app.listen(port, () => {
  console.log('Listening on port ', port);
});
