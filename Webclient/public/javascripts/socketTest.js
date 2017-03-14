/**
 * Created by ironedde on 2017-03-01.
 */
/*var socket = io.connect('http://130.240.202.35:3000');
socket.on('message', function(data){console.log(data)});*/
var socket;
function SignalingChannel(url){
    this.clients = [];
    this.myID = null;
    this.offer = null;


    this.onOffer = null;
    this.onNewClient = function(e){};
    //Well this is awcard, context is mistery
    var self = this;

    //var clients = this.clients;
    //var myID = this.myID;
    socket = io.connect(url);
    self.myID = socket.id;
    console.log(self.myID);

    self.addLine = function(prevX, prevY, currX, currY) {
        self.send("subscription", {"prevX":prevX, "prevY":prevY, "currX":currX, "currY":currY});
    };

    self.onSubscription = undefined;
    socket.on("message",function(message){
        console.log("message recived, decoding: "+message);
        var data = message;
        switch (data.type) {
            case "call":
                break;
            case "offer":
                //for ex. UserA wants to call UserB
                console.log("Getting offer from: " + data.message.id);
                //self.offer = data.message.offer;
                var r = confirm("Do you want to connect to: "+data.message.id);
                if (r == true) {
                    self.onOffer(data.message);
                }
                break;
            case "answer":
                console.log("Getting response from: "+ data.message.id)
                break;
            case "getAvailableUsers":
                self.clients = [];
                console.log(JSON.stringify(data));
                for (var i = 0;i<data.message.users.length;i++) {
                    if (self.myID != null) {
                        if (data.message.users[i] == self.myID) {
                            continue;
                        }
                    }
                    self.clients.push(data.message.users[i]);
                }
                break;
            case "getMyID":
                console.log("Got id: "+JSON.stringify(data));
                self.myID = data.message;
                break;
            case "newClientConnected":
                self.clients.push(data.message);
                self.onNewClient(data);
                break;
            case "subscription":
                console.log("Received from subscription");
                console.log(data.message);
                if (self.onSubscription) {
                    self.onSubscription(data.message);
                }
                break;
            default:
                socket.emit("message", "Request could not be made: " + data.type);
        }
        });

    self.sendOffer = function(recipient,offer){
        self.send("offer",{"recipient":recipient,"offer":offer})
    }
    self.makePublisher = function() {
        self.send("createPublisher", {})
    }

    self.subscribe = function(id) {
        self.send("subscribe", {"id":id});
    }

    self.sendAnswer = function(){
        return undefined;
    }
    self.getAvailableUsers = function(){
        this.send("getAvailableUsers",{});
    }
    self.getMyID = function(){
        this.send("getMyID",{});
    }
    self.send = function(type,message){
        socket.emit("message",{"type":type,"message":message});
    }
}

var signalingChannel = new SignalingChannel(window.location.origin); // TODO Fix for production
var configuration = {
    'iceServers': [{
        'url': 'turn:turn.hw.fail?transport=udp',
        'username':'turnuser',
        'credentials':'grupp3FTW'
    }]
};
var pc;
signalingChannel.onOffer = function(message){
    if(!pc){
        start()
    }
    if (message.sdp) {
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp),
            function () {
                // if we received an offer, we need to answer
                if (pc.remoteDescription.type == 'offer')
                    pc.createAnswer(localDescCreated, logError);
            }, logError);
    }
    else {
        pc.addIceCandidate(new RTCIceCandidate(message.candidate));
    }
};
function logError(error) {
    log(error.name + ': ' + error.message);
}

