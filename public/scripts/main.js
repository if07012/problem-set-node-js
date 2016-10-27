 var config = {
         //urlArgs: "bust=" + (new Date()).getTime(),
         baseUrl: '/',
         waitSeconds: 30,
         paths: {
             'initialize': 'scripts/module',
             'core': 'scripts/services/core',
             'config': 'scripts/config',
             'undescore': 'underscore/underscore-min',
             'routing': 'scripts/routing',
             'OcLazyLoad': 'scripts/ocLazyLoad.min',
             'MaterialCard': 'scripts/jquery.material-cards.min',
             'AngularUIRouter': 'scripts/angular-ui-router.min',
             'AngularAnimate': 'angular-animate/angular-animate.min',
             'AngularAria': 'angular-aria/angular-aria.min',
             'AngularRoute': 'scripts/angular-route.min',
             'LoginCtrl': 'scripts/controllers/loginCtrl',
             'DashboardCtrl': 'scripts/controllers/dashboardCtrl',
             'ContactCtrl': 'scripts/controllers/contactCtrl',
             'AddContactCtrl': 'scripts/controllers/addContactCtrl',
             'SchemaContactCtrl': 'scripts/controllers/schemaContactCtrl',
             'services': 'scripts/services/services'
         }, //data pathconfig dapet dari server
     }
     //set reuqire config dari daa server
 require.config(config);
 //init awal app
 require(['initialize'],
     function(initialize) {
         'use strict';
         if (window.valid === undefined)
             angular.bootstrap(document, ['myApp']);
         window.valid = true;
     }
 );