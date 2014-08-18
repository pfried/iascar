angular.module('iasCar').controller('HomeController',
    [
        '$scope',
        '$window',
        '$timeout',
        '$state',
        'bluetoothService',
        '$translate',
        '$modal',
        'storageService',

        function($scope, $window, $timeout, $state, bluetoothService, $translate, $modal, storageService) {
    'use strict';

    var timeout;

    function scan() {

        // Clear the timeout
        $timeout.cancel(timeout);

        // Filter for our services only, i dont know but this doesnt work, maybe the services must be in the advertisement
        // Car.prototype.services.drive.uuid
        var services = {
            'serviceUuids' : []
        };

        bluetoothService.startScan(services).then(function(devices) {
            $scope.scanning = true;
            $scope.cars = devices;

            // Scope gets automatically updated to new devices since devices is linked to our bluetooth service
            $scope.connectToDevice = connectToDevice;

            timeout = $timeout(function() {
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

    function goToInfo() {
        $state.go('info');
    }

    $scope.goToInfo = goToInfo;

    var ModalInstanceController = function ($scope, $modalInstance, $translate, storageService) {

        $scope.closeLanguageSettings = function() {
            $modalInstance.close();
            storageService.localStorage.setItem('language', JSON.stringify({ 'language' :  $translate.use() }));
        };

        $scope.setLanguage = function(code) {
            $translate.use(code);
        };

        $scope.translate = $translate;

    };

    $scope.openLanguageModal = function () {

        $modal.open({
            controller : ModalInstanceController,
            templateUrl: 'partials/language.html',
            size: 'sm',
            resolve : {
                'storageService' : function() {
                    return storageService;
                },
                '$translate' : function() {
                    return $translate;
                }
            }
        });

    };

}]);