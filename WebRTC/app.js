var app = require('express')(); // Set up express and socket.io along with the Jade view engine
var http = require('http').Server(app);
var path = require('path');
app.set('views', path.join(__dirname, 'views')); // Set up the pathing to the views folder
app.set('view engine', 'jade');

var defport = 3077;

process.argv.forEach(function (val, index, array) { // Just set the current port to the last argument
    if (typeof val === 'undefined' || index < 2) return;
    defport = val;
});

// http backend if everything goes to shit with WebSockets in Unity
app.get('/positions', function(req, res) {
    res.status(200); // HTTP OK
	res.json(clients)
});

app.get(/^(.+)$/, function(req, res){
    console.log('static file request : ' + req.params);
    res.sendfile( __dirname + req.params[0]);
});

http.listen(defport, function(){  // The HTTP server listens so that the Socket.IO handshake can be established
    console.log('listening on *:' + defport);
});
