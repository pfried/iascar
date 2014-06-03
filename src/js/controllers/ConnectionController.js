angular.module('iasCar').controller('ConnectionController', ['$scope', '$window', 'bluetoothService',  function($scope, $window, bluetoothService) {
    'use strict';

    $window.console.log('Connection Controller');

    bluetoothService.initialize().then(function(){
        bluetoothService.listDevices().then(function(devices) {
            $window.console.log('scan started');
            $scope.cars = devices;
        });
    });

}]);
