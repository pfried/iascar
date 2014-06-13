'use strict';

// Car service
angular.module('iasCar.services').factory('chromeBluetoothService', ['$window', '$q', function($window, $q) {

    var chrome = $window.chrome;
    var bt = chrome ? chrome.bluetooth : false;

    function initialize() {
        var deferred = $q.defer();

        bt.getAdapterState(function(adapter) {
            deferred.resolve(adapter);
        });

        return deferred.promise;
    }

    return {
        initialize : initialize
    };

}]);