angular.module('iasCar').controller('HomeController', ['$scope', '$window', '$timeout', '$state', 'bluetoothService',  function($scope, $window, $timeout, $state, bluetoothService) {
    'use strict';

    var timeout;

    function scan() {

        console.log(bluetoothService);

        // Clear the timeout
        $timeout.cancel(timeout);

        bluetoothService.startScan().then(function(devices) {
            $scope.scanning = true;
            $scope.cars = devices;

            // Scope gets automatically updated to new devices since devices is linked to our bluetooth service
            $scope.connectToDevice = connectToDevice;

            timeout = $timeout(function() {
                $window.console.log($scope.cars);
                stopScan();
            }, 5000);

        }, function (error) {
            $window.console.log(error);
        });
    }

    function startScan() {
        bluetoothService.isInitialized().then(function() {
            scan();
        }, function(){
            bluetoothService.initialize().then(function() {
                scan();
            }, function(error) {
                $window.console.log(error);
            });
        });
    }

    $scope.startScan = startScan;

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

}]);