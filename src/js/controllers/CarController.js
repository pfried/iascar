angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', '$modal', 'bluetoothTools', 'Car', 'bluetoothService', function($scope, $window, $state, $stateParams, $modal, bluetoothTools, Car, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;

    $scope.state = '';

    if(!address || !bluetoothTools.isValidAddress(address)) {
        return $state.go('home');
    }

    var ModalInstanceController = function ($scope, $modalInstance, car) {

        $scope.closeSettings = function() {
            car.storeSettings();
            $modalInstance.close();
        };

        $scope.car = car;
    };

    $scope.openSettings = function () {

        $modal.open({
            controller : ModalInstanceController,
            templateUrl: 'partials/settings.html',
            size: 'sm',
            resolve: {
                car : function () {
                    return $scope.car;
                }
            }
        });

    };

    function onConnection(result) {
        if(result.status === 'connecting') {
            $scope.car.state = 'connecting';
        }

        if(result.status === 'connected') {
            $scope.car.state = 'connected';
            $scope.car.name = result.name;
            // Restore settings from localstorage
            $scope.car.restoreSettings();

            $scope.car.discover().then(function() {

                // Subscribe to updated values from the car
                $scope.car.subscribeToCar().then(function() {
                    $scope.car.setDrivingControl();
                });

            }).catch(function(error) {
                console.error('discover error', error, error.message);
            });
        }
    }

    function onDisconnect() {
        $state.go('home');
    }

    function connectToCar(address) {

        $scope.car = new Car(address);

        $scope.car.connect().then(onDisconnect, function(error) {

            console.log('connect error', error, error.message);

            // try reconnecting as this is most probably the reconnect issue
            $scope.car.reconnect().then(onDisconnect, function(error) {
                console.log('reconnect error', error, error.message);
            }, onConnection);

        }, onConnection);

        $scope.disconnect = function() {
            $scope.car.disconnect().then(function() {
                $state.go('home');
            });
        };
    }

    bluetoothService.isInitialized().then(function() {
        connectToCar(address);
    }, function() {
        bluetoothService.initialize().then(function() {
            connectToCar(address);
        });
    });

}]);