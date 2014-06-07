'use strict';
// Car service
angular.module('iasCar.services').factory('bluetoothService', ['$window','$rootScope', '$q', 'cordovaService', function($window, $rootScope, $q, cordovaService) {

    var devices = [];
    var macRegex = /^([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2})$/;

    var bt = $window.bluetoothle;

    var errorMessages = {
        notInitialized : 'Initialize Bluetooth first',
        noAddress : 'Please provide an address for connecting to a device',
        addressNotValid : 'Please provide the address in the correct format'
    };

    function isValidAddress(address) {

        if (address && macRegex.test(address)) {
            return true;
        }

        return false;
    }

    function unifyAddress(address) {
        return address.replace(/\:/g,'');
    }

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

    function isAvailable() {
        return cordovaService.isAvailable() && $window.hasOwnProperty('bluetoothle');
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
                            devices[unifyAddress(result.address)] = {
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
                deferred.reject(errorMessages.notInitialized);
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
                return deferred.reject(errorMessages.noAddress);
            }

            if(!isValidAddress(params.address)) {
                return deferred.reject(errorMessages.addressNotValid);
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
            deferred.reject(errorMessages.notInitialized);
        });

        return deferred.promise;
    }

    return {
        _bt : bt,
        isValidAddress : isValidAddress,
        errorMessages  : errorMessages,
        isAvailable    : isAvailable,
        initialize     : initialize,
        isInitialized  : isInitialized,
        startScan      : startScan,
        stopScan       : stopScan,
        connect        : connect
    };

}]);