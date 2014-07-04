angular.module('iasCar').controller('HomeController', ['$scope', '$window', '$state',  function($scope, $window, $state) {
    'use strict';

    $window.console.log('Home Controller');

    $scope.goToState= function() {
        $state.go('scan');
    };

    $scope.pos = {
        x : 0,
        y : 0
    };

    $scope.pos2 = {
        x : 0,
        y : 0
    };

}]);