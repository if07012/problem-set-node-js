define(['initialize'], function(initialize) {
    initialize.controller('SchemaContactCtrl', ['$state', '$http', '$scope', 'contactService', '$rootScope', function($state, $http, $scope, service, $rootScope) {
        $scope.items = [];
        $scope.id = "";
        service.getManageSchema().then(function(e) {
            var data = [];
            $scope.current = e.data[0];
            var model = JSON.parse(e.data[0].content);
            for (var key in model) {
                if (model.hasOwnProperty(key)) {
                    var element = model[key];
                    element.key = key;
                    data.push(element);
                }
            }
            $scope.items = data;
            $scope.id = e.data[0]._id;
        });
        $scope.delete = function(data) {
            var index = $scope.items.indexOf(data);
            if (index >= 0)
                $scope.items.splice(index, 1);
        }
        $scope.Add = function() {
            $scope.items.push({
                key: "",
                maxLength: "",
                title: "",
                type: ""
            });
        }
        $scope.inputTypes = ["textBox", "textArea", "listTextBox"];
        $scope.types = [{
            value: "String",
            display: "String"
        }, {
            value: "Date",
            display: "Date"
        }, {
            value: "[]",
            display: "Array"
        }]
        $scope.save = function() {
            var data = {};
            for (var key in $scope.items) {
                if ($scope.items.hasOwnProperty(key)) {
                    var element = $scope.items[key];
                    data[element.key] = element;
                }
            }
            if ($scope.id !== '') {

                $scope.current.content = JSON.stringify(data);
                service.updateSchema($scope.id, $scope.current).then(function(e) {
                    toastr.info(e.data.message);
                });
            }
        }
    }]);
});