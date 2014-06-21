// https://github.com/sebleedelisle/JSTouchController/blob/master/TouchControl.html
'use strict';
angular.module('iasCar.directives').directive('joystick', function() {

    function joystickController ($scope, bluetoothService) {
        console.log(bluetoothService);
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
        link : function(scope, element) {

            var joystickHeight = 200;
            var joystickWidth  = 200;
            var center = {
                x : joystickHeight / 2,
                y : joystickWidth / 2
            };

            // Canvas and context element
            var container = element[0];
            var canvas = container.children[0];
            var ctx = canvas.getContext('2d');

            // Id of the touch on the cursor
            var cursorTouchId = -1;
            var cursorTouch = {
                x : center.x,
                y : center.y
            };

            function resetCanvas() {
                canvas.height = joystickHeight;
                canvas.width = joystickWidth;
            }

            function onTouchStart(event) {
                var touch = event.targetTouches[0];
                cursorTouchId = touch.identifier;
                cursorTouch = {
                    x : touch.clientX -touch.target.offsetLeft,
                    y : touch.clientY - touch.target.offsetTop
                };
                draw();
            }

            function onTouchMove(event) {
                // Prevent the browser from doing its default thing (scroll, zoom)
                event.preventDefault();
                for(var i = 0; i < event.changedTouches.length; i++){
                    var touch = event.changedTouches[i];

                    if(cursorTouchId === touch.identifier)
                    {
                        cursorTouch = {
                            x : touch.clientX -touch.target.offsetLeft,
                            y : touch.clientY - touch.target.offsetTop
                        };

                        scope.$apply(
                            scope.position = {
                                x : Math.round((touch.clientX -touch.target.offsetLeft) - center.x),
                                y : Math.round((touch.clientY -touch.target.offsetTop) - center.y)
                            }
                        );

                        break;
                    }
                }

                requestAnimFrame(draw);
            }

            function onTouchEnd() {

                cursorTouchId = -1;

                cursorTouch = {
                    x : center.x,
                    y : center.y
                };

                scope.$apply(
                    scope.position = {
                        x : 0,
                        y : 0
                    }
                );

                draw();
            }

            function draw() {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 6;
                ctx.arc(center.x, center.y, 25, 0, Math.PI*2, true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 2;
                ctx.arc(center.x, center.y, 40, 0, Math.PI*2, true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 2;
                ctx.arc(cursorTouch.x, cursorTouch.y, 25, 0, Math.PI*2, true);
                ctx.stroke();
            }

            // Check if touch is enabled
            var touchable = true;

            if(touchable) {
                canvas.addEventListener( 'touchstart', onTouchStart, false );
                canvas.addEventListener( 'touchmove', onTouchMove, false );
                canvas.addEventListener( 'touchend', onTouchEnd, false );
            }

            resetCanvas();
            draw();

        }

    };

});