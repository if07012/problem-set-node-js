define(['initialize'], function(initialize) {
    initialize.controller('LoginCtrl', ['$http', '$scope', 'contactService', function($http, $scope, service) {

        $scope.login = function() {
            service.login($scope.username, $scope.password).then(function(e) {
                window.localStorage.setItem('authorize', 'Basic ' + e.data.data);
                window.location ="/";
            })
        }
    }]);
});