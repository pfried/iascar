angular.module('iasCar.filters').filter('temperatureCelcius', function() {
    'use strict';

    return function(temperature) {

        // Temperature is four times the degree in Celcius, so we divide by 4
        return(Math.round((temperature/4) * 100) / 100);

    };

});