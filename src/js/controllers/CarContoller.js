angular.module('iasCar').controller('CarController', ['$scope', '$window', '$state', '$stateParams', 'bluetoothService',  function($scope, $window, $state, $stateParams, bluetoothService) {
    'use strict';

    var address = $stateParams.carAddress;
    $scope.connecting = false;

    if(!bluetoothService.isInitialized()) {
        $state.go('connecting');
    }

    bluetoothService.connect(address).then(function(device) {

        $scope.connecting = false;
        $scope.car = device;

    }, function () {
        $scope.connecting = false;
    }, function() {
        $scope.connecting = true;
    });

}]);
