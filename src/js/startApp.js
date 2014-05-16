'use strict';
(function startApp() {

    function bootstrap() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['iasCar']);
        });
    }

    // In case cordova is available we want to start on device ready
    if(window.cordova) {
        document.addEventListener('deviceready', function() {
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    window.console.log('Starting iasCar Application');

})();
