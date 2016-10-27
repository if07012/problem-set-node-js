define(['initialize'], function(initialize) {
    initialize.controller('AddContactCtrl', ['$state', '$http', '$scope', 'contactService', '$rootScope', 'helper', function($state, $http, $scope, service, $rootScope, helper) {
        service.getSchema().then(function(e) {
            var data = [];
            for (var key in e.data) {
                if (e.data.hasOwnProperty(key)) {
                    var element = e.data[key];
                    element.key = key;
                    data.push(element);
                }
            }
            var list = _.groupBy(data, 'groupName')
            data = [];
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    var element = list[key];
                    data.push({ key: key, items: element });

                }
            }
            if ($state.params.id !== "") {
                $scope.title = "Edit Contact";
                service.getById($state.params.id).then(function(e) {
                    $scope.currentItem = e.data;
                    for (var key in $scope.items) {
                        if ($scope.items.hasOwnProperty(key)) {
                            var element = $scope.items[key];
                            for (var i in element.items) {
                                if (element.items.hasOwnProperty(i)) {
                                    var subItem = element.items[i];
                                    subItem.value = helper.convertToDate(e.data[subItem.key]);
                                }
                            }
                        }
                    }
                });

            } else {
                $scope.title = "Insert Contact";
            }
            $scope.items = data;

        });
        $scope.show = function(data) {

        }
        $scope.edit = function(item, data) {
            item.temp = data;
            item.value.remove(data);
        }
        $scope.add = function(item) {
            if (item.temp === undefined) return;
            if (item.temp === null) return;
            if (item.temp === '') return;
            if (item.value === undefined) {
                item.value = [];
            }
            item.value.push(item.temp);
            item.temp = undefined;
        };
        $scope.save = function() {
            var error = false;
            var data = {};
            for (var key in $scope.items) {
                if ($scope.items.hasOwnProperty(key)) {
                    var element = $scope.items[key];
                    for (var i in element.items) {
                        if (element.items.hasOwnProperty(i)) {
                            var subItem = element.items[i];
                            if (subItem.isRequired === true) {
                                if (subItem.value === undefined || subItem.value === '' || subItem.valid === null) {
                                    error = true;
                                    toastr.error(subItem.title + " Can't empty!!");
                                }
                            }
                            data[subItem.key] = subItem.value;

                        }
                    }
                }
            }
            if (error === true) return;
            if ($state.params.id !== '') {
                service.update($state.params.id, data).then(function(e) {
                    toastr.info(e.data.message);
                    $state.go('dashboard.contact');
                });
            } else
                service.save(data).then(function(e) {
                    toastr.info(e.data.message);
                    $state.go('dashboard.contact');
                });
        }
    }]);
});