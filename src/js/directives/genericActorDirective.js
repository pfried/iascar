'use strict';
angular.module('iasCar.directives').directive('genericActor',['$modal', function($modal) {

    var SWITCH = 0;
    var BUTTON = 1;
    var VALUE  = 2;

    var ModalInstanceController = function ($scope, $modalInstance, genericActorValue, number) {

        $scope.actorValue = angular.copy(genericActorValue);

        $scope.number = number;

        $scope.closeModal = function(value) {
            $modalInstance.close(value);
        };

    };

    return {
        restrict: 'E',
        scope: {
            setValue : '&',
            getValue : '&',
            settings : '=',
            number : '@'
        },
        replace : true,
        template: '<div class="actor generic">{{ number }}</div>',
        link : function(scope, element) {

            var config = SWITCH;
            var switchValue = false;

            function openSettings(genericActorValue) {

                var modalInstance = $modal.open({
                    controller : ModalInstanceController,
                    templateUrl : 'partials/valueModal.html',
                    size: 'sm',
                    resolve : {
                        genericActorValue : function() {
                            return genericActorValue;
                        },
                        number : function() {
                            return scope.number;
                        }
                    }
                });

                modalInstance.result.then(function(value) {
                    scope.setValue({ 'number' : scope.number, 'value' : value });
                });

            }

            function onTouchStart(event) {
                if(config === BUTTON) {
                    scope.setValue({ 'number' : scope.number, 'value' : 1});
                }

                event.preventDefault();
            }

            function onTouchEnd(event) {
                if(config === BUTTON) {
                    scope.setValue({ 'number': scope.number, 'value': 0});
                }

                if(config === SWITCH) {

                    if(switchValue === false) {
                        scope.setValue({ 'number': scope.number, 'value': 1});
                        element.addClass('active');
                    }

                    if(switchValue === true) {
                        scope.setValue({ 'number': scope.number, 'value': 0});
                        element.removeClass('active');
                    }

                    switchValue = !switchValue;
                }

                if(config === VALUE) {
                    openSettings(scope.getValue({ 'number': scope.number }));
                }

                event.preventDefault();
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
                           element.addClass('button');
                           element.removeClass('value');
                           element.removeClass('switch');
                           break;
                       case VALUE:
                           element.addClass('value');
                           element.removeClass('button');
                           element.removeClass('switch');
                           break;
                       case SWITCH:
                           element.addClass('switch');
                           element.removeClass('button');
                           element.removeClass('value');
                           break;

                       default:
                           break;
                   }

               }
            }, true);
        }
    };
}]);