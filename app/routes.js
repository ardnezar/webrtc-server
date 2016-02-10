//module.exports = function(app, streams) {
//
//  // GET home 
//  var index = function(req, res) {
//    res.render('index', { 
//                          title: 'Project RTC', 
//                          header: 'WebRTC live streaming',
//                          username: 'Username',
//                          share: 'Share this link',
//                          footer: 'pierre@chabardes.net',
//                          id: req.params.id
//                        });
//  };
//
//  // GET streams as JSON
//  var displayStreams = function(req, res) {
//    var streamList = streams.getStreams();
//    // JSON exploit to clone streamList.public
//    var data = (JSON.parse(JSON.stringify(streamList))); 
//
//    res.status(200).json(data);
//  };
//
//  app.get('/streams.json', displayStreams);
//  app.get('/', index);
//  app.get('/:id', index);
//}

var express = require('express');
var router = express.Router();

var monk = require('monk');
//var db = monk('localhost:27017/webrtc');

router.get('/', function(req, res) {
	res.render('index', { 
        title: 'Project RTC', 
        header: 'WebRTC live streaming',
        username: 'Username',
        share: 'Share this link',
        footer: 'pierre@chabardes.net',
        id: req.params.id
      });
});

module.exports = router;