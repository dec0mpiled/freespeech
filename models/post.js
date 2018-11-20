var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorinfo = new Schema({name: String, username: String, avi: String, verified: Boolean});

var likeinfo = new Schema({name: String, username: String, avi: String});

var dislikeinfo = new Schema({name: String, username: String, avi: String});

var shareinfo = new Schema({name: String, username: String, avi: String, link: String});

var linkinfo = new Schema({title: String, url: String, icon: String});

var Post = new Schema({
    author: [authorinfo],
    raw: String,
    content: String,
    created: Date,
    likes: Number,
    like: [likeinfo],
    dislikes: Number,
    dislike: [dislikeinfo],
    shares: Number,
    share: [shareinfo],
    responses: Number,
    haslink: Boolean,
    link: [linkinfo],
    url: String
});

module.exports = mongoose.model('posts', Post);