angular.module('iasCar').controller('ConnectionController', ['$scope', '$window', '$timeout', 'bluetoothService',  function($scope, $window, $timeout, bluetoothService) {
    'use strict';

    $window.console.log('Connection Controller');

    bluetoothService.initialize().then(function(){
        bluetoothService.startScan().then(function(devices) {
            $window.console.log('scan started');
            $scope.cars = devices;
        });

        $timeout(function() {
            bluetoothService.stopScan();
        }, 5000);

    });

}]);
