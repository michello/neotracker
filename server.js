var express = require('express');
var mysql = require("mysql");
const path = require("path");
var site = require('./routes/index');

var request = require('request');
var CircularJSON = require('circular-json');
var stringify = require('json-stringify-safe');
var request = require('request');
var cheerio = require('cheerio');

var moment = require('moment');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "neotracker_db"
});

function insert(data) {
  // check if user exists first
  conn.connect(function(err){
    if (err) {
      console.log(err);
      return;
    }
    console.log("Connection with database established!");
  });
}

var req = request.defaults({
  jar: true,
  rejectUnauthorized: false,
  followAllRedirects: true
});

req.post({
  uri: 'http://www.neopets.com/login.phtml',
  form: {
    username: 'mugennohoshi',
    password: 'shootingforstars97'
  },
  headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
      'Content-Type' : 'application/x-www-form-urlencoded'
  },
  method: 'POST'

}, function(err, resp, body) {
  req.get({
    url: "http://www.neopets.com/guilds/guild_members.phtml?id=4168178",
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
        'Content-Type' : 'application/x-www-form-urlencoded'
    },
    method: 'GET'
  }, function(err, resp, body){

    const $ = cheerio.load(body);
    var rowData;

    tableData = $('table')[14];
    rowData = $(tableData).find('tr');


    for (j=1;j<(rowData.length); j++) {
      let data = {}
      data.time = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      let account = rowData[j].children[0].children[0].children[0];
      let num_post;
      if (typeof CircularJSON.stringify(account.children[0]) != 'undefined') {
        data.username = account.children[0].children[0].data;
      } else {
        data.username = account.next.next.children[0].children[0].data;
      }
      data.num_post = rowData[j].children[0].next.next.next.children[0].children[0].data;
      insert(data);
    };

  });
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
