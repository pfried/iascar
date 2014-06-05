angular.module('iasCar').controller('HomeController', ['$scope', '$window', '$state',  function($scope, $window, $state) {
    'use strict';

    $window.console.log('Home Controller');
    $state.go('connecting');

}]);