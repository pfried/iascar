'use strict';
angular.module('iasCar.services').factory('chromeBluetoothService', ['$window','$rootScope', '$q', 'bluetoothTools', function($window, $rootScope, $q, bluetoothTools) {

    var chrome = $window.chrome;
    var bt = chrome.bluetooth;

    var state = {
        initialized : false
    };

    var devices = [];

    function initialize() {
        var deferred = $q.defer();

        bt.onDeviceAdded.addListener(function(device) {
            console.log(device);
            $rootScope.$apply(function() {
                devices[bluetoothTools.unifyAddress(device.address)] = {
                    'address' : device.address,
                    'name' : device.name,
                    'rssi' : 0
                };
            });
        });

        bt.onDeviceChanged.addListener(function(device) {
            console.log(device);
            $rootScope.$apply(function() {
                devices[bluetoothTools.unifyAddress(device.address)] = {
                    'address' : device.address,
                    'name' : device.name,
                    'rssi' : 0
                };
            });
        });

        bt.onDeviceRemoved.addListener(function(device) {
            console.log(device);
            $rootScope.$apply(function() {
                delete devices[bluetoothTools.unifyAddress(device.address)];
            });
        });

        bt.getAdapterState(function(adapter) {
            console.log(adapter);
            if(adapter.available) {
                state.initialized = true;
                deferred.resolve(adapter);
            }
        });

        return deferred.promise;
    }

    function isInitialized() {
        var deferred = $q.defer();
        if(state.initialized) {
            deferred.resolve();
        } else {
            deferred.reject();
        }
        return deferred.promise;
    }

    function startScan() {
        var deferred = $q.defer();

        bt.startDiscovery(function() {
            deferred.resolve(devices);
        });

        return deferred.promise;
    }

    function stopScan() {
        var deferred = $q.defer();

        bt.getDevices(function(devices) {
            console.log(devices);
        });

        bt.stopDiscovery(function() {
            deferred.resolve(devices);
        });

        return deferred.promise;
    }



    return {
        initialize : initialize,
        isInitialized : isInitialized,
        startScan : startScan,
        stopScan : stopScan
    };

}]);