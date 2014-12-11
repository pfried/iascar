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
        template : '<canvas width="200px" height="200px"></canvas>',
        link : function(scope, element) {

            var joystickHeight = 200;
            var joystickWidth  = 200;

            var color = '#ff4081';
            var boundaryColor = '#bdbdbd';

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

            // The outer bounds of the canvas, needed for correct relative pointer position calculation
            var rect = canvas.getBoundingClientRect();

            // Id of the touch on the cursor
            var cursorTouchId = -1;

            var cursorTouch = {
                x : center.x,
                y : center.y
            };

            // Calculation of the bounds
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
                rect = canvas.getBoundingClientRect();
            }

            function onTouchStart(event) {
                // Somehow the values calculated on instantiation are not correct, so we have to do this here
                // as there is no better place to get a point in time after the compilation and linking
                resetCanvas();
                var touch = event.targetTouches[0];
                cursorTouchId = touch.identifier;
                setPosition(touch);
                event.preventDefault();
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
                    cursorTouch.x = touch.pageX - rect.left;
                    scaleX = radiusBound / (cursorTouch.x - center.x);
                    if(Math.abs(scaleX) < 1) {
                        cursorTouch.x = Math.abs(cursorTouch.x - center.x) * scaleX + center.x;
                    }
                }

                if(isControlY()) {
                    cursorTouch.y = touch.pageY - rect.top;
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

            function onTouchEnd(event) {

                // Is it this directives touch that ended?
                for(var i = 0; i < event.changedTouches.length; i++) {

                    var touch = event.changedTouches[i];

                    if (cursorTouchId === touch.identifier) {

                        cursorTouchId = -1;

                        if (isControlY()) {
                            cursorTouch.y = center.y;
                            scope.position.y = 0;
                        }

                        if (isControlX()) {
                            cursorTouch.x = center.x;
                            scope.position.x = 0;
                        }
                    }
                }

                scope.$apply();

                event.preventDefault();
            }

            function draw() {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // If X and Y
                if(isControlX() && isControlY()) {
                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 8;
                    ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI * 2, true);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 3;
                    ctx.arc(center.x, center.y, radiusBound, 0, Math.PI * 2, true);
                    ctx.stroke();
                }

                var height = radiusCircle / 2;
                var radius = height;
                var width = radiusBound + radius;
                var x = center.x;
                var y = center.y;

                // If the joystick is limited in one direction we want to draw some limit visualization
                if(!(isControlX() && isControlY())) {

                    ctx.beginPath();
                    ctx.strokeStyle = boundaryColor;

                    // Rotate the boundaries
                    if(isControlY()) {
                        var temp = height;
                        height = width;
                        width = temp;
                    }

                    ctx.moveTo(x , y - height);
                    ctx.arcTo(x + width, y - height, x + width, y - height + radius, radius);
                    ctx.arcTo(x + width, y + height, x, y + height, radius);
                    ctx.arcTo(x - width, y + height, x - width, y - height, radius);
                    ctx.arcTo(x - width, y - height, x, y - height, radius);
                    ctx.lineTo(x, y - height);

                    ctx.stroke();

                    //Draw a little circle inside the big one
                    ctx.beginPath();
                    ctx.strokeStyle = boundaryColor;
                    ctx.lineWidth = 3;
                    ctx.arc(cursorTouch.x, cursorTouch.y, radiusCircle / 2, 0, Math.PI*2, true);
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.strokeStyle = color;
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

                window.addEventListener('orientationchange', resetCanvas);
                window.addEventListener('resize', resetCanvas);
            }

            // Bind to the values from outside as well
            scope.$watch('position', function(newval) {
                if (newval) {
                    cursorTouch = {
                        x : ((newval.x * radiusBound) / 100) + center.x,
                        y : ((newval.y * radiusBound) / -100) + center.y
                    };
                }
            });

            draw();

        }

    };

});