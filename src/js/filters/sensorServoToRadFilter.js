angular.module('iasCar.filters').filter('sensorServoToRad', function() {
    'use strict';

    // from the mid position to both sides of the sensor servo there are 250 units
    var LEFT = 500;
    var RIGHT = 1000;
    var VALUERANGE = RIGHT - LEFT;


    // In reality the possible angle is about 55° to both sides, calulate in radiant
    // degree° * (Pi / 180°) = rad
    var ANGLELEFT  = (215 / 180) * Math.PI;
    var ANGLERIGHT = (325 / 180) * Math.PI;
    var ANGLERANGE = ANGLERIGHT - ANGLELEFT;

    // The joystick will be from left -100 to 100 right
    // The PWM value will be from 500 left to 1000 right
    return function(val) {
        return ANGLELEFT + ((val - LEFT) / VALUERANGE) * ANGLERANGE;
    };

});