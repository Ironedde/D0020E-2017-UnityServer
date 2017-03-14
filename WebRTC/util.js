function hasGetUserMedia() {
    return !!(navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function getUserMedia() {
    return navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;
}