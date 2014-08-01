var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var User = require('../models/user');

var secret = 'this is my super secret key';

router.post('/login', function(req, res) {
  var profile = {
    username : req.body.username
  };
  var token = jwt.sign(profile, secret, { expiresInMinutes : 5 });
  
  res.json({
    token : token
  });
});

router.post('/register', function(req, res) {
  var profile = {
    username : req.body.username
  };
  User.findOne({ username : profile.username }, function(err, user) {
    if (!err) {
      if (user) {
        res.json(403, { message : 'This username has been taken.'});
      } else {
        var newUser = new User();
        newUser.username = profile.username;
        newUser.save(function(err) {
          if (!err) {
            res.json(201, { message : 'Registration was successful. Your username is ' + profile.username });
          }
        });
      }
    }
  })
});

// router.use('/', expressJwt({ secret : secret }));

module.exports = router;