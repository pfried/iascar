'use strict';
angular.module('iasCar.directives').directive('joystick', ['$rootScope', function($rootScope) {

    function joystickController ($scope, bluetoothService) {
        console.log(bluetoothService, $rootScope);
    }

    return {
        restrict : 'E',
        controller : ['$scope', 'bluetoothService', function ($scope, bluetoothService) {
            return joystickController($scope, bluetoothService);
        }],
        scope : {
            // Using primitives here did not work, so we use an Object, see: http://stackoverflow.com/questions/14049480/what-are-the-nuances-of-scope-prototypal-prototypical-inheritance-in-angularjs
            position : '='
        },
        templateUrl : 'directives/joystick.html',
        link : function(scope, elem, attrs) {

            var id = attrs.id
            var tween;

            if(!id) {
                id = id = Math.random().toString(36).substring(7);
            }

            scope.kineticStageObject = new Kinetic.Stage({
                container : id,
                width : 200,
                height : 200
            });

            if (!scope.kineticStageObject.container) {
                scope.kineticStageObj.attrs.container = id;
            }

            var layer = new Kinetic.Layer();

            var centerX = scope.kineticStageObject.getWidth() / 2;
            var centerY = scope.kineticStageObject.getHeight() / 2;

            var borderRadius = 60;

            var options = {
                x : centerX,
                y : centerY,
                radius: 40,
                fill : '#ff0000',
                stroke : '#000000',
                strokeWidth : 2,
                draggable : true,
                // Bind the circle to a certain area
                dragBoundFunc : function(pos) {
                    var x = centerX;
                    var y = centerY;
                    var scale = borderRadius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                    if(scale < 1) {
                        return {
                            x : Math.round((pos.x - x) * scale + x),
                            y : Math.round((pos.y - y) * scale + y),
                        }
                    } else {
                        return pos;
                    }
                }
            };

            var optionsBounds = {
                x : centerX,
                y : centerY,
                radius : borderRadius,
                stroke : '#0000ff',
                strokeWidth : 2
            };

            function normalizeAmplitudeX(val) {
                var res = (centerX / 100) * val
                return val;
            }

            scope.cursor = new Kinetic.Circle(options);

            var boundCircle = new Kinetic.Circle(optionsBounds);

            scope.cursor.on('dragmove', function (evt) {
                scope.$apply(scope.position = {
                    x : Math.round(evt.target.attrs.x),
                    y : Math.round(evt.target.attrs.y)
                });
            });

            scope.cursor.on('dragend', function(evt) {
                console.log(evt);
                // If we drop the cursor we set the position to 0
                scope.$apply(scope.position = {
                    x : 0,
                    y : 0,
                });

                tween = new Kinetic.Tween({
                    node : scope.cursor,
                    duration : 0.4,
                    x : centerX,
                    y : centerY
                });

                tween.play();
            });

            scope.cursor.on('dragstart', function() {
                if(tween) {
                    tween.destroy();
                }
            });

            layer.add(boundCircle);
            layer.add(scope.cursor);
            scope.kineticStageObject.add(layer);
        }

    };

}]);