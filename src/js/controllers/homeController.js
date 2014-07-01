angular.module('iasCar').controller('HomeController', ['$scope', '$window', '$state',  function($scope, $window, $state) {
    'use strict';

    $scope.goToState= function() {
        $state.go('scan');
    };

}]);