'use strict';
angular.module('iasCar.directives').directive('temperature', function() {

    return {
        restrict: 'E',
        scope: {
            temperatureValue : '='
        },
        template: '<div class="temperature"><i class="icon-thermometer"></i>{{ temperatureValue | temperatureCelcius }}°C</div>'
    };
});