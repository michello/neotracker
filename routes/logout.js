var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    delete req.session.name;
    delete req.session.name;
    delete req.session.permissions;
    req.session.destroy(function(){
      console.log("user logged out.")
    });
    res.redirect('/login');
});

module.exports = router;
