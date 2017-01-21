var http = require('http');

function handler(req, res) {
  res.writeHead(200);
  res.end(data);
}
var app = http.createServer(handler);
var io = require('socket.io')(app);
console.log("starting server");

io.on('connection', function(socket) {
  console.log("connected!");
});

app.listen(3000);
