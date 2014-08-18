angular.module('iasCar.filters').filter('speed', function() {
    'use strict';

    // This is the mid position of the speed
    var MID_POSITION = 750;
    // from the mid position to both sides of the speed there are 250 units
    var RANGE = 250;

    // The joystick will be from backwards -100 to 100 forward
    // The PWM value will be from 500 forward to 1000 backwards
    return function(val) {
        return MID_POSITION + ((RANGE / 100) * val * -1);
    };

});