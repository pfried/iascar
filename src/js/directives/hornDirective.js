'use strict';
angular.module('iasCar.directives').directive('horn', ['$timeout', function($timeout) {

    return {
        restrict: 'E',
        scope: {
            setHornOn  : '&',
            setHornOff : '&'
        },
        replace : true,
        template: '<div class="actor horn"><i class="icon-megaphone"></i></div>',
        link : function(scope, element) {

            var touchStart;

            function onTouchStart() {
                touchStart = new Date();
                scope.setHornOn();
            }

            // If the horn is tapped only for a short time we need to delay the turn off function as bt cant handle it
            function onTouchEnd() {
                var touchEnd = new Date();
                var timeDiff = touchEnd.getTime() - touchStart.getTime();
                if(timeDiff < 200) {
                    $timeout(function() {
                        scope.setHornOff();
                    }, 200 - timeDiff);
                } else {
                    scope.setHornOff();
                }
            }

            element.on('touchstart', onTouchStart);
            element.on('touchend', onTouchEnd);
        }
    };
}]);