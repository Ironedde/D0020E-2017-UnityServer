// Positioning server
// TODO: Add some authentication to the server

var app = require('express')(); // Set up express and socket.io along with the Jade view engine
var http = require('http').Server(app);
var soio = require('socket.io');
var path = require('path');
var debug = require('./debug');
var pos = require('./positions');
var ndo = require('./network_data_object').NetworkDataObject;

// The *sigh* global clients object
var clients = {};

app.set('views', path.join(__dirname, 'views')); // Set up the pathing to the views folder
app.set('view engine', 'jade');

var io = soio.listen(http);
var defport = 3077;

process.argv.forEach(function (val, index, array) { // Just set the current port to the last argument
    if (typeof val === 'undefined' || index < 2) return;
    defport = val;
});

var Position = ndo.define(io, "Position", {
    get: function(id, cb) {
        var c = clients[socket.id]; // Keep from returning other fields if the object is extended.
        if (cb) cb({x:c.x, y:c.y, z:c.z});
    },
    list: function(id, cb) { // same as the old "positions" call
        console.log(JSON.stringify(clients));
        cb(JSON.stringify(clients));
    },
    update: function(position, cb) { // Currently the same as the old set position
        var x = position.x || 0; // Guard against unset variables
        var y = position.y || 0;
        var z = position.z || 0;
        console.log(debug);
        clients[socket.id].x = debug.assureNumber(x, 0); // Guard against non-numeric types
        clients[socket.id].y = debug.assureNumber(y, 0); // Should the server throw exceptions instead?
        clients[socket.id].z = debug.assureNumber(z, 0);
        console.log(clients[socket.id]);
        if (cb) cb(true);
    }
});

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);

    clients[socket.id] = {x:0,y:0,z:1}; // Will use socket id as the identifier for the clients. simple enough.

    socket.on('disconnect', function() { // remove the disconnected client
        console.log(socket.id + " disconnected");
        delete clients[socket.id]; // TODO: Create persistance logic
    });

    // Keep this for old time's sake. Will break some old code if changed/removed. Beware.
    socket.on('translate', function(offsets, cb) { // Handle translation events from the clients
        clients[socket.id].x += offsets.x; // TODO: Error checking
        clients[socket.id].y += offsets.y;
        console.log(socket.id + " : " + JSON.stringify(clients[socket.id]));
        if (cb) cb({ /* Nada */});
    });

    // Tar emot data på formen {x:number, y:number, z:number}
    socket.on('set Position', function(position, cb) {
        var x = position.x || 0; // Guard against unset variables
        var y = position.y || 0;
        var z = position.z || 0;
        console.log(debug);
        clients[socket.id].x = debug.assureNumber(x, 0); // Guard against non-numeric types
        clients[socket.id].y = debug.assureNumber(y, 0); // Should the server throw exceptions instead?
        clients[socket.id].z = debug.assureNumber(z, 0);
        console.log(clients[socket.id]);
        if (cb) cb();
    });

    // Tar inte emot någon data. Allt i params ignoreras
    /*socket.on('get position', function(params) {
        var c = clients[socket.id]; // Keep from returning other fields if the object is extended.
        socket.emit('get position', {x:c.x, y:c.y, z:c.z});
    });*/

    Position.serve(socket);


    // Tar inte emot någon data
    /*socket.on('positions', function(params) { // Send the position of everyone over a socket.
        // TODO: Add authentication. Absolutely anyone can know where everyone else is at the moment
        socket.emit('positions', JSON.stringify(clients));
    });*/

    // Tar inte emot någon data
    socket.on('get clients', function(params, cb) {
        console.log("get clients");
        console.log(Object.keys(clients));
        cb({clients: Object.keys(clients)});
    });

    // Tar emot data på formatet {to:string, msg:string} där to är valfritt. Saknas to tolkas meddelandet som globalt
    socket.on('send message', function(params, cb) {
        var to = params.to;
        var msg = {from: socket.id, msg: params.msg};
        var ph = null;
        if (typeof to == "undefined") {
            ph = socket.broadcast;
        } else {
            ph = io.sockets.sockets[to] || socket;
        }
        ph.emit('message', msg);
        if (cb) cb({});
    });

    console.log(clients);
});

// http backend if everything goes to shit with WebSockets in Unity
app.get('/positions', function(req, res) {
    res.status(200); // HTTP OK
    res.setHeader("Content-Type","application/json");
    res.send(JSON.stringify(clients));
});

// A dummy client for web users, probably preferred to the console-based client
app.get('/client', function(req, res) {
    res.render('client', {title: "Klient"});
});

http.listen(defport, function(){  // The HTTP server listens so that the Socket.IO handshake can be established
    console.log('listening on *:' + defport);
});