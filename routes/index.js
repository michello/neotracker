var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var cheerioTableParser = require('cheerio-tableparser');
const isHtml = require('is-html');
const util = require('util');
const htmlparser2 = require('htmlparser2');

var jQuery = require('jquery');
var jsdom = require('jsdom');

var data;
var $;

var req = request.defaults({
  jar: true,
  rejectUnauthorized: false,
  followAllRedirects: true
})

req.post({
  uri: 'http://www.neopets.com/login.phtml',
  form: {
    username: 'mochadroppe',
    password: 'everafter97'
  }

}, function(err, resp, body) {
  req.get({
    url: "http://www.neopets.com/guilds/guild_members.phtml?id=4168178",
  }, function(err, resp, body){
    jsdom.env({
          html: body,
          scripts: [
            'http://code.jquery.com/jquery-1.5.min.js'
          ],
          done: function (err, window) {
            var $ = window.jQuery;
            data = $('table').length;
            console.log(window.location.href);
            console.log(data);
          }
        });

        /*
      const $ = cheerio.load(body);
      // const $ = require('jquery')(require("node-jsdom").jsdom().parentWindow);
      // $ = cheerio.load(body);
      // var info = $('table')[3][parent];


      for (i = 0; i < 10; i++) {
        console.log($('table')[i].html());
      }
      // data = $('table')[3].parent.children[1].children[1].children[1];
      */
  });
});

router.get('/', function(req, res, next) {
  res.render('index', {title: data});
});

module.exports = router;
