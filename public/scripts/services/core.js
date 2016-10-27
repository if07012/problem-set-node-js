define([], function() {
    Array.prototype.remove = function() {
        var what, a = arguments,
            L = a.length,
            ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
    var core = angular.module('core', [])
        .directive('materialCard', [function() {
            return {
                restrict: 'A',
                scope: {
                    items: "=?"
                },
                transclude: true,
                link: function(scope, elem, attr) {}
            }
        }])
        .directive('isMobile', ['$rootScope', function($rootScope) {
            return {
                restrict: 'A',
                scope: {
                    item: "=?"
                },
                transclude: true,
                link: function(scope, elem, attr) {
                    scope.item = $(window).width() < 600;
                    $(window).on('resize', function(e) {
                        scope.item = $(window).width() < 600;
                        if ($rootScope.$$phase === null) {
                            scope.$apply();
                        }
                    });
                }
            }
        }])
        .directive('materialCardItem', [function() {
            return {
                restrict: 'A',
                scope: {
                    items: "=?"
                },
                transclude: true,
                link: function(scope, elem, attr) {
                    $(($(elem).children()[0])).materialCard();
                },
                template: '<div ng-transclude></div>'
            }
        }]);
});