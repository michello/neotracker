var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var username = [];
var request = require('request');

function checkSignIn(req, res, next) {
  if (req.session.user && req.session.permissions)
      return next();
  var err = "You need to be logged in or you do not have the right permissions to view this page!";
  res.redirect('/', {error: err});
}


sql = "SELECT username FROM user";
db.query(sql, function(err, result) {
  result.forEach(function(user){
    username.push(user.username);
  });
});

router.get('/', checkSignIn, function(req, res, next) {
  res.render('create-neomail', {name: req.session.name, username:username});
});

router.post('/', function(req, res) {
  var recipients = [];

	if (typeof req.body.recipients === "string"  || req.body.recipients instanceof String) {
    recipients.push(req.body.recipients);
  } else {
    recipients = req.body.recipients;
  }

  var requests = request.defaults({
    jar: true,
    rejectUnauthorized: false,
    followAllRedirects: true
  });


    requests.post({
      uri: 'http://www.neopets.com/login.phtml',
      form: {
        username: req.session.user,
        password: req.session.password
      },
      headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
          'Content-Type' : 'application/x-www-form-urlencoded'
      },
      method: 'POST'

    }, function(err, resp, body) {
      recipients.forEach(function(user) {
				    sql = 'INSERT INTO neomail (date, sender, receiver, subj_line, content) VALUES (?, ?, ?, ?, ?)';
				    db.query(sql, [moment(Date.now()).format("YYYY-MM-DD"), req.session.user, user, req.body.neomail_title, req.body.neomail_content]);


            requests.post({
              uri: "http://www.neopets.com/process_neomessages.phtml",
              form: {
                recipient: user,
                subject: req.body.neomail_title,
                message_body: req.body.neomail_content,
                message_type: "notitle",
                neofriends: ""
              },
              headers: {
                  'Referer': "http://home.neopets.com/neomessages.phtml?type=send"
              },
              method: 'POST'
            })
          });
      })

      res.redirect('/neomail');

  })
//})

module.exports = router;
