var mongoose = require('mongoose');
var express = require('express');
var customSchema = ["maxLength", "title"];
var fs = require('fs');
var basicAuth = require('basic-auth');
var events = require('events'),
    myEventEmitter = new events.EventEmitter();
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
var listRegisteraSchema = [];
Generic.prototype.get = function(name) {
    return get(name);

}

function get(name) {
    for (var key in listRegisteraSchema) {
        if (listRegisteraSchema.hasOwnProperty(key)) {
            var element = listRegisteraSchema[key];
            if (name.indexOf(element.route) >= 0) {
                return element;
            }
        }
    }
    return undefined;
}
Generic.prototype.createInstance = function foo(name, item, server) {
    if (typeof item === 'string') {
        item = JSON.parse(item);
        for (var key in item) {
            if (item.hasOwnProperty(key)) {
                var element = item[key];
                if (element.type === 'String')
                    element.type = String;
                if (element.type === 'Date')
                    element.type = Date;
                if (element.type === '[]')
                    element.type = [];
            }
        }
    }
    var route = '/Api/' + name + 's';

    var schema = new Schema(item);
    var generic = mongoose.model(name, schema);
    var service = function(req, res, next) {

        function unauthorized(res) {
            return res.send(401);
        };

        var user = basicAuth(req);
        if (!user || !user.name || !user.pass) {
            return unauthorized(res);
        };
        var header = req.headers.authorization,
            token = header.split(/\s+/).pop() || '',
            auth = new Buffer(token, 'base64').toString(),
            parts = auth.split(/:/),
            username = parts[0],
            password = parts[1];;
        var userSchema = get('/Api/Users');
        userSchema.model.find({ userName: username, password: password }, function(err, items) {
            if (items.length === 0)
                return unauthorized(res);
            else
                return callback(req, res, next);
        });



    }

    function callback(req, res, next) {

        var url = req.url.replace(route, '')
        var originalUrl = url;
        var arrUrl = url.split('/');
        url = "";
        var index = 0;
        var list = [];
        for (var i in arrUrl) {
            if (arrUrl.hasOwnProperty(i)) {
                var element = arrUrl[i];
                if (url === "")
                    url += "/";
                else {
                    url += "{" + index + "}/";
                    list.push(element);
                    index++;
                }
            }
        }


        if (url === '/' && req.method === 'GET') {
            generic.find(function(err, model) {
                if (err)
                    res.send(err);
                res.statusCode = 200;
                res.send(model);
            });
        }
        // REGISTER OUR ROUTES 
        // on routes that end in /:name/:id
        // return one object search by id
        // ----------------------------------------------------
        //  GET
        else if (url === '/{0}/' && req.method === 'GET') {
            if (list[0] === 'Schema') {
                var schemaDetail = {};
                for (var key in item) {
                    if (item.hasOwnProperty(key)) {
                        var element = item[key];
                        if (Object.prototype.toString.call(element) === '[object Array]') {
                            schemaDetail[key] = { type: 'Array' };
                        } else
                        if (typeof(element) == 'object') {

                            if (element.type !== undefined) {
                                schemaDetail[key] = {};
                                for (var i in element) {
                                    if (element.hasOwnProperty(i)) {
                                        var subItem = element[i];
                                        schemaDetail[key][i] = subItem;
                                    }
                                }

                                if (Object.prototype.toString.call(element.type) === '[object Array]') {
                                    schemaDetail[key]['type'] = 'Array';
                                } else {
                                    schemaDetail[key]['type'] = element.type.name;

                                }
                            } else
                                schemaDetail[key] = { type: element };
                        } else
                        if (typeof(element) == 'function') {
                            schemaDetail[key] = { type: element.name };
                        } else
                            schemaDetail[key] = { type: element };
                    }
                }
                res.statusCode = 200;
                res.send(schemaDetail);
            } else {
                if (list[0] === '') {
                    generic.find(function(err, model) {
                        if (err)
                            res.send(err);
                        res.statusCode = 200;
                        res.send(model);
                    });
                } else {
                    generic.findById(list[0], function(err, model) {
                        if (err)
                            res.send(err);
                        res.statusCode = 200;
                        res.send(model);
                    });
                }

            }

        } // REGISTER OUR ROUTES 
        // on routes that end in /:name/    
        // save the model with this id (accessed at POST http://localhost:3000/api/:name/)
        // return message and object has been saved
        // ----------------------------------------------------
        //  POST
        else if (url === '/{0}/' && req.method === 'POST') {
            var model = new generic();
            for (var key in req.body) {
                if (req.body.hasOwnProperty(key)) {
                    var element = req.body[key];
                    model[key] = element;
                }
            }
            model.save(function(err, model) {
                if (err)
                    res.send(err);
                res.statusCode = 200;
                myEventEmitter.emit('Add', name, model);

                // io.emit('Add' + name, model);
                res.send({ item: model, message: name + ' created!' });
            });
        }
        // REGISTER OUR ROUTES 
        // on routes that end in /:name/:id
        // update the model with this id (accessed at PUT http://localhost:3000/api/:name/:id)
        // return message and object has been saved
        // ----------------------------------------------------
        //  PUT
        else if (url === '/{0}/' && req.method === 'PUT') {
            generic.findById(list[0], function(err, model) {
                if (err)
                    res.send(err);
                if (model === undefined) {
                    res.statusCode = 200;
                    res.send({ message: name + ' : ' + list[0] + '  not found' });
                } else {
                    for (var key in req.body) {
                        if (req.body.hasOwnProperty(key)) {
                            var element = req.body[key];
                            model[key] = element;
                        }
                    }
                    model.save(function(err) {
                        if (err)
                            res.send(err);
                        res.statusCode = 200;
                        myEventEmitter.emit('Update', name, model);
                        //io.emit('Update' + name, model);
                        res.send({ item: model, message: name + ' : ' + list[0] + '  updated' });
                        if (name === 'Schema')
                            fs.writeFileSync("./lastUpdate.js", 'Text', "UTF-8", 'var lastUpdateSchema=' + new Date().getTime() + ';');
                    });
                }
            });
        }
        // REGISTER OUR ROUTES 
        // on routes that end in /:name/:id
        // delete the model with this id (accessed at PUT http://localhost:3000/api/:name/:id)
        // return message and object has been saved
        // ----------------------------------------------------
        //  Delete
        else if (url === '/{0}/' && req.method === "DELETE") {
            generic.findById(list[0], function(err, model) {
                if (err)
                    res.send(err);
                if (model === undefined) {
                    res.statusCode = 200;
                    var e = new Error('Custom Data');
                    e.status = 200;
                    res.send({ message: name + ' : ' + list[0] + '  not found' });
                    next(e);
                } else {

                    model.remove(function(err) {
                        if (err)
                            res.send(err);
                        res.statusCode = 200;
                        //io.emit('Delete' + name, model);
                        myEventEmitter.emit('Delete', name, model);
                        res.send({ item: model, message: name + ' : ' + list[0] + '  deleted' });

                    });
                }
            });
        } else if (url === '/{0}/{1}/' && req.method === "GET") {
            var arr = originalUrl.split('/');
            var keyWord = arr[1];
            var filter = {};
            filter[keyWord] = { "$regex": decodeURI(arr[2]), "$options": "i" };
            generic.find(filter, function(err, items) {
                if (err)
                    res.send(err);
                res.statusCode = 200;
                res.send(items);
            });
        } else
            return res.send('Not Mapping')
    }
    schema.pre('save', function(next) {
        var currentDate = new Date();
        this.updated_at = currentDate;
        if (!this.created_at)
            this.created_at = currentDate;
        next();
    });
    listRegisteraSchema.push({ name: name, route: route, model: generic, service: service })
    return generic;
};

// make this available to our users in our Node applications
function Generic() {
    this.emitter = myEventEmitter;
}
module.exports = Generic;