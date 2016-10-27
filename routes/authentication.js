var express = require('express');
var router = express.Router();
var Generic = require('../genericService');
var generic = new Generic();
/* GET users listing. */

router.post('/', function(req, res, next) {
    var userService = generic.get('/Api/Users').model;
    userService.find({ userName: req.body.username, password: req.body.password }, function(err, items) {
        if (items.length === 0)
            res.send({
                message: "data not found",
                status: 404
            })
        else {
            var text = new Buffer(req.body.username + ':' + req.body.password);
            var encode = text.toString('base64');
            res.send({
                message: "data found",
                status: 200,
                data: encode
            });
        }
    });
});

module.exports = router;