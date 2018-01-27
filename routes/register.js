var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');
var warning;

function checkSignIn(req, res, next) {
  if (!req.session.user) {
    return next();
  } else {
    var warning = "You're already signed in!";
    res.render('login', {error: warning});
  }
}

router.get('/', checkSignIn, function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res) {
  var user = req.body.username;
  var password = req.body.password;

  sql = "SELECT * FROM user WHERE user=? AND isAdmin=1";
  db.query(sql, [user], function(err, result) {
    if (!result) {
      warning = true;
    } else {
      warning = false;
      console.log("hello this is",result);
      sql = "UPDATE user SET password =? WHERE username=?";
      db.query(sql, [md5(password), user]);
    }
  });

  console.log(warning);
  if (warning) {

    res.render('register', {error: "You do not have permissions to register."});
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
