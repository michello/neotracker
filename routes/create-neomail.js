var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var username = [];

sql = "SELECT username FROM user";
db.query(sql, function(err, result) {
  result.forEach(function(user){
    username.push(user.username);
  });
});

router.get('/', function(req, res, next) {
  res.render('create-neomail', {username:username});
});

module.exports = router;
