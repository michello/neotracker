var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/login');
});

module.exports = router;
