angular.module('iasCar').config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {

    'use strict';

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
        });

    $urlRouterProvider.otherwise('/home');

}]).run([ '$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        'use strict';
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }]);