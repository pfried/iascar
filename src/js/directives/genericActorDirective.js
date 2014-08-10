'use strict';
angular.module('iasCar.directives').directive('genericActor', function() {

    return {
        restrict: 'E',
        scope: {
            setActorOn  : '&',
            setActorOff : '&',
            number : '@'
        },
        template: '<div class="actor">{{ number }}</div>',
        link : function(scope, element) {

            function onTouchStart() {
                scope.setActorOn();
            }

            function onTouchEnd() {
                scope.setActorOff();
            }

            element.on('touchstart', onTouchStart);
            element.on('touchend', onTouchEnd);
        }
    };
});