'use strict';
angular.module('iasCar.directives').directive('horn', function() {

    return {
        restrict: 'E',
        scope: {
            setHornOn  : '&',
            setHornOff : '&'
        },
        template: '<canvas class="hornCanvas"></canvas>',
        link : function(scope, element) {

            console.log(scope.setHorn);

            var hornHeight = 50;
            var hornWidth  = 50;

            var center = {
                x : hornHeight / 2,
                y : hornWidth / 2
            };

            var radiusCircle = 20;

            // Canvas and context element
            var container = element[0];
            var canvas = container.children[0];
            var ctx = canvas.getContext('2d');

            function resetCanvas() {
                canvas.height = hornHeight;
                canvas.width = hornWidth;
            }

            function onTouchStart() {
                scope.setHornOn();
            }

            function onTouchEnd() {
                scope.setHornOff();
            }

            function draw() {
                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.beginPath();
                ctx.strokeStyle = 'cyan';
                ctx.lineWidth = 5;
                ctx.arc(center.x, center.y, radiusCircle, 0, Math.PI*2, true);
                ctx.stroke();
            }

            canvas.addEventListener( 'touchstart', onTouchStart, false );
            canvas.addEventListener( 'touchend', onTouchEnd, false );

            window.onorientationchange = resetCanvas;
            window.onresize = resetCanvas;

            resetCanvas();
            draw();
        }
    };
});