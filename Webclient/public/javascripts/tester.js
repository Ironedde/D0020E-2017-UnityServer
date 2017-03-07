/**
 * Created by ironedde on 2017-03-01.
 */
var res;
$( document ).ready(function() {
    console.log( "ready!" );
    res = id('result')
    id('button').onclick = function(){
        res.innerHTML = 'Checking TURN Server...';
        var url = 'turn:'+id('url').value+':'+id('port').value,
            useUDP = id('udp').checked;
        url +='?transport=' + (useUDP ? 'udp': 'tcp');
        checkTURNServer({
            urls: url,
            username: id('name').value,
            credential: id('pass').value
        }, id('time').value).then(function(bool){
            if(bool)
                res.innerHTML = 'Yep, the TURN server works...';
            else
                throw new Error('Doesn\'t work');
        }).catch(function(e){
            console.log(e);
            res.innerHTML = 'TURN server does not work.';
        });
    };
});



function checkTURNServer(turnConfig, timeout){
    console.log('turnConfig: ', turnConfig);
    return new Promise(function(resolve, reject){

        setTimeout(function(){
            if(promiseResolved) return;
            resolve(false);
            promiseResolved = true;
        }, timeout || 5000);

        var promiseResolved = false
            , myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection   //compatibility for firefox and chrome
            , pc = new myPeerConnection({iceServers:[turnConfig]})
            , noop = function(){};
        pc.createDataChannel("Talk");    //create a bogus data channel
        pc.createOffer(function(sdp){
            if(sdp.sdp.indexOf('typ relay') > -1){ // sometimes sdp contains the ice candidates...
                promiseResolved = true;
                resolve(true);
            }
            pc.setLocalDescription(sdp, noop, noop);
        }, noop);    // create offer and set local description
        pc.onicecandidate = function(ice){  //listen for candidate events
            if(promiseResolved || !ice || !ice.candidate || !ice.candidate.candidate || !(ice.candidate.candidate.indexOf('typ relay')>-1))  return;
            console.log("resolved in onicecandidate!")
            console.log(ice)
            promiseResolved = true;
            resolve(true);
        };
    });
}


function id(val){
    return document.getElementById(val);
}