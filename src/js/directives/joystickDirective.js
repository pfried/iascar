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

            var radiusCircle = 35;
            var radiusBound = 50;

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
                    x : touch.pageX - touch.target.offsetLeft,
                    y : touch.pageY - touch.target.offsetTop
                };
            }

            function onTouchMove(event) {
                // Prevent the browser from doing its default thing (scroll, zoom)
                event.preventDefault();
                for(var i = 0; i < event.changedTouches.length; i++){
                    var touch = event.changedTouches[i];

                    if(cursorTouchId === touch.identifier)
                    {
                        cursorTouch = {
                            x : touch.pageX - touch.target.offsetLeft,
                            y : touch.pageY - touch.target.offsetTop
                        };

                        var scale = radiusBound / Math.sqrt((Math.pow(cursorTouch.x - center.x, 2) + Math.pow(cursorTouch.y - center.y, 2)));

                        if(scale < 1) {
                            cursorTouch = {
                                x : (cursorTouch.x - center.x) * scale + center.x,
                                y : (cursorTouch.y - center.y) * scale + center.y
                            }
                        }

                        scope.$apply(
                            scope.position = {
                                x : Math.round(((cursorTouch.x - center.x)/radiusBound) * 100),
                                y : Math.round(((cursorTouch.y - center.y)/radiusBound) * -100)
                            }
                        );

                        break;
                    }
                }

            }

            function onTouchEnd() {

                cursorTouchId = -1;

                scope.$apply(
                    scope.position = {
                        x : 0,
                        y : 0
                    }
                );

                cursorTouch.x = center.x;
                cursorTouch.y = center.y;
            }

            function draw() {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 5;
                ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI*2, true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 2;
                ctx.arc(center.x, center.y, radiusBound, 0, Math.PI*2, true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 2;
                ctx.arc(cursorTouch.x, cursorTouch.y, radiusCircle, 0, Math.PI*2, true);
                ctx.stroke();

                requestAnimFrame(draw);
            }

            // Check if touch is enabled
            var touchable = true;

            if(touchable) {
                canvas.addEventListener( 'touchstart', onTouchStart, false );
                canvas.addEventListener( 'touchmove', onTouchMove, false );
                canvas.addEventListener( 'touchend', onTouchEnd, false );

                window.onorientationchange = resetCanvas;
                window.onresize = resetCanvas;
            }

            scope.$watch('position', function(newval) {
                cursorTouch = {
                    x : ((newval.x * radiusBound) / 100) + center.x,
                    y : ((newval.y * radiusBound) / -100) + center.y
                }
            });

            resetCanvas();
            draw();

        }

    };

});