angular.module('iasCar.filters').filter('nordicMac', ['bluetoothTools', function(bluetoothTools) {
    'use strict';

    // As we are using nordic semiconductor nrf8001 chips each car should contain the vendor prefix
    return function(cars) {

        var result = [];

        angular.forEach(cars, function(car) {
            if (bluetoothTools.isNordicSemiVendorMac(car.address)) {
                result.push(car);
            }
        });

        return result;

    };

}]);
