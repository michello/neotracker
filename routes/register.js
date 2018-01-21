var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var md5 = require('md5');

function checkSignIn(req, res, next) {
  if (req.session.user) {
    var err = "You're already signed in!";
    res.redirect('/', {error: err});
  } else {
    return next();
  }
}

router.get('/', checkSignIn, function(req, res, next) {
  res.render('register');
});

router.post('/', function(req, res) {
  var user = req.body.username;
  var password = req.body.password;
  var err = "";
  sql = "SELECT * FROM user WHERE user=? AND isAdmin=1";
  db.query(sql, [user], function(err, result) {
    if (result) {
      sql = "UPDATE user SET password ='"+ md5(password) +" WHERE username='"+user+"'";
      db.query(sql);
    } else {
      err = "You are not authorized to create an account!";
    }
  })
  res.render('/login', {error: err});
});


module.exports = router;
