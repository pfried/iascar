angular.module('iasCar').controller('CarController', ['$scope', '$window', '$stateParams', 'bluetoothService',  function($scope, $window, $stateParams, bluetoothService) {
    'use strict';

    $window.console.log($stateParams.carAddress);

}]);
