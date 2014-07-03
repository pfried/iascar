'use strict';
angular.module('iasCar.services').provider('bluetoothService', ['$windowProvider', function($windowProvider) {

    var bluetoothProvider;
    var $window = $windowProvider.$get();

    // We need to inject the services here since no Providers registered

    // Set the Bluetooth provider manually
    this.setProvider = function setProvider(provider) {
        bluetoothProvider = provider;
    };

    // Returns the Name of the Bluetooth Provider
    this.detectProviderName = function detectProviderName() {

        if ($window.hasOwnProperty('cordova') && window.hasOwnProperty('bluetoothle')) {
            return 'cordova';
        }

        if ($window.hasOwnProperty('chrome') && $window.chrome.hasOwnProperty('bluetooth') && $window.chrome.hasOwnProperty('bluetoothLowEnergy')) {
            return 'chrome';
        }

        return false;

    };

    // Returns the implementation of the available Bluetooth Provider
    this.$get = ['$injector', function getBluetoothProvider ($injector) {

        // If there is no Provider set, we run the autodetect feature once again
        if(!bluetoothProvider) {
            this.setProvider(this.detectProviderName());
        }

        if(bluetoothProvider === 'cordova') {
            return $injector.get('cordovaBluetoothService');
        }

        if(bluetoothProvider === 'chrome') {
            return $injector.get('chromeBluetoothService');
        }

        throw {
            name: 'Bluetooth Error',
            message: 'No Bluetooth Low Energy Provider available'
        };
    }];

}]);
