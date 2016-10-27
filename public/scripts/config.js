define(['routing'], function(routing) {
    'use strict';
    var stateProvider = undefined;

    function config($stateProvider, $urlRouterProvider, $controllerProvider, $provide, $httpProvider) {
        window.registerController = $controllerProvider.register;
        window.$register = $provide;
        stateProvider = $stateProvider;
        $stateProvider.state('login', {
            url: '/Login',
            templateUrl: 'Login',
            controller: 'LoginCtrl',
            deps: [],
            resolve: routing
        });

        $stateProvider.state('dashboard', {
            url: '/Dashboard',
            templateUrl: 'Dashboard',
            controller: 'DashboardCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }],
            resolve: routing
        });
        $stateProvider.state('dashboard.contact.find', {
            url: '/Find',
            templateUrl: 'find',
            controller: 'ContactCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }],
            resolve: routing
        });
        $stateProvider.state('dashboard.schema', {
            url: '/Schema',
            templateUrl: 'editSchema',
            controller: 'SchemaContactCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }],
            resolve: routing
        });
        $stateProvider.state('dashboard.login', {
            url: '/Login',
            templateUrl: 'login',
            controller: 'LoginCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }],
            resolve: routing
        });
        $stateProvider.state('dashboard.contact', {
            url: '/Contact',
            templateUrl: 'view',
            controller: 'ContactCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }],
            resolve: routing
        });
        $stateProvider.state('dashboard.contact.add', {
            url: '/Add/:id',
            templateUrl: 'insert',
            controller: 'AddContactCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }, { define: "ContactCtrl" }],
            resolve: routing
        });
        $stateProvider.state('dashboard.contact.edit', {
            url: '/edit/:id',
            templateUrl: 'edit',
            controller: 'ContactCtrl',
            deps: [{
                define: "services",
                module: 'services'

            }],
            resolve: routing
        });
        $urlRouterProvider.otherwise('/Dashboard/Contact');
    }
    config.$inject = ['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$provide', '$httpProvider'];
    return {
        method: config,
        state: stateProvider
    };
});