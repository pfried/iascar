angular.module('iasCar').controller('ConnectionController', ['$scope', '$window', '$timeout', '$state', 'bluetoothService',  function($scope, $window, $timeout, $state, bluetoothService) {
    'use strict';

    var timeout;

    function startScan() {
        bluetoothService.startScan().then(function(devices) {
            $scope.scanning = true;
            $scope.cars = devices;



            timeout = $timeout(function() {
                $window.console.log('DEVICE');
                $window.console.log($scope.cars[0]);
                stopScan();
            }, 5000);

        }, function (error) {
            $window.console.log(error);
        });
    }

    function stopScan() {
        bluetoothService.stopScan();
        $scope.scanning = false;
    }

    function connectToDevice(device) {
        // Cancel the scan timeout and stop scanning
        $timeout.cancel(timeout);
        bluetoothService.stopScan();

        // Connect to device
        $state.go('car', {
            carAddress : device.address
        });
    }

    bluetoothService.initialize().then(function(){

        // Scope gets automatically updated to new devices since devices is linked to our bluetooth service
        startScan();

        $scope.connectToDevice = connectToDevice;

    });

}]);
