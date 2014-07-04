angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', 'bluetoothService',  function($scope, $window, $state, $stateParams, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;
    $scope.connecting = false;

    // If we are not initialized go to connect page
    bluetoothService.isInitialized().catch(function() {
        $state.go('scan');
    });

    if(!address || !bluetoothService.isValidAddress(address)) {
        $state.go('scan');
    }

    bluetoothService.connect(address).then(function(device) {

        $scope.connecting = false;
        $scope.car = device;
        console.log('Connected to:', $scope.car.name);

    }, function () {
        $scope.connecting = false;
    }, function() {
        $scope.connecting = true;
    });

}]);
