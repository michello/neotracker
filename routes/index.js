var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');

var yesterday = {}

yesterday.date = moment().subtract(1, 'day').format("YYYY-MM-DD");
yesterday.today = moment(Date.now()).format("YYYY-MM-DD");
yesterday.posts = 0;
yesterday.users = [];
yesterday.newMembers = []

let yesterdayCount = 0;
let todayCount = 0;

var sql = "SELECT SUM(post_count) as past_count FROM post WHERE date = '" + yesterday.date +"'";
db.query(sql, function(err, result) {
  yesterday.posts -= result[0].past_count;
});

sql = "SELECT username FROM user WHERE isActive=1";
var query = db.query(sql, function(err, result) {

  result.forEach(function(item) {

    sql = "SELECT post_count, username FROM post WHERE username = '"+item.username+"' AND date = '" + yesterday.today +"'";
    db.query(sql, function(err, result) {
      result.forEach(function(item){
        if (typeof item.post_count == "number") {
          yesterday.posts += item.post_count;
          yesterday.users.push(item.username);
        }
      });
    });

    sql = "SELECT * FROM user WHERE joined = '" + yesterday.today + "'";
    db.query(sql, function(err, result) {
      result.forEach(function(item){
        if (typeof item.post_count == "number") {
          yesterday.newMembers.push(item.username);
        }
      });
    });
  });

});

router.get('/', function(req, res, next) {
  res.render('index', {yesterday:yesterday});
});

module.exports = router;
