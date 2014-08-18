angular.module('iasCar.filters').filter('distanceIR', function() {
    'use strict';

    // Ultrasonic distance value
    return function(distance) {

        if(distance > 3000) {
            return 1;
        }

        if(distance > 2500) {
            return 2;
        }

        if(distance > 2000) {
            return 3;
        }

        if(distance > 1500) {
            return 4;
        }

        if(distance > 1000) {
            return 5;
        }

        return 6;

    };

});
