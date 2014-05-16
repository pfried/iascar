'use strict';

// Car service
angular.module('iasCar.services').factory('carService', ['bluetoothService', function(bluetoothService) {

    function listCars() {
        return bluetoothService.listDevices();
    }

    return {
        listCars : listCars
    };

}]);