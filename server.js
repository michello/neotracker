var express = require('express');
var mysql = require("mysql");
const path = require("path");

var home = require('./routes/index');



var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "neotracker_db"
});

conn.connect(function(err){
  if (err) {
    console.log(err);
    return;
  }
  console.log("Connection with database established!");
});

var app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));

app.use(function(req, res, next){
  req.con = conn;
  next();
});

// all the routes/paths
app.use('/', home);

app.use(function(req, res, next) {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

module.exports = app;

var listener = app.listen(8000, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
