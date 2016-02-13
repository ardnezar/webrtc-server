// export this module, so that it is accessible to our application modules
module.exports = Users;
 
// Cars constructor
function Users() {
        if (!(this instanceof Users)) {
                return new Users();
        }
 
        // require mongodb
        var mongo = require('mongodb');
        // Connect to our mongodb running on localhost and named 'test'
        var db = require('monk')('localhost:27017/webrtc');
        // obtain a reference to our cars collection within mongodb
        this.users = db.get('users');
};
 
// Retrieve a list of all persisted
Users.prototype.findAll = function(success, error) {
    this.users.find({},{},response(success, error));
};
 
// Retrieve a user by its id
Users.prototype.findById = function(id, success, error) {
        this.users.findById(id, response(success,error));
};
 
// Persist a new user document to mongodb
Users.prototype.create = function(car, success, error) {
        this.users.insert(car, response(success,error));
};
 
// Update an existing user document by id in mongodb
Users.prototype.update = function(car, success, error) {
        this.users.findAndModify(car._id,
                { $set: { id: user.id } }, response(success, error));
};
 
// Remove a car by id from the mongodb
Users.prototype.removeById = function(id, success, error) {
        this.users.remove({_id : id}, response(success, error));
};
 
// Callback to the supplied success and error functions
// The caller will supply this function. The callers implementation
// will provide the necessary logic. In the case of the sample app,
// the caller's implementation will send an appropriate http response.
var response = function(success, error) {
        return function(err, doc) {
                if (err) {
                        // an error occurred, call the supplied error function
                        error(err);
                } else {
                        // call the supplied success function
                        success(doc);
                }
        };
}