angular.module('iasCar').controller('CarController', ['$scope', '$window', 'CarService',  function($scope, $window, CarService) {
    'use strict';

    $window.console.log('Car Controller');

    $scope.cars = CarService.listCars();

}]);
