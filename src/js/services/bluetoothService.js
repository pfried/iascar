'use strict';

// Car service
angular.module('iasCar.services').factory('bluetoothService', ['cordovaService', function(cordovaService) {

    var devices;

    function isAvailable() {
        return cordovaService.isAvailable();
    }

    function listDevices() {
        return devices;
    }

    return {
        isAvailable : isAvailable,
        listDevices : listDevices
    };

}]);