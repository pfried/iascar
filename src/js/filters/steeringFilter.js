angular.module('iasCar.filters').filter('steering', function() {
    'use strict';

    // This is the mid position of the steering
    var MID_POSITION = 750;
    // from the mid position to both sides of steering there are 250 units
    var RANGE = 250;

    // The joystick will be from left -100 to 100 right
    // The PWM value will be from 500 left to 1000 right
    return function(val) {
        return MID_POSITION + ((RANGE / 100) * val);
    };

});