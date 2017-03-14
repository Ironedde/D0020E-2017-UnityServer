/**
 * Created by ironedde on 2017-03-01.
 */
var socket;
function SignalingChannel(url) {
    socket = io.connect('http://130.240.202.35:3000');
    socket.on('userList', function (data) {

    });
    function getPeers() {

    }
}
fu
