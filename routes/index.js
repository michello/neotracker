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
let weeks = {};
var posts = 0;


var sql = "SELECT SUM(post_count) as past_count FROM post WHERE date = '" + yesterday.date +"'";
db.query(sql, function(err, result) {
  if (result) {
      yesterday.posts -= result[0].past_count;
  }
  return(yesterday.posts);
});
console.log(yesterday.posts);

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
        console.log(yesterday.posts);
        sql = "SELECT post_count, username FROM post WHERE username ='"+person.username+"' AND date= '" + yesterday.date + "'";
        // getting the post count of the person before
        db.query(sql, function(err, result) {
          if (result.length > 0) {
            if (result[0].post_count < yesterday.members[String(person.username)]) {
              yesterday.users.push(person.username);
            }
          }
        });
      } else {
        console.log(result);
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

var promise = new Promise(function (resolve, reject) {
  sql = "SELECT * FROM week ORDER BY week desc limit 5";
  db.query(sql, function(err, result) {
    // looking at each available week
    result.forEach(function(week) {
      // console.log(moment(week.week).format("YYYY-MM-DD"));
      var currWeek = moment(week.week).format("YYYY-MM-DD");
      weeks[currWeek] = {};
    })
  })
});

promise.then(function() {
  for (currWeek in weeks.keys()) {
    for (i=0; i < 7; i++) {
      console.log(currWeek);
      // to get the number of posts made that day, we would have to subtract
      // the number of posts recorded for the day BEFORE from
      // number of posts recorded for that day
      var dayOf = moment(currWeek).add(i, 'day').format("YYYY-MM-DD");
      weeks[currWeek][dayOf] = {};
      weeks[currWeek][dayOf]['messages'] = 0;
      weeks[currWeek][dayOf]['new_mems'] = 0;
      /*
      sql = "SELECT SUM(post_count) as count FROM post WHERE date = '" + dayOf + "'";
      posts = db.query(sql, function(err, result) {
        // console.log(result[0].count);
        if (typeof result[0].count === 'number') {
          console.log("hey!");
          weeks[currWeek][dayOf]['messages'] = result[0].count;
        } else {
          weeks[currWeek][dayOf]['messages'] = 0;
        }
      }); */

  }

  }

})


/*
// looking at each day of that week
for (i=0; i < 7; i++) {
  // to get the number of posts made that day, we would have to subtract
  // the number of posts recorded for the day BEFORE from
  // number of posts recorded for that day
  var dayOf = moment(week.week).add(i, 'day').format("YYYY-MM-DD");
  weeks[currWeek][dayOf] = {};
  weeks[currWeek][dayOf]['messages'] = 0;
  weeks[currWeek][dayOf]['new_mems'] = 0;
  sql = "SELECT SUM(post_count) as count FROM post WHERE date = '" + dayOf + "'";
  posts = db.query(sql, function(err, result) {
    // console.log(result[0].count);
    if (typeof result[0].count === 'number') {
      console.log("hey!");
      weeks[currWeek][dayOf]['messages'] = result[0].count;
    } else {
      weeks[currWeek][dayOf]['messages'] = 0;
    }

    // console.log(weeks);
    // return(weeks[currWeek][dayOf]['messages']);
  });
  // weeks[currWeek][dayOf]['messages'] = posts;

}
*/
router.get('/', function(req, res, next) {
  res.render('index', {yesterday:yesterday});
});

module.exports = router;
