'use strict';
angular.module('iasCar.config').config([function() {

    // Animation Frame polyfill
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Disable the scrolling e.g. in iOS the elastic Scroll bouncing
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);

}]);