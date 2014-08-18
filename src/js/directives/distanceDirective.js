'use strict';
angular.module('iasCar.directives').directive('distance', ['$filter', function($filter) {

    return {
        restrict : 'E',
        scope : {
            sensors : '=',
            actuators  : '=',
            settings : '='
        },
        template : '<canvas width="175px" height="200px"></canvas>',
        link : function(scope, element) {

            // The canvas
            var height = 200;
            var width  = 175;

            // Top Center
            var angle = scope.sensors && scope.actuators.sensorServo ? $filter('sensorServoToRad')(scope.actuators.angle) : 12/8 * Math.PI;
            var angleBack = angle - Math.PI;
            // Width of the beams
            var widthIR = 1/8 * Math.PI;
            var widthUS = 2/8 * Math.PI;
            // The width of the beam lines
            var lineWidth = 5;
            // The three colors of the distance beams
            var colorUSFront, colorUSRear, colorIRFront, colorIRRear;

            var center = {
                y : height / 2,
                x : width / 2
            };

            // Canvas and context element
            var container = element[0];
            var canvas = container.children[0];
            var ctx = canvas.getContext('2d');
            ctx.scale(2,2);

            function resetCanvas() {
                canvas.height = height;
                canvas.width = width;
            }

            function draw() {

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Set the colors for the different distance sensors
                if (scope.sensors) {
                    colorUSFront = $filter('distanceColor')($filter('distanceUS')(scope.sensors.distanceUSFront));
                    colorUSRear = $filter('distanceColor')($filter('distanceUS')(scope.sensors.distanceUSRear));
                    colorIRFront = $filter('distanceColor')($filter('distanceIR')(scope.sensors.distanceIRFront));
                    colorIRRear  = $filter('distanceColor')($filter('distanceIR')(scope.sensors.distanceIRRear));
                }

                // Set the angle of the sensor servo
                if(scope.actuators && scope.actuators.sensorServo) {
                    angle = $filter('sensorServoToRad')(scope.actuators.sensorServo);
                }

                // Check if the rotation is disabled
                if(scope.settings && scope.settings.lockDistanceRotation) {
                    angle = 12/8 * Math.PI;
                }

                angleBack = angle - Math.PI;

                for (var i = 1; i < 7; i++) {
                    // US Front
                    if (scope.sensors && scope.sensors.distanceUSFront) {

                        if ($filter('distanceUS')(scope.sensors.distanceUSFront) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorUSFront;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, i * 12, angle - widthUS, angle + widthUS, false);
                            ctx.stroke();
                        }
                    }

                    // IR Front
                    if (scope.sensors && scope.sensors.distanceIRFront) {

                        if ($filter('distanceIR')(scope.sensors.distanceIRFront) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorIRFront;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, (i * 12) + 6, angle - widthIR, angle + widthIR, false);
                            ctx.stroke();
                        }
                    }

                    // US Rear
                    if (scope.sensors && scope.sensors.distanceUSRear) {

                        if ($filter('distanceUS')(scope.sensors.distanceUSRear) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorUSRear;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, i * 12, angleBack - widthUS, angleBack + widthUS, false);
                            ctx.stroke();
                        }
                    }

                    // IR Rear
                    if (scope.sensors && scope.sensors.distanceIRFront) {

                        if ($filter('distanceIR')(scope.sensors.distanceIRRear) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorIRRear;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, (i * 12) + 6, angleBack - widthIR, angleBack + widthIR, false);
                            ctx.stroke();
                        }
                    }
                }

                requestAnimFrame(draw);
            }

            window.onorientationchange = resetCanvas;
            window.onresize = resetCanvas;

            resetCanvas();
            draw();

        }

    };

}]);