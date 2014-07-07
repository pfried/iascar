'use strict';
angular.module('iasCar.services').factory('cordovaBluetoothService', ['$window','$rootScope', '$q', 'bluetoothTools', function($window, $rootScope, $q, bluetoothTools) {

    var devices = [];

    var bt = $window.bluetoothle;

    var previouslyConnectedDevice;

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

            if(initialized && initialized.isInitialized === true) {
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

                stopScan();

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

        // Check if we were connected to a device already
        if(previouslyConnectedDevice) {
            return reconnect(params);
        }

        var deferred = $q.defer();

        isInitialized().then(function() {

            if(!params || !params.address) {
                return deferred.reject(bluetoothTools.errorMessages.noAddress);
            }

            if(!bluetoothTools.isValidAddress(params.address)) {
                return deferred.reject(bluetoothTools.errorMessages.addressNotValid);
            }

            var deviceAddress = bluetoothTools.addressToAndroidFormat(params.address);

            // We get the disconnected event within this function
            // so we do only notify on connected event in order to not resolve the promise
            bt.connect(function(result) {

                if(result && result.status === 'connecting') {
                    deferred.notify(result);
                }
                if(result && result.status === 'connected') {
                    previouslyConnectedDevice = params.address;
                    deferred.notify(result);
                }
                if(result && result.status === 'disconnected') {
                    deferred.resolve(result);
                }

            }, function (error) {
                deferred.reject(error.message);
            }, {
                address : deviceAddress
            });

        },function() {
            deferred.reject(bluetoothTools.errorMessages.notInitialized);
        });

        return deferred.promise;
    }

    function reconnect(params) {
        var deferred = $q.defer();

        isInitialized().then(function() {

            if(!params || !params.address) {
                return deferred.reject(bluetoothTools.errorMessages.noAddress);
            }

            if(!bluetoothTools.isValidAddress(params.address)) {
                return deferred.reject(bluetoothTools.errorMessages.addressNotValid);
            }

            var deviceAddress = bluetoothTools.addressToAndroidFormat(params.address);

            // We get the disconnected event within this function
            // so we do only notify on connected event in order to not resolve the promise
            bt.reconnect(function(result) {

                if(result && result.status === 'connecting') {
                    deferred.notify(result);
                }
                if(result && result.status === 'connected') {
                    deferred.notify(result);
                }
                if(result && result.status === 'disconnected') {
                    deferred.resolve(result);
                }

            }, function (error) {
                deferred.reject(error.message);
            }, {
                address : deviceAddress
            });

        },function() {
            deferred.reject(bluetoothTools.errorMessages.notInitialized);
        });

        return deferred.promise;
    }

    function disconnect() {
        var deferred = $q.defer();

        bt.disconnect(function(result) {

            if(result && result.status === 'disconnecting') {
                deferred.notify(result);
            }

            if(result && result.status === 'disconnected') {
                deferred.resolve(result);
            }

        }, function(error) {
            deferred.reject(error.message);
        });

        return deferred.promise;
    }

    function discover() {
        var deferred = $q.defer();

        bt.discover(function(result) {
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error.message);
        });

        return deferred.promise;
    }

    return {
        _bt : bt,
        initialize     : initialize,
        isInitialized  : isInitialized,
        startScan      : startScan,
        stopScan       : stopScan,
        connect        : connect,
        reconnect      : reconnect,
        disconnect     : disconnect,
        discover       : discover
    };

}]);