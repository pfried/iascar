angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', 'bluetoothTools', 'bluetoothService',  function($scope, $window, $state, $stateParams, bluetoothTools, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;
    $scope.state = '';

    console.log(address);

    if(!address || !bluetoothTools.isValidAddress(address)) {
        return $state.go('home');
    }

    function disconnect() {
        bluetoothService.disconnect().then(function() {
            return $state.go('home');
        });
    }

    function connectToCar(address) {

        console.log('Connecting to: ' + address);

        var params = {
            address : address
        };

        bluetoothService.connect(params).then(function() {

            // If this is called the promise is fullfilled and we are disconnected
            $scope.state = 'disconnected';
            return $state.go('home');

        }, function (error) {
            console.log('cc error: ' + error.message);
            console.log('cc error: ' + error);
            $scope.state = 'error';
        }, function(result) {
            if(result) {
                if(result.status === 'connecting') {
                    $scope.state = 'cc connecting';
                    console.log('connecting', result);
                }

                if(result.status === 'connected') {
                    $scope.state = 'connected';
                    $scope.car = result;
                    console.log('cc connected', result);
                    $scope.disconnect = disconnect;
                }

                if(result.status === 'disconnecting') {
                    console.log('cc connecting', result);
                    $scope.state = 'disconnecting';
                }
            }
        });
    }

    bluetoothService.isInitialized().then(function() {
        connectToCar(address);
    }, function() {
        bluetoothService.initialize().then(function() {
            connectToCar(address);
        });
    });

}]);