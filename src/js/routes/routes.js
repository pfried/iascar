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
        .state('info', {
            url: '/info',
            views: {
                'mainPanel': {
                    templateUrl: 'partials/info.html',
                    controller: 'InfoController'
                }
            }
        })
        .state('car', {
            url: '/car/:carAddress',
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