'use strict';
angular.module('iasCar.directives').directive('distance', function() {

    return {
        restrict : 'E',
        scope : {
            sensors : '='
        },
        template : '<canvas class="distanceCanvas"></canvas>',
        link : function(scope, element) {

            var height = 200;
            var width  = 200;

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

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 8;
                ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI*2, true);
                ctx.stroke();

                requestAnimFrame(draw);
            }

            window.onorientationchange = resetCanvas;
            window.onresize = resetCanvas;

            // Bind to the values from outside
            scope.$watch('sensors', function(newval) {

            });

            resetCanvas();
            draw();

        }

    };

});