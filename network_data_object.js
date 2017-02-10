
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
        //Added by edvin
        for (key in objs) {
           socket.on(name + "." + key, objs[key] || function () {});
        }
      }
    }
  }
};

exports.NetworkDataObject = ndo;
