var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
var Promise = require('promise');
var today_post;
var member;
var yesterday;
// weekly info
var weeks = [];
var posts = {}

function dayPost(date, yesterday) {
  var data = {};
  data['post_count'] = 0;
  data['members'] = 0;
  // var tracker;
  var sql = "SELECT username, post_count FROM post WHERE date =?";

  // getting all the names and post count of the members who posted today
  db.query(sql, [date], function(err, result) {
  //db.query(sql, function(err, result) {

    if (typeof result !== "undefined") {
      result.forEach(function(info) {
        var tracker = info.post_count;
        // the posts for the current day
        data['post_count'] += info.post_count;
        sql = "SELECT post_count FROM post WHERE date=? AND username=?";
        db.query(sql, [yesterday, info.username], function(err, result){

          if (typeof result[0] !== "undefined") {

            // if the posts for the day before is less than current day, user made a post
            if (tracker > result[0]['post_count']) {
                data['members'] += 1;
            }
            data['post_count'] -= result[0]['post_count'];
          }

        })
      });
    }
  });
  return(data);
}

sql = "SELECT * FROM week ORDER BY week desc limit 5";
db.query(sql, function(err, result) {
  // looking at each available week
  result.forEach(function(week) {
    weeks.push(moment(week.week).format("YYYY-MM-DD"));
    // going through each day of the week
    for (var i = 0; i < 7; i++) {
      var new_mem = 0;
      posts[moment(week.week).add(i, 'day').format("YYYY-MM-DD")] = {};
      posts[moment(week.week).add(i, 'day').format("YYYY-MM-DD")] = dayPost(moment(week.week).add(i+1, 'day').format("YYYY-MM-DD"), moment(week.week).add(i, 'day').format("YYYY-MM-DD"));//.toISOString());
      sql = "SELECT COUNT(*) as new_mem FROM user WHERE joined = ?;";
      db.query(sql, [moment(week.week).add(i, 'day').format("YYYY-MM-DD")], function(err, result){
        new_mem = result[0]['new_mem'];
      });
      posts[moment(week.week).add(i, 'day').format("YYYY-MM-DD")]['new_mem'] = new_mem;

    }
  })
});

router.get('/', function(req, res, next) {

  if (Object.keys(req.session).length > 0) {
    // console.log(posts);
    res.render('index', {name: req.session.name, posts:posts, weeks:weeks, yesterday:moment().subtract(1, 'day').format("YYYY-MM-DD")});
  } else {
    var error = "You need to be logged in to view this page!";
    res.render('login', { error: error});
  }
});

module.exports = router;
