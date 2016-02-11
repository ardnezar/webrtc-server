module.exports = function(io, streams) {

  io.on('connection', function(client) {
    console.log('-- ' + client.id + ' joined --');
    client.emit('id', client.id);
    //client.broadcast.emit('message', 'Another client has just connected!');
//    var json = JSON.stringify({ 
//        id: client.id, 
//        anArray: otherArray, 
//        another: "item"
//      });
    io.emit('presence', client.id);

    client.on('message', function (details) {
      var otherClient = io.sockets.connected[details.to];

      if (!otherClient) {
        return;
      }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });
    
    client.on('updateSession', function(options) {
//        streams.update(client.id, options.id);
    	// Update the db with current client session for the incoming userId 
    });
      
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      
      streams.addStream(client.id, options.name); 
    });
    
    client.on('update', function(options) {
      streams.update(client.id, options.id);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};