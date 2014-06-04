'use strict';

// Car service
angular.module('iasCar.services').factory('bluetoothService', ['$window','$rootScope', '$q', 'cordovaService', function($window, $rootScope, $q, cordovaService) {

    var initialized = false;
    var timeout;

    var devices = [];

    var bt = $window.bluetoothle;

    function initialize() {

        var deferred = $q.defer();

        if (initialized === false) {
            bt.initialize(function(result) {
                if(result && result.status === 'initialized') {
                    initialized = true;
                    deferred.resolve(result);
                } else {
                    deferred.reject(result.message);
                }
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    function isInitialized() {
        return initialized;
    }

    function isAvailable() {
        return cordovaService.isAvailable() && $window.hasOwnProperty('bluetoothle');
    }

    function startScan() {

        var deferred = $q.defer();

        if (!isInitialized()) {
            deferred.reject('Initialize Bluetooth first');
        }

        devices = [];

        bt.startScan(function(result) {

            // Resolve the promise if scan was started
            if(result && result.status === 'scanStarted') {
                deferred.resolve(devices);
            }

            if(result && result.status === 'scanResult') {

                // Since the results come from outside of the angular scope we need to wrap this in the apply function
                $rootScope.$apply(function() {
                    devices.push({
                        address : result.address,
                        name : result.name,
                        rssi : result.rssi
                    });
                });
            }
        }, function(error) {
            deferred.reject(error.message);
        });

        return deferred.promise;
    }

    function stopScan() {
        bt.stopScan(function() {});
    }

    function connect(device) {
        var deferred = $q.defer();

        bt.connect(function(result) {
            if(result && result.status === 'connecting') {
                deferred.notify(result);
            }
            if(result && result.status === 'connected') {
                deferred.resolve(result);
            }
        }, function (error) {
            deferred.reject(error.message);
        }, {
            address : device.address
        });

        return deferred.promise;
    }

    return {
        isAvailable   : isAvailable,
        initialize    : initialize,
        isInitialized : isInitialized,
        startScan     : startScan,
        stopScan      : stopScan,
        connect       : connect
    };

}]);