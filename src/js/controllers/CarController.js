angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', 'bluetoothTools', 'bluetoothService',  function($scope, $window, $state, $stateParams, bluetoothTools, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;
    $scope.connecting = false;

    if(!address || !bluetoothTools.isValidAddress(address)) {
        $state.go('home');
    }

    function connectToCar(address) {
        console.log('connecting');

        var params = {
            address : address
        };

        bluetoothService.connect(params).then(function(device) {

            $scope.connecting = false;
            $scope.car = device;

            console.log('connected', device);

        }, function () {
            $scope.connecting = false;
        }, function() {
            $scope.connecting = true;
        });
    }

    bluetoothService.isInitialized().then(function() {
        console.log('isInitialized');
        connectToCar(address);
    }, function() {
        console.log('initializing');
        bluetoothService.initialize().then(function() {
            connectToCar(address);
        });
    });

}]);
