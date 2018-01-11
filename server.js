var express = require('express');
const path = require("path");
var app = express();
var mysql = require('mysql');
var schedule = require('node-schedule');
var monitor = require('./monitor');


schedule.scheduleJob('0 0 * * *', () => {
  monitor.scrape();
});

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'neotracker_db'
});

connection.connect();
global.db = connection;

var site = require('./routes/index');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));

// all the routes/paths
app.use('/', site);

app.use(function(req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

module.exports = app;

var listener = app.listen(8000, function(){
  console.log('Listening on port ' + listener.address().port);
});
