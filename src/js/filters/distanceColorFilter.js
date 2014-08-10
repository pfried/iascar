angular.module('iasCar.filters').filter('distanceColor', function() {
    'use strict';

    // Ultrasonic distance value
    return function(distance) {

        var color = 'green';

        switch(distance) {
            case 6:
            case 5:
                // green
                color = '#0a8f08';
                break;
            case 4:
            case 3:
                // orange
                color = '#fb8c00';
                break;
            case 2:
            case 1:
                // red
                color = '#dd191d';
                break;
            default:
                // green
                color = '#0a8f08';
                break;
        }

        return color;

    };

});
