var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var username = [];
var request = require('request');

function checkSignIn(req, res, next) {
  if (req.session.user && req.session.permissions)
      return next();
      
  res.redirect('/');
}

sql = "SELECT username FROM user";
db.query(sql, function(err, result) {
  result.forEach(function(user){
    username.push(user.username);
  });
});

router.get('/', checkSignIn, function(req, res, next) {
  res.render('create-neomail', {username:username});
});

router.post('/', function(req, res) {
  var username = 'mochadroppe';
  var recipients = req.body.states;
  var subjectLine = req.body.neomail_title;
  var content = req.body.neomail_content;

  var req = request.defaults({
    jar: true,
    rejectUnauthorized: false,
    followAllRedirects: true
  });


  recipients.forEach(function(user) {
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

        req.post({
          uri: "http://www.neopets.com/process_neomessages.phtml",
          form: {
            recipient: user,
            subject: subjectLine,
            message_body: content,
            message_type: "notitle",
            neofriends: ""
          },
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
              'Content-Type': 'application/x-www-form-urlencoded',
              'Referer': "http://www.home.neopets.com/neomessages.phtml?type=send"
          },
          method: 'POST'
        }, function(err, resp, body){
          res.redirect('/neomail');
        });
      });
  })
})

module.exports = router;
