var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/webrtc');

var users = require('../model/user')();

router.get('/', function(req, res) {
//    var collection = db.get('users');
//    collection.find({}, function(err, users){
//        if (err) throw err;
//      	res.json(users);
//    });
	var ok = function(doc) {
        res.json(doc);
	};
	var err = function(err) {
        res.send(404);
	};
	users.findAll(ok, err);
});

module.exports = router;


//exports.findAll = function(req, res) {
//    var ok = function(doc) {
//            res.json(doc);
//    };
//    var err = function(err) {
//            res.send(404);
//    };
//    cars.findAll(ok, err);
//};