angular.module('iasCar.filters').filter('signalStrength', function() {
    'use strict';

    // TODO Test this in real conditions and check which rssi is which signal strength
    return function(rssi) {

        if(rssi > -40) {
            return 4;
        }
        if(rssi > -60) {
            return 3;
        }
        if(rssi > -80) {
            return 2;
        }

        return 1;

    };

});