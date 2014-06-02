'use strict';
angular.module('iasCar').config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                'mainPanel': {
                    templateUrl: 'partials/home.html',
                    controller: 'HomeController'
                }
            }
        })
        .state('connectToDevice', {
            url: '/connecting',
            views: {
                'mainPanel': {
                    templateUrl: 'partials/connection.html',
                    controller: 'ConnectionController'
                }
            }
        })
        .state('car', {
            url: '/car',
            views : {
                'mainPanel' : {
                    templateUrl : 'partials/car.html',
                    controller : 'CarController'
                }
            }
        });

    $urlRouterProvider.otherwise('/home');

}]).run([ '$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);