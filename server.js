var http = require('http');
var NetworkDataObject = require('./network_data_object').NetworkDataObject;

var io = require('socket.io')
var socket = io.listen(3001);
console.log("starting server");

socket.on('connection', function(socket) {
  console.log('connected');
  socket.on('message', function(data) {
    console.log(data);
  });
  NetworkDataObject.define(socket, 'Task', {
    get: function(id, callback) {
      console.log('get Task by id ' + id);
      callback({
        'Id': id,
        'Title': 'Name: ' + id
      });
    },
    list: function(d, callback) {
      callback(['test']);
    }
  })
});
