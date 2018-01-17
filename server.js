var express = require('express');
const path = require("path");
var app = express();
var mysql = require('mysql');
var schedule = require('node-schedule');
var monitor = require('./monitor');
var moment = require('moment');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'neotracker_db'
});

connection.connect();
global.db = connection;

schedule.scheduleJob({hour: 0, minute: 1}, () => {
  if (moment(Date.now()).day() == 1) {

    sql = "INSERT INTO week (week) VALUES ('"+ moment(Date.now()).format("YYYY-MM-DD") + "')"
    db.query(sql);
  }
  monitor.start();
});

var members = require('./routes/members');
var site = require('./routes/index');
var neomail = require('./routes/neomail');
var sendNeomail = require('./routes/create-neomail');
var login = require('./routes/login');
var logout = require('./routes/logout');

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(session({secret: "Your secret key"}));

// all the routes/paths
app.use('/', site);
app.use('/members', members);
app.use('/neomail', neomail);
app.use('/create-neomail', sendNeomail);
app.use('/login', login);
app.use('/logout', login);

module.exports = app;
function checkSignIn(req, res) {
  if (req.session.user) {
    next();
  } else {
    var err = new Error("Not logged in!");
    res.redirect('/login');
  }
}


app.post('/processing-neomail', checkSignIn, function(req, res) {
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
          if (err) {
            res.render('./routes/test', {resp:resp});
          }
          res.render('test', {resp:resp});
        });
      });

    // res.redirect('/neomail')
  })
})

var listener = app.listen(8000, function(){
  console.log('Listening on port ' + listener.address().port);
});
