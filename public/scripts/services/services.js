define([], function() {
    var services = angular.module('services', []);
    services.service('helper', ['$http', function($http) {
        return {
            convertToMain: function(data) {
                var arr = data.split('.');
                if (arr.length > 1)
                    return arr[0] + '.' + arr[1];
                return data;
            },
            convertToDate: function(data) {
                if (data !== undefined && data !== null &&
                    data.indexOf('T') >= 0 &&
                    data.indexOf('Z') >= 0 &&
                    data.indexOf(':') >= 0 &&
                    data.indexOf('-') >= 0) {
                    var arr = data.replace('T', ' ').replace('Z', '').split('-');
                    var arrTime = arr[2].split(' ');
                    var arrHour = arrTime[1].split(':');
                    var date = new Date(arr[0], arr[1], arrTime[0], arrHour[0], arrHour[1], arrHour[2]);
                    return date;
                }
                return data;
            }
        }
    }]);
    services.service('contactService', ['$http', function($http) {
        return {
            findContactList: function(data) {
                if (data === undefined) return $http({
                    method: 'GET',
                    url: "/Api/Contacts/",
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });
                // return $http.get("/Api/Contacts/");
                if (data.word !== undefined) {
                    return $http({
                        method: 'GET',
                        url: "/Api/Contacts/" + data.key + "/" + data.word,
                        headers: {
                            'Authorization': window.localStorage.getItem('authorize')
                        }
                    });
                }
            },
            getManageSchema: function() {
                return $http({
                    method: 'GET',
                    url: "/Api/Schemas/name/Contact",
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });

            },
            getSchema: function() {
                return $http({
                    method: 'GET',
                    url: "/Api/Contacts/Schema",
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }

                });
            },
            getById: function(id) {
                return $http({
                    method: 'GET',
                    url: "/Api/Contacts/" + id,
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });
            },
            updateSchema: function(id, data) {
                return $http({
                    method: 'PUT',
                    url: "/Api/Schemas/" + id,
                    data: data,
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });
            },
            update: function(id, data) {
                return $http({
                    method: 'PUT',
                    url: "/Api/Contacts/" + id,
                    data: data,
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });
            },
            delete: function(id, data) {
                return $http({
                    method: 'DELETE',
                    url: "/Api/Contacts/" + id,
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });
            },
            save: function(data) {
                return $http({
                    method: 'POST',
                    url: "/Api/Contacts/",
                    data: data,
                    headers: {
                        'Authorization': window.localStorage.getItem('authorize')
                    }
                });
            },
            login: function(username, password) {
                return $http.post("/Authentication/", {
                    username: username,
                    password: password
                });
            }
        }
    }])

});