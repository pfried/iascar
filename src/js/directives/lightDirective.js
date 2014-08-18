'use strict';
angular.module('iasCar.directives').directive('light', function() {

    return {
        restrict: 'A',
        scope : {
            'light' : '='
        },
        link : function(scope, element) {

            scope.$watch('light' , function(newVal) {
                if(newVal) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });

        }
    };
});