var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var username =[]
var moment = require('moment');

var year = moment().year();
var current = moment().month();
var current_month = moment([year, current, 10]).format("YYYY-MM-DD");
var last_month = moment(current_month).subtract(1, "months").format("YYYY-MM-DD");

var dates = [last_month, current_month];
var info = {};
dates.forEach(function(date) {
  info[date] ={};
});

dates.forEach(function(date) {
  sql = "SELECT * FROM post WHERE date = '"+date+"' GROUP BY username";
  db.query(sql, function(err, result) {
    if (typeof result !== 'undefined') {
      result.forEach(function(item){

        info[moment(date).format("YYYY-MM-DD")][item.username] = ""
        info[moment(date).format("YYYY-MM-DD")][item.username] = item.post_count;

      });
    }
  });
});

sql = "SELECT username FROM user";
db.query(sql, function(err, result) {
  result.forEach(function(user){
    username.push(user.username);
  });
});



router.get('/', function(req, res, next) {
  res.render('members', {info:info, username:username, dates:dates});
});

module.exports = router;
