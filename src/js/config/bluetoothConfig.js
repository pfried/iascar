'use strict';
angular.module('iasCar.services').config(['bluetoothServiceProvider', function (bluetoothServiceProvider) {

    // Set the environment for the Bluetooth Service Provider
    if(window.bluetoothle) {
        bluetoothServiceProvider.setProvider('cordova');
    }

    if(window.chrome && window.chrome.bluetooth && window.chrome.bluetoothLowEnergy) {
        bluetoothServiceProvider.setProvider('chrome');
    }


}]);
