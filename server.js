var http = require('http');
var ndo = require('./network_data_object').NetworkDataObject;

var io = require('socket.io').listen(3001);
console.log("starting server");



var Task = ndo.define(io, 'Task', {
  get: function(id, callback) {
    Task.subscribe(this, id);
    console.log('get Task by id ' + id);
    callback({
      'Id': id,
      'Title': 'Name: ' + id
    });
  },
  list: function(d, callback) {
    console.log("sending");
    callback(['test']);
  }
});
var Person = ndo.define(io, 'Person', {
  get: function(id, callback) {
    Person.subscribe(this, id);
    callback({
      'Id': id,
      'Name': 'Swag ' + id
    })
  }
});

io.on('connection', function(socket) {
  Task.serve(socket);
  Person.serve(socket);
});
