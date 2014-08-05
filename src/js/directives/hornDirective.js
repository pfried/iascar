'use strict';
angular.module('iasCar.directives').directive('horn', function() {

    return {
        restrict: 'E',
        scope: {
            setHornOn  : '&',
            setHornOff : '&'
        },
        template: '<div class="horn"><i class="icon-megaphone"></i></div>',
        link : function(scope, element) {

            function onTouchStart() {
                scope.setHornOn();
            }

            function onTouchEnd() {
                scope.setHornOff();
            }

            element.on('touchstart', onTouchStart);
            element.on('touchend', onTouchEnd);
        }
    };
});