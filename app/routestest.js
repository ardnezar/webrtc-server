var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/webrtc');

router.get('/', function(req, res) {
    var collection = db.get('users');
    collection.find({}, function(err, users){
        if (err) throw err;
      	res.json(users);
    });
});

module.exports = router;