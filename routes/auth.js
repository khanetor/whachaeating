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

router.put('/update_profile', function(req, res) {
  var username = req.user.username;
  User.findOne({ username : username}, function(err, user) {
    if (!err) {
      if (!user) {
        res.json(400, { message : 'This user does not exist.'});
      } else {
        user.on_a_diet = req.body.profile.on_a_diet || user.on_a_diet;
        user.is_a_vegan = req.body.profile.is_a_vegan || user.is_a_vegan;
        user.allergic_to_peanut = req.body.profile.allergic_to_peanut || user.allergic_to_peanut;
        user.allergic_to_sesami = req.body.profile.allergic_to_sesami || user.allergic_to_sesami;

        user.save(function(err) {
          if (!err) {
            res.json({ message : 'User profile has been updated' });
          } else {
            res.json(500, { message : 'Cannot save user profile' });
          }
        });
      }
    } else {
      res.json(500, { message : 'Something is wrong.'});
    }
  });
});

module.exports = router;