'use strict';
angular.module('iasCar.services').factory('cordovaBluetoothService', ['$window','$rootScope', '$q', 'bluetoothTools', function($window, $rootScope, $q, bluetoothTools) {

    var devices = [];

    var bt = $window.bluetoothle;

    function initialize() {

        var deferred = $q.defer();

        bt.initialize(function(result) {
            if(result && result.status === 'initialized') {
                deferred.resolve(result);
            }
        }, function(error) {
            deferred.reject(error);
        }, {
            // Request turning on bt
            'request' : true
        });

        return deferred.promise;
    }

    function isInitialized() {

        var deferred = $q.defer();

        bt.isInitialized(function(initialized) {

            // TODO: Fix the typo here once it is fixed in plugin
            if(initialized && initialized.isInitalized === true) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });

        return deferred.promise;
    }

    function startScan() {

        var deferred = $q.defer();

        isInitialized().then(function() {
                devices = {};

                bt.startScan(function(result) {

                    // Resolve the promise if scan was started
                    if(result && result.status === 'scanStarted') {
                        deferred.resolve(devices);
                    }

                    if(result && result.status === 'scanResult') {

                        // Since the results come from outside of the angular scope we need to wrap this in the apply function
                        $rootScope.$apply(function() {
                            devices[bluetoothTools.unifyAddress(result.address)] = {
                                'address' : result.address,
                                'name' : result.name,
                                'rssi' : result.rssi
                            };
                        });
                    }
                }, function(error) {
                    deferred.reject(error.message);
                });
            }, function() {
                deferred.reject(bluetoothTools.errorMessages.notInitialized);
            }
        );

        return deferred.promise;
    }

    function stopScan() {
        bt.stopScan(function() {});
    }

    function connect(params) {
        var deferred = $q.defer();

        isInitialized().then(function() {

            if(!params || !params.address) {
                return deferred.reject(bluetoothTools.errorMessages.noAddress);
            }

            if(!bluetoothTools.isValidAddress(params.address)) {
                return deferred.reject(bluetoothTools.errorMessages.addressNotValid);
            }

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
                address : params.address
            });

        },function() {
            deferred.reject(bluetoothTools.errorMessages.notInitialized);
        });

        return deferred.promise;
    }

    return {
        _bt : bt,
        initialize     : initialize,
        isInitialized  : isInitialized,
        startScan      : startScan,
        stopScan       : stopScan,
        connect        : connect
    };

}]);