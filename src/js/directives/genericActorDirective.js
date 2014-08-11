'use strict';
angular.module('iasCar.directives').directive('genericActor', function() {

    var SWITCH = 0;
    var BUTTON = 1;
    var VALUE  = 2;

    return {
        restrict: 'E',
        scope: {
            setValue : '&',
            settings : '=',
            number : '@'
        },
        template: '<div class="actor">{{ number }}</div>',
        link : function(scope, element) {

            var config = SWITCH;
            var div = element.children(0);
            var switchValue = false;

            function onTouchStart() {
                if(config === BUTTON) {
                    scope.setValue({ 'number' : scope.number, 'value' : 1});
                }
            }

            function onTouchEnd() {
                if(config === BUTTON) {
                    scope.setValue({ 'number': scope.number, 'value': 0});
                }

                if(config === SWITCH) {
                    if(switchValue === false) {
                        scope.setValue({ 'number': scope.number, 'value': 1});
                        div.addClass('active');
                    }
                    if(switchValue === true) {
                        scope.setValue({ 'number': scope.number, 'value': 0});
                        div.removeClass('active');
                    }
                    switchValue = !switchValue;
                }
            }

            element.on('touchstart', onTouchStart);
            element.on('touchend', onTouchEnd);

            // Add true to the signature to compare by value not by reference
            scope.$watch('settings', function(settings) {
               // Get the settings dependent which button it is
                if(settings) {

                   if(scope.number === '1') {
                       config = settings.generic1;
                   }

                   if(scope.number === '2') {
                       config = settings.generic2;
                   }

                   // Set the styles according to the configuration
                   // For switch keep the default style
                   switch (config) {
                       case BUTTON:
                           div.addClass('button');
                           break;
                       case VALUE:
                           div.addClass('value');
                           break;

                       default:
                           break;
                   }

               }
            }, true);
        }
    };
});