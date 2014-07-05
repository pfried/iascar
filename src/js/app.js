'use strict';

// Initialize Module
angular.module('iasCar', [
    'ngCookies',
    'ngResource',
    'ui.bootstrap',
    'ui.router',
    'iasCar.config',
    'iasCar.filters',
    'iasCar.services',
    'iasCar.directives',
    'pascalprecht.translate'
]);

// Initialize Submodules
angular.module('iasCar.config', []);
angular.module('iasCar.filters', []);
angular.module('iasCar.services', []);
angular.module('iasCar.directives', []);