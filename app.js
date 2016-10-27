var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    faker = require('faker'),
    mongoose = require('mongoose'),
    mongodb = require('mongodb'),
    events = require('events'),
    myEventEmitter = new events.EventEmitter();
var app = express();

var authentication = require('./routes/authentication');

var Generic = require('./genericService');
var generic = new Generic();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/Authentication', authentication);

mongoose.connect('mongodb://127.0.0.1:27017/contacs');

var listExpectedUrl = ["/"];
app.use(function(req, res, next) {
    next();
});

//for handle cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/node_modules'));


app.get('/:view', function(req, res) {
    res.render(req.params.view + '.jade', {});
});

app.get('/', function(req, res) {
    res.render('index.jade', {});
});
app.set('port', process.env.PORT || 3000);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user

app.use(function(err, req, res, next) {
    if (generic.get(req.url) !== undefined) {
        var data = generic.get(req.url);
        data.service(req, res, next);

        //res.send('hello');
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }

});

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
var io = require('socket.io').listen(server);
var api = require('./routes/api')(app, io);
app.use('/Api', api.router);

//Add socket IO
io.on('connection', function(socket) {
    console.log(socket.conn.remoteAddress + " connected");
    socket.on('broadcast', function(data) {
        console.log(data);
    })
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});
generic.emitter.addListener('Add', function(name, model) {
    io.emit('Add' + name, model);
});
generic.emitter.addListener('Update', function(name, model) {
    io.emit('Update' + name, model);
});
generic.emitter.addListener('Delete', function(name, model) {
    io.emit('Delete' + name, model);
});