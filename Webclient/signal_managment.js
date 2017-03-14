/**
 * Created by ironedde on 2017-03-01.
 */
function Manager(ioObj){
    this.io = ioObj;
    this.clients = {};
    this.subscriptions = {};

    var self = this;
    //Well this is award, context is mistery
    //var clients = this.clients;

    this.io.on('connection', function(socket){
        self.clients[socket.id] = socket;
        console.log("client, connected. "+Object.keys(self.clients).length+" on server.");
        socket.broadcast.emit('message', {"type":"newClientConnected","message":socket.id});
        send("getMyID",socket.id);
        //socket.emit('message', { message: 'welcome to the chat' });
        socket.on('signal',function(data){
            console.log("User wants people to talk to")
            console.log("They say: '"+data+"'");
        });
        socket.on('disconnect', function () {
            //connectionCount -= 1;
            removeSubscriber(socket.id);
            delete self.clients[socket.id];

            if(socket.id in self.subscriptions){
                delete self.subscriptions[socket.id];
                console.log(socket.id + " is no longer a publisher");
            }

            console.log('A user disconnected, now '+Object.keys(self.clients).length+" left");
        });
        socket.on('message',function(message){
            var data = message;

            switch (data.type){
                case "call":
                    console.log("call is trying to be made from: "+socket.id);
                    socket.emit("message","No calls are to be made at this time "+socket.id);
                    break;
                case "offer":
                    //for ex. UserA wants to call UserB
                    console.log("Sending offer: "+socket.id+" -> ", data.message.recipient);

                    //if UserB exists then send him offer details
                    var conn = self.clients[data.message.recipient];
                    if(conn != null) {
                        //setting that UserA connected with UserB
                        socket.otherName = data.message.recipient;
                        conn.emit("message",{"type":"offer","message":{"offer":data.message.offer,"id":socket.id}});
                    }
                    break;
                case "answer":
                    break;
                case "getAvailableUsers":
                    console.log("Sending all users to "+socket.id);
                    var toSend = [];
                    for (c in self.clients){
                        toSend.push(c);
                    }
                    send("getAvailableUsers",{"users":toSend})
                    //socket.emit("message",JSON.stringify({"type":"getAvailableUsers","users":users}))
                    break;
                case "getMyID":
                    send("getMyID",socket.id);
                    break;
                case "subscribe":
                    console.log(self.subscriptions);
                    console.log("ID is");
                    console.log(data.message.id);
                    console.log("Valid subscriptions are");
                    console.log(Object.keys(self.subscriptions));
                    if (Object.keys(self.subscriptions).indexOf(data.message.id) > -1){
                        self.subscriptions[data.message.id].push(socket.id);
                        console.log("now subscribed");
                        console.log(self.subscriptions[data.message.id]);
                        console.log("SUBSCRIBED");
                    }
                    break;

                case "cancelSubscribe":
                    removeSubscriber(socket.id);
                    break;

                case "createPublisher":
                    console.log("Added publisher");
                    console.log(self.subscriptions);
                    if(!(socket.id in self.subscriptions)){
                        self.subscriptions[socket.id] = [];
                        console.log(socket.id + " is now a publisher");
                    }
                    console.log(self.subscriptions);
                    break;

                case "cancelPublisher":
                    if(socket.id in self.subscriptions){
                        delete self.subscriptions[socket.id];
                        console.log(socket.id + " is no longer a publisher");
                    }
                    break;

                case "subscription":
                    console.log("WE HAVE A SUBSCRIPTION");
                    console.log(self.subscriptions);
                    if (socket.id in self.subscriptions){
                        for (var i = 0; i < self.subscriptions[socket.id].length; i++){
                            var sub = self.subscriptions[socket.id][i];
                            console.log("och subeen är ");
                            console.log(sub);
                            console.log(self.subscriptions[socket.id]);
                            self.clients[sub].emit("message",{"type":"subscription","message":data.message});
                        }
                    }
                    break;

                default:
                    console.log("Invalid request");
                    socket.emit("message","Request could not be made: "+data.type);

            }

        });
        function send(type,message){
            socket.emit("message",{"type":type,"message":message})
            console.log("Emitting: "+{"type":type,"message":message});
        }
        function removeSubscriber(id){
            var breakFlag = false;
            for (var c in self.subscriptions) {
                if (!breakFlag){
                    for (var i = 0; i < self.subscriptions[c].length; i++) {
                        if (self.subscriptions[c][i] == id) {
                            self.subscriptions[c].splice(i,1);
                            console.log(id +" canceled their subscription to "+c);
                            break;
                        }
                    }
                }
                else
                    break;
            }
        }
    })
}
module.exports = Manager;