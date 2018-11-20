var express = require('express');
var app = express();
var router = express.Router();
var User = require("../models/user");
var Post = require("../models/post");
var mongoose = require('mongoose');

var linkify = require('linkifyjs');
var linkifyHtml = require('linkifyjs/html');

var getTitleAtUrl = require('get-title-at-url');

var firstImageSearchLoad = require("first-image-search-load")

/* GET home page. */
router.get('/', function(req, res, next) {

  
  if (req.user) {
    
  res.render('timeline', { title: 'Free Speech Network', user:req.user});
    
  } else {
  
  res.render('index', { title: 'Free Speech Network', user:req.user});

  }
    
  });

router.get('/login', function(req, res, next){
    
    res.render("login", {title: 'Login - Free Speech Network'});
    
});

router.get('/profile', ensureAuthenticated, function(req, res, next){
  
  Post.find({ "author.username": req.user.username}, null, { sort: '-created' }, function(err, myPost) {
    
    if (err) throw (err);
    
    console.log(myPost);
    console.log(myPost.raw);
    console.log(myPost.author);

  res.render('profile', { title: req.user.name + ' - Free Speech Network', user:req.user, posts: myPost});
  });
    
});

router.post("/publish/:location", ensureAuthenticated, function(req, res, next){
  
  var content = req.body.contentbox.replace(/(\r\n|\n|\r)/g,"<br />");
  
 content = linkifyHtml(content, {defaultProtocol: 'https'});
 

  var links = linkify.find(content);
  console.log("LINKS:")
  console.log(links[0])
  
  if (links[0]) {
  
  var single = links[0].href.toString();
  var myURL = links[0].href;
  
  }
  
  if (single) {
    
    var foundlink = true;
    
    var myTitle = extractRootDomain(single);
    var myNewTitle = myTitle.substr(0,myTitle.length - 4)
    var ico = extractRootDomain(single);
    
  }
  
  var newPost = new Post({
        raw: req.body.contentbox,
        content:content.replace(/<a [^>]+>[^<]*<\/a>/, ''),
        created: new Date().toUTCString(),
        likes: 0,
        dislikes: 0,
        responses: 0,
        shares: 0,
        haslink: foundlink,
    });
  
    newPost.link.push({title:myNewTitle, url: myURL, icon: "https://favicons.githubusercontent.com/"+ico});
    
    newPost.author.push({name: req.user.name, username: req.user.username, avi: req.user.avi, verified: req.user.verified});
    
    console.log(newPost);
    
    newPost.save();
  
   res.redirect("/"+req.params.location);
});

router.get("/editprofile", ensureAuthenticated, function(req, res, next) {
    
    
    res.render("editme", {user:req.user});
    
    
});

router.get('/deletepost/:id/:location', ensureAuthenticated, function(req, res, next) {
    Post.findOneAndRemove({ _id: req.params.id }, function(err, post) {
        if (err) return next(err);
        res.redirect("/"+req.params.location);
    });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    return res.redirect('/')
}

function getTitle(url) {
  
  var start = url.substr(0, (url.indexOf("//")+2));
  
  var end = url.substr(url.indexOf("."), (url.length - url.indexOf(".")));
  
  var title = url.substr((url.indexOf("//")+2), (url.length - end.length - start.length));
  
  var first = title.substr(0,1);
  var second = title.substr(1,title.length-1);
  
  first = first.toUpperCase();
  
  title = first + second;
  
  return title;
  
}

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

module.exports = router;
