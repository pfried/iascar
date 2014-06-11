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

        if ($window.hasOwnProperty('cordova')) {
            return 'cordova';
        }

        if ($window.hasOwnProperty('chrome') && $window.chrome.hasOwnProperty('bluetooth') && $window.chrome.hasOwnProperty('bluetoothLowEnergy')) {
            return 'chrome';
        }

        return false;

    };

    // Returns the implementation of the available Bluetooth Provider
    this.$get = ['chromeBluetoothService', 'cordovaBluetoothService', function getBluetoothProvider (chromeBluetoothService, cordovaBluetoothService) {

        var $injector = angular.injector();

        if(bluetoothProvider === 'cordova') {
            return cordovaBluetoothService;
        }

        if(bluetoothProvider === 'chrome') {
            return chromeBluetoothService;
        }

        return false;
    }];

}]);
