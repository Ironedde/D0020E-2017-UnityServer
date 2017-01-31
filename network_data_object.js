
var ndo = {
  define: function(socket, name, objs) {
    console.log('get ' + name);
    socket.on('get ' + name, objs.get || function() {});
    socket.on('list ' + name, objs.list || function() {});
    socket.on('create ' + name, objs.create || function() {});
    socket.on('update ' + name, objs.update || function() {});
    socket.on('delete ' + name, objs.delete || function() {});
  }
};
exports.NetworkDataObject = ndo;
