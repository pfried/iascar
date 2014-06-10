'use strict';
angular.module('iasCar.services').config(['bluetoothServiceProvider', function (bluetoothServiceProvider) {

    // Set the environment for the Bluetooth Service Provider
    bluetoothServiceProvider.setProvider('cordova');

}]);
