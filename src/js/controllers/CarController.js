angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', '$modal', 'bluetoothTools', 'Car', 'bluetoothService', function($scope, $window, $state, $stateParams, $modal, bluetoothTools, Car, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;

    $scope.state = '';

    if(!address || !bluetoothTools.isValidAddress(address)) {
        return $state.go('home');
    }

    var ModalInstanceController = function ($scope, $modalInstance, car) {

        $scope.closeSettings = function() {
            car.toJSON();
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

    function connectToCar(address) {

        $scope.car = new Car(address);
        $scope.car.connect().then(function() {
            return $state.go('home');
        }, function() {

        }, function() {
            if($scope.car.state === 'connected') {

                $scope.car.discover().then(function() {

                    // Subscribe to updated values from the car
                    $scope.car.subscribeToCar();
                    $scope.car.setDrivingControl();

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