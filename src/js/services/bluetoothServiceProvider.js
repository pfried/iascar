'use strict';
angular.module('iasCar.services').provider('bluetoothService', ['$windowProvider', function($windowProvider) {

    var bluetoothProvider;
    var $window = $windowProvider.$get();
    var error = 'No Bluetooth LE Provider is present on the current system';

    // We need to inject the services here since no Providers registered

    // Set the Bluetooth provider manually
    this.setProvider = function setProvider(provider) {
        bluetoothProvider = provider;
    };

    // Returns the implementation of the available Bluetooth Provider
    this.$get = ['chromeBluetoothService', 'cordovaBluetoothService', function getBluetoothProvider (chromeBluetoothService, cordovaBluetoothService) {
        if(bluetoothProvider === 'cordova') {
            return cordovaBluetoothService;
        }

        if(bluetoothProvider === 'chrome') {
            return chromeBluetoothService;
        }

        throw error;
    }];

    // Returns the Name of the Bluetooth Provider
    this.detectProviderName = function detectProviderName() {

        if ($window.hasOwnProperty('cordova')) {
            return 'cordova';
        }

        if ($window.hasOwnProperty('chrome')) {
            return 'chrome';
        }

        throw error;

    };

}]);
