module.exports = function(io, streams) {
	
	var clients = [];
	
	
	/*
	 * Message Types:
	 * 1. INIT - Server send message to Client to send current sessionId
	 * 2. INIT-REPLY - Client sends this message along with its UserId (#Phone number) and current sessionId 
	 * 		sent in the previous INIT message 
	 * 3. PRESENCE - When a new client connects, the Server sends this message to all the clients current
	 * 4. READY-TO-CONNECT - Client sends this message when it wants to connect to another client
	 * 5. MESSAGE - Client sends a message to another client via Server. The server sends this message to the designated client.
	 * 6. INVITE - Server sends this message to a Client if another client has send a READY-TO-CONNECT message
	 * 7. LEAVE - Server sends to all clients when someone leaves the connection
	 * 8. AVAILABLE-USERS - Server sends all available clients to the client
	 */

	io.on('connection', function(client) {
	  
	  //Initial Connection flow
	  /*
	   * 	Client													Server									OtherClients
       * 	Request Connection  
	   * 	---------------------------------------------------------->
	   * 									('INIT', "sessionId')
	   * 	<-----------------------------------------------------------
	   * 	('INIT-REPLY', sessionId, userId)
	   * 	----------------------------------------------------------->			
	   * 																			('PRESENCE', userId)
	   * 																	----------------------------------->
	   * 
	   * 
	   */
	  
	  
	    console.log('-- ' + client.id + ' joined --');
	    client.emit('INIT', client.id);
	    clients.push(client.id);
	    
	    /*
	     * Handling init reply. Send the presence broadcast to all other clients
	     */
	    client.on('INIT-REPLY', function (userId) {
	        //Save {UserId, sessionId} in the database
	    	console.log('-- ' + client.id + ' received init reply ..user id:'+ userId);
	    	
	    	//Send this client's id to others
	    	client.broadcast.emit('PRESENCE', client.id);
	    	
	    	//Send the current client list to the client
	    	client.emit('AVAILABLE-USERS', clients);
	    });
    
    
	    /*
	     * Handling connection request. 
	     * connectionDetails has the ICE-ENDPOINTS of the requesting client
	     */
	    client.on('READY-TO-CONNECT', function (connectionDetails) {
	    	var otherClient = io.sockets.connected[connectionDetails.to];
	
	        if (!otherClient) {
	          return;
	        }
	        
	        otherClient.emit('INVITE', connectionDetails);
	    });
	    
	
	    /*
	     * Handle one-to-one messaging from the client
	     */
	    client.on('MESSAGE', function (details) {
	    	console.log('-- ' + client.id + ' received message:'+ details.payload+' to:'+details.to);
	    	var otherClient = io.sockets.connected[details.to];
	
	    	if (!otherClient) {
	    		return;
	    	}
	        delete details.to;
	        details.from = client.id;
	        otherClient.emit('MESSAGE', details);
	    });
	    
	    /*
	     * Handling the scenario when a client disconnects from the server
	     * A broadcast is sent to other clients about this client
	     * 
	     */
	    function leave() {
	    	console.log('-- ' + client.id + ' left --');
	    	//Update {UserId, ''} in the database to remove the current sessionId
	    	io.emit('LEAVE', client.id);
	    	
	    	//Remove the client from clients array
	    	var index = clients.indexOf(client.id);
	    	if (index > -1) {
	    	    clients.splice(index, 1);
	    	}
	    }
	
	    client.on('disconnect', leave);
	    client.on('leave', leave);
	});
};