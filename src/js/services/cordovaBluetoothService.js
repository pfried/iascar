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

            if(initialized && initialized.isInitialized === true) {
                deferred.resolve();
            } else {
                deferred.reject();
            }
        });

        return deferred.promise;
    }

    function startScan(params) {

        var deferred = $q.defer();
        var scanParams = params ? params : { 'serviceUuids' : [] };

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
                }, scanParams);

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

            var deviceAddress = bluetoothTools.addressToAndroidFormat(params.address);

            // We get the disconnected event within this function
            // so we do only notify on connected event in order to not resolve the promise
            bt.connect(function(result) {

                if(result && result.status === 'connecting') {
                    deferred.notify(result);
                }
                if(result && result.status === 'connected') {
                    deferred.notify(result);
                }
                if(result && result.status === 'disconnected') {
                    deferred.resolve(result);
                }

            }, function () {
                // Try reconnecting
                return disconnect().then(close).then(function(params){ connect(params); });
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

    function close() {
        var deferred = $q.defer();

        bt.close(function(result) {

            if(result && result.status === 'closed') {
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
            if(result.status === 'discovered') {
                deferred.resolve(result);
            }
        }, function(error) {
            deferred.reject(error.message);
        });

        return deferred.promise;
    }

    function read(params) {
        var deferred = $q.defer();

        bt.read(function(result) {
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error.message);
        }, params);

        return deferred.promise;
    }

    function write(params) {
        var deferred = $q.defer();

        bt.write(function(result) {
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error.message);
        }, params);

        return deferred.promise;
    }

    function subscribe(params) {
        var deferred = $q.defer();

        // If not set it is regarded as indication
        params.isNotification = true;

        bt.subscribe(function(result) {

            if(result.status === 'subscribed' || result.status === 'subscribedResult') {
                deferred.notify(result);
            }

            if(result.status === 'unsubscribed') {
                deferred.resolve(result);
            }

        }, function(error) {
            deferred.reject(error.message);
        }, params);

        return deferred.promise;
    }

    function unsubscribe(params) {
        var deferred = $q.defer();

        bt.unsubscribe(function(result) {

            deferred.resolve(result);

        }, function(error) {
            deferred.reject(error.message);
        }, params);

        return deferred.promise;
    }

    function readDescriptor(params) {
        var deferred = $q.defer();

        bt.readDescriptor(function(result) {

            deferred.resolve(result);

        }, function(error) {
            deferred.reject(error.message);
        }, params);

        return deferred.promise;
    }

    function rssi() {
        var deferred = $q.defer();

        bt.rssi(function(result) {
            deferred.resolve(result);
        }, function(error) {
            deferred.reject(error.message);
        });

        return deferred.promise;
    }

    function stringToBytes(string) {
        return bt.stringToBytes(string);
    }

    function bytesToString(bytes) {
        return bt.bytesToString(bytes);
    }

    function bytesToEncodedString(bytes) {
        return bt.bytesToEncodedString(bytes);
    }

    function encodedStringToBytes(string) {
        return bt.encodedStringToBytes(string);
    }

    return {
        _bt : bt,
        initialize           : initialize,
        isInitialized        : isInitialized,
        startScan            : startScan,
        stopScan             : stopScan,
        connect              : connect,
        reconnect            : reconnect,
        disconnect           : disconnect,
        close                : close,
        discover             : discover,
        read                 : read,
        write                : write,
        subscribe            : subscribe,
        unsubscribe          : unsubscribe,
        readDescriptor       : readDescriptor,
        rssi                 : rssi,
        bytesToString        : bytesToString,
        stringToBytes        : stringToBytes,
        bytesToEncodedString : bytesToEncodedString,
        encodedStringToBytes : encodedStringToBytes
    };

}]);