'use strict';
angular.module('iasCar.directives').directive('distance', ['$filter', function($filter) {

    return {
        restrict : 'E',
        scope : {
            sensors : '='
        },
        template : '<canvas class="distanceCanvas"></canvas>',
        link : function(scope, element) {

            var height = 200;
            var width  = 200;
            var lineWidth = 5;
            var colorUSFront, colorUSRear, colorIRFront, colorIRRear;

            var center = {
                x : height / 2,
                y : width / 2
            };

            // Canvas and context element
            var container = element[0];
            var canvas = container.children[0];
            var ctx = canvas.getContext('2d');

            function resetCanvas() {
                canvas.height = height;
                canvas.width = width;
            }

            function draw() {

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (scope.sensors) {
                    colorUSFront = $filter('distanceColor')($filter('distanceUS')(scope.sensors.distanceUSFront));
                    colorUSRear = $filter('distanceColor')($filter('distanceUS')(scope.sensors.distanceUSRear));
                    colorIRFront = $filter('distanceColor')($filter('distanceIR')(scope.sensors.distanceIRFront));
                    colorIRRear  = $filter('distanceColor')($filter('distanceIR')(scope.sensors.distanceIRRear));
                }

                for (var i = 1; i < 7; i++) {
                    // US Front
                    if (scope.sensors && scope.sensors.distanceUSFront) {

                        if ($filter('distanceUS')(scope.sensors.distanceUSFront) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorUSFront;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, i * 12, 10 / 8 * Math.PI, 14 / 8 * Math.PI, false);
                            ctx.stroke();
                        }
                    }

                    // IR Front
                    if (scope.sensors && scope.sensors.distanceIRFront) {

                        if ($filter('distanceIR')(scope.sensors.distanceIRFront) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorUSFront;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, (i * 12) + 6, 11 / 8 * Math.PI, 13 / 8 * Math.PI, false);
                            ctx.stroke();
                        }
                    }

                    // US Rear
                    if (scope.sensors && scope.sensors.distanceUSRear) {

                        if ($filter('distanceUS')(scope.sensors.distanceUSRear) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorUSRear;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, i * 12, 2 / 8 * Math.PI, 6 / 8 * Math.PI, false);
                            ctx.stroke();
                        }
                    }

                    // IR Rear
                    if (scope.sensors && scope.sensors.distanceIRFront) {

                        if ($filter('distanceIR')(scope.sensors.distanceIRRear) >= i) {
                            ctx.beginPath();
                            ctx.strokeStyle = colorIRRear;
                            ctx.lineWidth = lineWidth;
                            ctx.arc(center.x, center.y, (i * 12) + 6, 3 / 8 * Math.PI, 5 / 8 * Math.PI, false);
                            ctx.stroke();
                        }
                    }
                }

                requestAnimFrame(draw);
            }

            window.onorientationchange = resetCanvas;
            window.onresize = resetCanvas;

            // Bind to the values from outside
            scope.$watch('sensors', function() {

            });

            resetCanvas();
            draw();

        }

    };

}]);