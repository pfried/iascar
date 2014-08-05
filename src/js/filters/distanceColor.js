angular.module('iasCar.filters').filter('distanceColor', function() {
    'use strict';

    // Ultrasonic distance value
    return function(distance) {

        var color = 'green';

        switch(distance) {
            case 6:
            case 5:
                color = 'green';
                break;
            case 4:
            case 3:
                color = 'orange';
                break;
            case 2:
            case 1:
                color = 'red';
                break;
            default:
                color = 'green';
                break;
        }

        return color;

    };

});
