var express = require('express');
var faker = require('faker');
var router = express.Router();

var Generic = require('../genericService');
var app, io;
// create a new Generic called generic
var generic = new Generic();

var schemaGeneric = generic.createInstance('Schema', {
    name: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    created_at: Date,
    updated_at: Date
}, app);
var userSchema = generic.createInstance('User', {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String }
}, app);
userSchema.find({ userName: 'admin' }, function(err, items) {

    if (items.length === 0) {
        var model = new userSchema();
        model.userName = "admin";
        model.password = "admin";
        model.role = "-1";
        model.save(function(err, model) {
            if (err)
                console.log(err);
            console.log('User data created');
        });
    }

});

schemaGeneric.find({ name: 'Contact' }, function(err, items) {
    if (err)
        console.log(err);

    var strData;
    if (items.length === 0) {
        var str = JSON.stringify({
            "name": {
                "type": "String",
                "maxLength": 50,
                "title": "Name",
                "isRequired": true,
                "inputType": "textBox",
                "key": "name",
                "groupName": "Identity",
                "col": "6"
            },
            "title": {
                "type": "String",
                "maxLength": 15,
                "title": "Title",
                "inputType": "textBox",
                "key": "title",
                "groupName": "Identity",
                "col": "6"
            },
            "description": {
                "type": "String",
                "maxLength": 1000,
                "title": "About Personality",
                "inputType": "textArea",
                "key": "description",
                "groupName": "Identity",
                "col": "6"
            },
            "email": {
                "type": "[]",
                "maxLength": 5,
                "title": "Email",
                "isRequired": true,
                "inputType": "listTextBox",
                "key": "email",
                "groupName": "Additional Information",
                "col": "6"
            },
            "phone": {
                "type": "[]",
                "maxLength": 5,
                "isRequired": true,
                "title": "Phone Number",
                "inputType": "listTextBox",
                "key": "phone",
                "groupName": "Additional Information",
                "col": "6"
            },
            "address": {
                "type": "[]",
                "maxLength": 5,
                "isRequired": true,
                "title": "Address",
                "inputType": "listTextBox",
                "key": "address",
                "groupName": "Additional Information",
                "col": "6"
            },
            "company": {
                "type": "[]",
                "maxLength": 5,
                "isRequired": true,
                "title": "Company",
                "inputType": "listTextBox",
                "key": "company",
                "groupName": "About Work",
                "col": "6"
            },
            "wa": {
                "key": "wa",
                "title": "What's Up",
                "type": "String",
                "groupName": "Social Media",
                "col": "6",
                "inputType": "textBox",
                "maxLength": 500
            },
            "twitter": {
                "key": "twitter",
                "title": "Twitter",
                "type": "String",
                "groupName": "Social Media",
                "col": "6",
                "inputType": "textBox",
                "maxLength": 500
            },
            "facebook": {
                "key": "facebook",
                "maxLength": 500,
                "title": "Facebook",
                "type": "String",
                "groupName": "Social Media",
                "col": "6",
                "inputType": "textBox"
            },
            "birthDate": {
                "key": "birthDate",
                "maxLength": 500,
                "title": "Birth Date",
                "type": "Date",
                "groupName": "Identity",
                "col": "6",
                "inputType": "textBox"
            }
        });
        strData = str;
        var model = new schemaGeneric();
        model.name = 'Contact';
        model.content = str;
        model.created_at = new Date();
        model.save(function(err, model) {
            if (err)
                console.log(err);
            console.log('Schema Contact data created');
        });
    }
    if (items.length !== 0)
        strData = items[0].content;
    var obj = JSON.parse(strData);

    var contanct = generic.createInstance('Contact', strData, app);

    contanct.find(function(err, items) {
        if (err)
            res.send(err);
        if (items.length === 0) {
            console.log('create fake contact');
            for (var i = 0; i <= 20; i++) {
                var item = new contanct();
                try {
                    item.description = faker.lorem.paragraph();
                    item.name = faker.name.findName();
                    item.title = item.name.indexOf('Miss') >= 0 || item.name.indexOf('Ms') >= 0 ? 'Female' : 'Male';
                    item.email = [faker.internet.email()];
                    item.phone = [faker.phone.phoneNumber()];
                    item.address = [faker.address.streetAddress()];
                    item.company = [faker.company.companyName()];
                } catch (ex) {
                    console.log('error --> pembuatan fake otomatis eror' + "[" + ex + "]");
                    item.description = "contoh deskripsi " + i;
                    item.name = "contoh deskripsi " + i;
                    item.title = i % 2 == 0 ? 'Female' : 'Male';
                    item.email = ["email" + i + "@yahoo.com"];
                    item.phone = [];
                    item.address = [];
                    item.company = [];
                }
                item.save(function(err, model) {
                    if (err)
                        console.log(err);
                    console.log('data created');
                });

            }
        } else {
            console.log('data found');
        }


    });


});

function Api(app, io) {
    this.app = app;
    this.io = io;
    return {
        router: router
    }
}

module.exports = Api;