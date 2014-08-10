'use strict';
angular.module('iasCar.directives').directive('battery', function() {

    return {
        restrict: 'E',
        scope: {
            batteryValue : '='
        },
        template: '<div class="battery"><i class="icon-battery"></i><span>{{ batteryValue }}/7</span></div>'
    };
});