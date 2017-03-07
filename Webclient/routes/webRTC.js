/**
 * Created by ironedde on 2017-03-01.
 */
var express = require('express');
var router = express.Router();

/* GET webRTC page. */
router.get('/', function(req, res, next) {
    res.render('webRTC', { title: 'webRTC - Test page' });
});

module.exports = router;
