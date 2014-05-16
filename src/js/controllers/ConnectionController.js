angular.module('iasCar').controller('ConnectionController', ['$scope', '$window', 'CarService',  function($scope, $window, CarService) {
    'use strict';

    $window.console.log('Connection Controller');

    $scope.cars = CarService.listCars();

}]);
