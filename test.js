var request = require('request');

var requests = request.defaults({
  jar: true,
  rejectUnauthorized: false,
  followAllRedirects: true
});

requests.post({
  uri: 'http://www.neopets.com/login.phtml',
  form: {
    username: 'mochadroppe',
    password: 'everafter97'
  },
  headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
      'Content-Type' : 'application/x-www-form-urlencoded'
  },
  method: 'POST'

}, function(err, resp, body) {

    requests.post({
      uri: "http://www.neopets.com/process_neomessages.phtml",
      form: {
        recipient: 'mugennohoshi',
        subject: 'hello',
        message_body: 'hello world!',
        message_type: "notitle",
        neofriends: ""
      },
      headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': "http://www.neopets.com/neomessages.phtml?type=send"
      },
      method: 'POST'
    }, function(err, resp, body){
      console.log("hello")
    });
  });
