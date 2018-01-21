var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/', function(req, res, next) {
  console.log(req.session.user);
  console.log(req.session.password);
  res.render('login');
});

router.post('/', function(req, res, next) {
  sql = "SELECT * FROM user WHERE username = '" + req.body.username + "' AND password = '"+ req.body.password + "';";
  db.query(sql, function(err, result) {
    if (result.length > 0) {
      req.session.user = result[0].username;
      req.session.password = result[0].password;
      req.session.name = result[0].first_name;
      req.session.permissions = result[0].isAdmin;
      res.redirect('/');
    } else {
      res.render('login', {message: "Invalid credentials!"});
    }
  })
});

module.exports = router;
