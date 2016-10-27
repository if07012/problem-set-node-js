define(['initialize'], function(initialize) {
    initialize.controller('DashboardCtrl', ['$rootScope', '$http', '$scope', '$mdSidenav', '$state', 'helper', function($rootScope, $http, $scope, $mdSidenav, $state, helper) {
        $scope.openMenu = function($mdOpenMenu, ev) {
            originatorEv = ev;
            $mdOpenMenu(ev);
        };
        $scope.isMobile = false;
        $scope.isOpen = false;
        $scope.toggleRight = buildToggler('right');
        $scope.$watch('isMobile', function(e) {
            $rootScope.isMobile = e;
        });

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function() {
                        $log.debug("toggle " + navID + " is done");
                    });
            }
        }
        $scope.isLogin = window.localStorage.getItem('authorize') !== null;
        $scope.signOut = function() {
            window.localStorage.removeItem('authorize');
            window.location = "/";
        }
        if ($scope.isLogin === false) {
            $state.go('dashboard.login')
        }
        $scope.find = function() {
            $state.go('dashboard.contact.find');
        }
        $scope.add = function() {
            $state.go('dashboard.contact.add', { id: undefined });
        }
        $scope.setting = function() {
            $state.go('dashboard.schema', {});
        }
        setTimeout(function() {
            $("<style type='text/css'> .header-bc-color{ background-color:" + $("md-toolbar").css('backgroundColor') + "!important;}.header-bo-color{ box-sizing: border-box;border-color:" + $("md-toolbar").css('backgroundColor') + "!important;} </style>").appendTo("head");
            $(".main-content").css({ 'height': 'calc(100% - ' + $("footer").height() + 'px)' })
        }, 500);
       
        $scope.gotoHome = function() {
            $state.go('dashboard.contact');
        }


    }]);
});