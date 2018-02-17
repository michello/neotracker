var request = require('request');
var CircularJSON = require('circular-json');
var stringify = require('json-stringify-safe');
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var today = moment(Date.now()).format("YYYY-MM-DD");

function userExists(data) {
  var sql = "SELECT * FROM user WHERE username='"+data.username+"'";
  var query = db.query(sql, function(err, result) {
    if (result.length === 0) {
        sql = "INSERT INTO user (username, password, first_name, isAdmin, isActive, joined) VALUES ('"+ data.username + "', '', '', false, true, '" + today +"')";
        db.query(sql);
    }
  });
  insertData(data);
}

function insertData(data) {
  var sql = "INSERT INTO post (date, username, post_count) VALUES (TIMESTAMP('" + data.date + "'), '" + data.username + "', " + data.post_count+ ")";
  db.query(sql, data, function(err, result) {
      if (err) {
        console.log(data.post)
      }
  });
  return;
}

exports.start = function () {
  var req = request.defaults({
    jar: true,
    rejectUnauthorized: false,
    followAllRedirects: true
  });

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
    req.get({
      url: "http://www.neopets.com/guilds/guild_members.phtml?id=4168178",
      headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
          'Content-Type' : 'application/x-www-form-urlencoded'
      },
      method: 'GET'
    }, function(err, resp, body){
      const $ = cheerio.load(body);
      var rowData;
      var tableData = $('table')[14];
/*
      switch (tableData.textContent.indexOf("There is currently")) {
        case -1:
          tableData = $('table')[14]
      }
*/
    //  rowData = $(tableData).find('tr');
      // console.log(rowData[0].children[0].data);
/*
      if (rowData[0].indexOf("There is currently") === -1) {
        console.log(rowData[0]);
        tableData = $('table')[14];
      } else {
        tableData = $('table')[15];
      }
*/

      rowData = $(tableData).find('tr');

      for (j=1;j<(rowData.length); j++) {
        let data = {}
        data.date = moment(Date.now()).format("YYYY-MM-DD");
        let account = rowData[j].children[0].children[0].children[0];
        let num_post;
        if (typeof CircularJSON.stringify(account.children[0]) != 'undefined') {
          data.username = account.children[0].children[0].data;
        } else {
          data.username = account.next.next.children[0].children[0].data;
        }
        data.post_count = rowData[j].children[0].next.next.next.children[0].children[0].data;
        userExists(data);
      }

    });
  });

}
