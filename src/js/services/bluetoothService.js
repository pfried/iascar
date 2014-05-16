'use strict';

// Car service
angular.module('iasCar.services').factory('bluetoothService', ['cordovaService', function(cordovaService) {

    if(cordovaService.isAvailable()) {
        window.console.log('cordova is available');
    } else {
        window.console.log('cordova is not available');
    }

    function listDevices() {
        return {
            cars : ['Car 1', 'Car 2']
        };
    }

    return {
        listDevices : listDevices
    };

}]);