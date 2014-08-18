'use strict';
angular.module('iasCar.directives').directive('brightness', function() {

    return {
        restrict: 'E',
        scope: {
            brightnessValue : '='
        },
        template: '<div class="battery"><i class="icon-sun"></i><span>{{ brightnessValue }}</span></div>'
    };
});