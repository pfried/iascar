'use strict';

// Car service
angular.module('iasCar.services').factory('cordovaService', ['$window', function($window) {

    function isAvailable() {
        return $window.hasOwnProperty('cordova');
    }

    return {
        isAvailable : isAvailable
    };

}]);