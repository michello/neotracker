var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/', function(req, res, next) {
  sql = "SELECT * FROM user WHERE username = '" + req.body.username + "' AND password = '"+ md5(req.body.password) + "';";
  db.query(sql, function(err, result) {
    if (result.length > 0) {
      req.session.user = result[0].username;
      req.session.password = req.body.password;
      req.session.name = result[0].first_name;
      req.session.permissions = result[0].isAdmin;
      res.redirect('/');
    } else {
      res.render('login', {message: "Invalid credentials!"});
    }
  })
});

module.exports = router;
