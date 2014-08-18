angular.module('iasCar.filters').filter('steering', function() {
    'use strict';

    // This is the mid position of the steering
    var MID_POSITION = 750;
    // from the mid position to both sides of steering there are 250 units
    var RANGE = 250;

    var steering = 750;

    // The joystick will be from left -100 to 100 right
    // The PWM value will be from 500 left to 1000 right
    return function(val, trim) {

        steering = (MID_POSITION + ((RANGE / 100) * val)) + trim;

        if(steering < MID_POSITION - RANGE) {
            return MID_POSITION - RANGE;
        }

        if(steering > MID_POSITION + RANGE) {
            return MID_POSITION + RANGE;
        }

        return steering;
    };

});