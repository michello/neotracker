var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var Promise = require('promise');


// daily info
var yesterday = {}
yesterday.date = moment().subtract(1, 'day').format("YYYY-MM-DD");
yesterday.today = moment(Date.now()).format("YYYY-MM-DD");
yesterday.posts = 0;
yesterday.users = [];
yesterday.members = {}
yesterday.newMembers = []

// weekly info
var weeks = [];
var posts = {}

function checkSignIn(req, res, next, err) {
  if (err) {
    console.log(err);
  }
  if (req.session.user) {
    next();
  } else {
    var err = new Error("Not logged in!");
    res.redirect('/login');
  }
}

var sql = "SELECT SUM(post_count) as past_count FROM post WHERE date = '" + yesterday.date +"'";
db.query(sql, function(err, result) {
  if (result) {
      yesterday.posts -= result[0].past_count;
  }
  return(yesterday.posts);
});

sql = "SELECT username FROM user WHERE isActive=1";
db.query(sql, function(err, result) {
  // iterating through each member
  result.forEach(function(person) {
    sql = "SELECT post_count, username FROM post WHERE username = '"+person.username+"' AND date = '" + yesterday.today +"'";
    // getting the post count of the person today
    db.query(sql, function(err, result) {
      if (result.length > 0) {
        yesterday.members[String(person.username)] = result[0].post_count;
        yesterday.posts += result[0].post_count;
      //  console.log(yesterday.posts);
        sql = "SELECT post_count, username FROM post WHERE username ='"+person.username+"' AND date= '" + yesterday.date + "'";
        // getting the post count of the person before
        db.query(sql, function(err, result) {
          if (result.length > 0) {
            if (result[0].post_count < yesterday.members[String(person.username)]) {
              yesterday.users.push(person.username);
            }
          }
        });
      }



    })
  });

  // can just count the number of users who joined instead of creating an array
  // fix later
  sql = "SELECT * FROM user WHERE joined = '" + yesterday.today + "'";
  db.query(sql, function(err, result) {
    result.forEach(function(item){
      yesterday.newMembers.push(item.username);
    });
  });

});

sql = "SELECT * FROM week ORDER BY week desc limit 5";
db.query(sql, function(err, result) {
  // looking at each available week
  result.forEach(function(week) {
    weeks.push(moment(week.week).format("YYYY-MM-DD"));
  })
});

sql = "SELECT date, SUM(post_count) as post_total FROM post GROUP BY date;";
db.query(sql, function(err, result) {
  result.forEach(function(week) {
    posts[moment(week.date).format("YYYY-MM-DD")] = week.post_total;
  });
});

router.get('/', checkSignIn, function(req, res, next) {
  res.render('index', {yesterday:yesterday, posts:posts, weeks:weeks});
});

module.exports = router;
