'use strict';
angular.module('iasCar.directives').directive('signal', function() {

    return {
        restrict: 'E',
        scope: {
            signalValue : '='
        },
        template: '<div class="signal"><i class="icon-signal{{ signalValue | signalStrength }}"></i></div>'
    };
});