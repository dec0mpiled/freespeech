var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var myNotes = new Schema({type:Number, URL:String, fromUser: String});

var User = new Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    avi: String,
    location: String,
    gender: String,
    header: String,
    verified: Boolean,
    bio: String,
    color: String,
    notamount: Number,
    notifications: [myNotes]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);