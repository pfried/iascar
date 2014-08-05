angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', 'bluetoothTools', 'Car', 'bluetoothService', function($scope, $window, $state, $stateParams, bluetoothTools, Car, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;

    $scope.state = '';

    if(!address || !bluetoothTools.isValidAddress(address)) {
        return $state.go('home');
    }

    function connectToCar(address) {

        $scope.car = new Car(address);
        $scope.car.connect().then(function() {

        }, function() {

        }, function() {
            if($scope.car.state === 'connected') {

                $scope.car.discover().then(function() {

                    $scope.car.subscribeToCar();
                    $scope.car.setDrivingControl();
                    // Only 7 Notifications possible on Android 4.4, so dont register to actors, since sensors are already 7
                    //$scope.car.subscribeToActorValues();

                }).catch(function(error) {
                    console.error(error);
                });
            }
        });

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