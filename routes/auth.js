var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Post = require('../models/post');
var router = express.Router();
var crypto = require("crypto");

router.get('/register', function(req, res) {
  res.render('/register', { active: 'register', title: 'Register' });
});

router.get('/login', function(req, res) {
  res.render('/login', { active: 'login', title: 'Login', user:req.user });
});

router.post('/register', function(req, res, next) {
var username=req.body.username.replace(/[^\x00-\x7F]/g, "");
   if (username=="" || username==" " || username=="  " || username=="   "){
    return res.render("index", {
        info: "Username cannot be blank!",
        active: 'index'
      });
    }
    
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
    
      
    } else {
      
      return res.render("index", {
        info: "Invalid Email address!",
        active: 'index'
      }); 
      
    }

  User.register(new User({
    username: username,
    name: req.body.fname + " " + req.body.lname,
    email: req.body.email,
    avi: "http://www.personalbrandingblog.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640-300x300.png",
    header: "http://freetwitterheaders.net/wp-content/uploads/2012/12/Clear-Sea-Waves.jpg",
    verified: false,
    location: "Not Available",
    gender: "Not Available",
    bio: "",
    color: "737373",
  }), req.body.password, function(err, account) {
    if (err) {
      return res.render("index", {
        info: "That username is not available, sorry.",
        active: 'index'
      });
    } else {
      
      res.redirect('/login');
      
    }
    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          return next(err);
        }

      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    Post.find({}, null, { sort: '-created' }, function (err, posts) {
        if (err) return next(err);
    if (!user) { return res.render("login", { info: "That user does not exist!", active: 'login', title: 'Free Speech', posts:posts }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      var hour = 3600000;
      req.session.cookie.maxAge = 14 * 24 * hour; //2 weeks
      return res.redirect('/');
    });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

// update
router.post('/update', function (req, res, next) {
  User.findOneAndUpdate({ _id: req.user.id }, {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username
  }, function (err, account) {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;