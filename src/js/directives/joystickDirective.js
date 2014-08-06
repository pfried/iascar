// https://github.com/sebleedelisle/JSTouchController/blob/master/TouchControl.html
'use strict';
angular.module('iasCar.directives').directive('joystick', function() {

    return {
        restrict : 'E',
        scope : {
            // Using primitives here did not work, so we use an Object, see: http://stackoverflow.com/questions/14049480/what-are-the-nuances-of-scope-prototypal-prototypical-inheritance-in-angularjs
            position : '=',
            controls : '@'
        },
        template : '<canvas class="joystickCanvas"></canvas>',
        link : function(scope, element) {

            var joystickHeight = 200;
            var joystickWidth  = 200;

            var center = {
                y : joystickHeight / 2,
                x : joystickWidth / 2
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

            var scaleX = 1, scaleY = 1;

            function isControlX() {
                return scope.controls.indexOf('X') >= 0;
            }

            function isControlY() {
                return scope.controls.indexOf('Y') >= 0;
            }

            function resetCanvas() {
                canvas.height = joystickHeight;
                canvas.width = joystickWidth;
            }

            function onTouchStart(event) {
                var touch = event.targetTouches[0];
                cursorTouchId = touch.identifier;
                setPosition(touch);
            }

            function applyPosition() {
                scope.$apply(function() {
                    if(isControlX()) {
                        scope.position.x = Math.round(((cursorTouch.x - center.x) / radiusBound) * 100);
                    }
                    if(isControlY()) {
                        scope.position.y = Math.round(((cursorTouch.y - center.y) / radiusBound) * -100);
                    }
                });
            }

            function setPosition(touch) {

                if(isControlX()) {
                    cursorTouch.x = touch.pageX - touch.target.offsetLeft;
                    scaleX = radiusBound / (cursorTouch.x - center.x);
                    if(Math.abs(scaleX) < 1) {
                        cursorTouch.x = Math.abs(cursorTouch.x - center.x) * scaleX + center.x;
                    }
                }

                if(isControlY()) {
                    cursorTouch.y = touch.pageY - touch.target.offsetTop;
                    scaleY = radiusBound / (cursorTouch.y - center.y);
                    if (Math.abs(scaleY) < 1) {
                        cursorTouch.y = Math.abs(cursorTouch.y - center.y) * scaleY + center.y;
                    }
                }

                applyPosition();
            }

            function onTouchMove(event) {
                // Prevent the browser from doing its default thing (scroll, zoom)
                event.preventDefault();
                for(var i = 0; i < event.changedTouches.length; i++){
                    var touch = event.changedTouches[i];

                    if(cursorTouchId === touch.identifier) {
                        setPosition(touch);
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
                ctx.lineWidth = 8;
                ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI*2, true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 3;
                ctx.arc(center.x, center.y, radiusBound, 0, Math.PI*2, true);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 3;
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

            // Bind to the values from outside as well
            scope.$watch('position', function(newval) {
                cursorTouch = {
                    x : ((newval.x * radiusBound) / 100) + center.x,
                    y : ((newval.y * radiusBound) / -100) + center.y
                };
            });

            resetCanvas();
            draw();

        }

    };

});