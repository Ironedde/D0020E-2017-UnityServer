/**
 * Created by ironedde on 2017-03-01.
 */
var express = require('express');
var router = express.Router();

var connectionCount = 0;
var connections = [];

/* GET home page. */
router.get('/', function(req, res, next) {
    connectionCount += 1;
    console.log("Requested signaling! "+connectionCount);
    console.log("Sending: "+{"data":[connectionCount]});
    res.send({"data":[connectionCount]})
});

module.exports = router;