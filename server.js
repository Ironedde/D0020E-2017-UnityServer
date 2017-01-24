var http = require('http');

var io = require('socket.io')
var socket = io.listen(3001);
console.log("starting server");

socket.on('connection', function(socket) {
  console.log("connected!");
});
