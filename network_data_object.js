
var ndo = {
  define: function(io, name, objs) {
    console.log("defining " + name);
    return {
      update: function(data) {
        io.sockets.in(name + "." + data.Id).emit(name + ".update", data);
      },
      subscribe: function(socket, id) {
        socket.join(name + "." + id);
      },
      serve: function(socket) {
        socket.on(name + ".get", objs.get || function() {});
        socket.on(name + ".list", objs.list || function() {});
        socket.on(name + ".create", objs.create || function() {});
        socket.on(name + ".update", objs.update || function() {});
        socket.on(name + ".delete", objs.delete || function() {});
      }
    }
  }
};

exports.NetworkDataObject = ndo;
