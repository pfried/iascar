angular.module('iasCar.filters').filter('temperatureCelcius', function() {
    'use strict';

    // TODO Test this in real conditions and check which rssi is which signal strength
    return function(temperature) {

        // Temperature is four times the degree in Celcius, so we divide by 4
        return(Math.round((temperature/4) * 100) / 100);

    };

});