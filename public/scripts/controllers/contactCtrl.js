define(['initialize'], function(initialize) {
    initialize.controller('ContactCtrl', ['helper', '$state', '$http', '$scope', 'contactService', '$rootScope', '$mdDialog', 'socket', function(helper, $state, $http, $scope, service, $rootScope, $mdDialog, socket) {
        socket.on('AddContact', function(data) {
            $scope.items.push(data);
        });
        socket.on('DeleteContact', function(data) {
            for (var key in $scope.items) {
                if ($scope.items.hasOwnProperty(key)) {
                    var element = $scope.items[key];
                    if (element._id === data._id) {
                        $scope.items.remove(element);

                    }
                }
            }
        });
        socket.on('UpdateContact', function(data) {
            for (var key in $scope.items) {
                if ($scope.items.hasOwnProperty(key)) {
                    var element = $scope.items[key];
                    if (element._id === data._id) {
                        for (var j in element) {
                            if (element.hasOwnProperty(j)) {
                                var subElement = element[j];
                                element[j] = data[j];
                            }
                        }
                    }
                }
            }
        })
        service.findContactList().then(function(e) {
            $scope.items = e.data;

        })
        $scope.keyUp = function(e) {
            if (e.keyCode === 27) {
                $scope.back();
            }
        }
        $scope.isMobile = $(window).width() < 600;
        $rootScope.$watch('isMobile', function(e) {
            if (e === undefined) return;
            $scope.isMobile = e;
        })

        $scope.edit = function(data) {
            $state.go('dashboard.contact.add', { id: data._id });
        }
        $scope.delete = function(ev, data) {
            var confirm = $mdDialog.confirm()
                .title('Do you want to delete ' + data.name + '?')
                .textContent('Click YES for delete or NO to cancel')
                .targetEvent(ev)
                .ok('YES')
                .cancel('NO');

            $mdDialog.show(confirm).then(function() {
                service.delete(data._id, data).then(function(e) {});
            }, function() {});
        }
        $scope.back = function() {
            $scope.isClose = true;
            setTimeout(function() {
                window.history.back();
            }, 1000);
        }
        $rootScope.$watch('findBy', function(e) {
            if (e === undefined) return;
            var repository = service.findContactList(e);
            if (repository !== undefined)
                repository.then(function(e) {
                    $scope.items = e.data;

                })
        })
        $scope.$watch('search', function() {
                $rootScope.findBy = {
                    key: $scope.by,
                    word: $scope.search
                };
            })
            //name, email, phone, address, dan company
        $scope.itemSearch = [{
            key: "name",
            value: 'Name'

        }, {
            key: "email",
            value: 'Email'

        }, {
            key: "phone",
            value: 'Phone'

        }, {
            key: "address",
            value: 'Address'

        }, {
            key: "company",
            value: 'Company'

        }]
        $scope.by = $scope.itemSearch[0].key;
    }]);
});