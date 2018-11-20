var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var User = require('../models/user');

// get admin homepage
router.get('/', ensureAuthentication, function(req, res, next) {
    User.findOne({ _id: req.user.id }, function(err, user) {
        if (err) return next(err);
        if (!user.admin) {
            return res.redirect('/');
        } else {
            Post.count({}, function(err, postcount) {
                if (err) return next(err);
            User.count({}, function(err, usercount) {
                if (err) return next(err);
            Post.find({}, function(err, posts) {
                if (err) return next(err);
                User.find({}, function(err, users) {
                    if (err) return next(err);
                    res.render('a/admin', {
                        title: "Admin Console",
                        user: req.user,
                        users: users,
                        posts: posts,
                        postcount: postcount,
                        usercount: usercount
                    });
                }); 
            });
            });
            });
        }
    });
});

/// USER MANAGEMENT

// show users as raw
router.get('/users/raw', ensureAuthentication, function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) return next(err);
        res.json({ 'users': users });
    });
});

// show user as raw
router.get('/user/raw/:id', ensureAuthentication, function(req, res, next) {
    User.findOne({ _id: req.params.id }, function(err, user) {
        if (err) return next(err);
        res.json({ 'user' : user });
    });
});

// edit user
router.get('/user/edit/:id', ensureAuthentication, function(req, res, next) {
    User.findOne({ _id: req.params.id }, function(err, user) {
        if (err) return next(err);
        res.render('adminedit', {newuser:user, user:req.user});
    });
});

// remove user
router.get('/user/delete/:id', ensureAuthentication, function(req, res, next) {
    User.findOneAndRemove({ _id: req.params.id }, function(err, user) {
       if (err) return next(err); 
       res.redirect('/admin');
    });
});

// remove user
router.get('/user/verify/:id', ensureAuthentication, function(req, res, next) {
    User.findOneAndUpdate({ _id: req.params.id }, { status: "verified"  }, function(err, user) {
       if (err) return next(err); 
       user.notamount=user.notamount+1;
       user.notifications.unshift({from: "ShareCookie", type: "verify", redirect:"/user/"+user.username});
       user.save();
       res.redirect('/admin');
    });
});

// remove user
router.get('/user/unverify/:id', ensureAuthentication, function(req, res, next) {
    User.findOneAndUpdate({ _id: req.params.id }, { status: "none"  }, function(err, user) {
        user.notamount=user.notamount+1;
       user.notifications.unshift({from: "ShareCookie", type: "unverify", redirect:"/user/"+user.username});
       user.save();
       if (err) return next(err); 
       res.redirect('/admin');
    });
});

// add admin
router.get('/add/admin/:id', ensureAuthentication, function(req, res, next) {
    User.findOneAndUpdate({ _id: req.params.id}, { admin: true, status: "verified"  }, function(err, user) {
       if (err) return next(err); 
       res.redirect('/admin');
    });
});

// remove admin
router.get('/remove/admin/:id', ensureAuthentication, function(req, res, next) {
    User.findOneAndUpdate({ _id: req.params.id}, { admin: false , status: "verified" }, function(err, user) {
       if (err) return next(err); 
       res.redirect('/admin');
    });
});

/// POST MANAGEMENT

// show posts as raw
router.get('/posts/raw', ensureAuthentication, function(req, res, next) {
    Post.find({}, function(err, posts) {
        if (err) return next(err);
        res.json({ 'posts': posts });
    });
});

// show post as raw
router.get('/post/raw/:id', ensureAuthentication, function(req, res, next) {
    Post.findOne({ _id: req.params.id }, function(err, post) {
        if (err) return next(err);
        res.json({ 'post': post });
    });
});

// remove post
router.get('/post/delete/:id', ensureAuthentication, function(req, res, next) {
    Post.findOneAndRemove({ _id: req.params.id }, function(err, post) {
        if (err) return next(err);
        res.redirect('/admin');
    });
});

// Ensure Authentication
function ensureAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.redirect('/');
  }
}

module.exports = router;