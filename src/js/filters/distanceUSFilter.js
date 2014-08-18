angular.module('iasCar.filters').filter('distanceUS', function() {
    'use strict';

    // Ultrasonic distance value
    return function(distance) {

        if(distance > 60) {
            return 6;
        }

        if(distance > 50) {
            return 5;
        }

        if(distance > 40) {
            return 4;
        }

        if(distance > 30) {
            return 3;
        }

        if(distance > 20) {
            return 2;
        }

        return 1;

    };

});
