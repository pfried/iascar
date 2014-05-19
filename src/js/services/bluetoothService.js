'use strict';

// Car service
angular.module('iasCar.services').factory('bluetoothService', ['cordovaService', function(cordovaService) {

    var devices;

    function listDevices() {
        return devices;
    }

    return {
        listDevices : listDevices
    };

}]);