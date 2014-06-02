'use strict';
(function startApp() {

    function bootstrap() {
        // Only start this app if we are not mocking the backend, else start Mocking App
        if(!angular.mock) {
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['iasCar']);
            });
        } else {
            angular.element(document).ready(function() {
                angular.bootstrap(document, ['iasCarMock']);
            });
            window.console.log('mocking');
        }
    }

    // In case cordova is available we want to start on device ready
    if(window.cordova) {
        document.addEventListener('deviceready', function() {
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

})();
