define([],
    function() {
        var current;
        'use strict';
        return {
            loadModule: ['$ocLazyLoad', '$q', '$route', '$state', function($ocLazyLoad, $q, $route, $state) {
                var deferred = $q.defer();
                var data = [];

                var deps = this.self.deps;
                for (var i in deps) {
                    data.push(deps[i].define);
                }
                data.push(this.self.controller);
                window.deps = this.self.deps;;
                require(data, function() {
                    var module = angular.module;
                    var temp = module('myApp');
                    if (window.deps !== undefined)
                        for (var i = 0; i < window.deps.length; i++) {
                            if (window.deps[i].module !== undefined)
                                temp.requires.push(window.deps[i].module);
                        }
                    $ocLazyLoad.inject('myApp');
                    deferred.resolve();

                });


                return deferred.promise;
            }]
        }
    });