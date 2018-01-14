var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var username =[]
var moment = require('moment');

var dates = ['2018-01-10', '2018-02-10'];
var info = {'2018-01-10':{}, '2018-02-10':{}};
dates.forEach(function(date) {
  sql = "SELECT * FROM post WHERE date = '"+date+"' GROUP BY username";
  db.query(sql, function(err, result) {
    if (typeof result !== 'undefined') {
      result.forEach(function(item){
        info[date][item.username] = ""
        info[date][item.username] = item.post_count;
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
  res.render('members', {info:info, username:username});
});

module.exports = router;
