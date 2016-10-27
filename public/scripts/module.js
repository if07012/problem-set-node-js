define(['core', 'config', 'OcLazyLoad', 'AngularUIRouter', 'AngularAnimate', 'AngularAria', 'undescore', 'AngularRoute', 'MaterialCard'],
    function(core, config, ocLazyLoad, angularUiRouter, angularAnimate, angularAria, undescore, ngRoute, MaterialCard) {
        'use strict';
        var app = angular
            .module('myApp', ['core', 'ngAria', 'ngMaterial', 'ngRoute', 'ui.router', 'ngAnimate', 'oc.lazyLoad', 'btford.socket-io'])
            .factory('socket', function(socketFactory) {
                var myIoSocket = io.connect('http://localhost:3000');
                var mySocket = socketFactory({
                    ioSocket: myIoSocket
                });

                return mySocket;
            })
            .config(config.method).run(run);

        function run($rootScope, $http, $location) {
            var temp = [];
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.currentState = toState.name;
                temp.push($location.path());
            });
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.changeState = toState;
                $rootScope.doneLoad = true;
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $rootScope.doneLoad = false;
            });
            $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, a, s, d, f, g, h) {});
        }
        window.config = config;
        return app;
    });