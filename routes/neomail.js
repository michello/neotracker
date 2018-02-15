var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var neomails = {};
/*
neomails structure:
{
  date: [ {title: '', sender:'', content:'', recipients:[]},
          {title: '', sender:'', content:'', recipients:[]}
  ]
}
*/
function checkSignIn(req, res, next) {
  if (req.session.user && req.session.permissions)
      return next();

  res.redirect('/');
}
router.get('/', checkSignIn, function(req, res, next) {

  sql = "SELECT * FROM neomail;";
  db.query(sql, function(err, result) {
    var id = 0;
    result.forEach(function(neomail) {
      var date = moment(neomail.date).format("YYYY-MM-DD");
      if (!neomails[date]) {
        neomails[date] = []
        neomails[date].push({
          'id': id,
          'title': neomail.subj_line,
          'sender': neomail.sender,
          'content': neomail.content,
          'recipients': []
        });
        neomails[date][0].recipients.push(neomail.receiver);
      } else {
        var flag = false;
        neomails[date].forEach(function(mail) {
          if (mail.title === neomail.subj_line && mail.sender === neomail.sender && mail.content === neomail.content) {
            mail.recipients.push(neomail.receiver);
            flag = true;
          }
        });
        if (!flag) {
          neomails[date].push({
            'id': id,
            'title': neomail.subj_line,
            'sender': neomail.sender,
            'content': neomail.content,
            'recipients': []
          });
          neomails[date][Object.keys(neomails[date]).length - 1].recipients.push(neomail.receiver);
        }
      }
      id += 1;
    });
  });


  //getNeomail();
  res.render('neomail', {name: req.session.name, neomails:neomails});
});

module.exports = router;
