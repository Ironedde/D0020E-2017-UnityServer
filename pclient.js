var stdin = process.stdin;
// stdin skeleton taken from http://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin
// All credits to them!
var io = require('socket.io-client');
var connections = [];

// without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

process.argv.forEach(function (val, index, array) {
  if (typeof val === 'undefined' || index < 2) return;
  console.log(index + " " + val);
  var socket = io.connect(val);
  socket.on('connect', function() {
    console.log("Connection success!");
  })
  connections.push(socket);
});

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

// on any data into stdin
stdin.on( 'data', function( key ) {
    var translation = {x: 0, y: 0, z:0}
    var amt = 1; // Amount to increase the translation upon key press

    // ctrl-c ( end of text )
    if (key === '\u0003') {
        process.exit();
    } else {
        // Change translation values based on key pressed.
        if (key === 'a') {
            translation.x -= amt;
        }
        if (key === 'd') {
            translation.x += amt;
        }
        if (key === 'w') {
            translation.y += amt;
        }
        if (key === 's') {
            translation.y -= amt;
        }
    }
    // write the key to stdout all normal like
    process.stdout.write(JSON.stringify(translation));

    // Check if translation occurred
    if (translation.x != 0 || translation.y != 0) {
     connections.forEach(function (con) { // Send translation message to all servers used by the client
          con.emit('translate', translation);
      });
    }
});
