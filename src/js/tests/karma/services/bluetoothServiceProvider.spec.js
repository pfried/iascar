'use strict';

(function() {
    describe('Bluetooth Service Provider', function() {

        var bluetoothServiceProvider;
        var bluetoothService;

        beforeEach(function() {

            angular.module('iasCar.services').config(['bluetoothServiceProvider', function (BluetoothServiceProvider) {
                bluetoothServiceProvider = BluetoothServiceProvider;
            }]);

            module('iasCar.services');

            inject(function(){});

        });

        it('should return false if there is no bluetooth provider available', function() {

            // Config sets a provider, so set to empty string here
            bluetoothServiceProvider.setProvider('');

            inject(function ($injector) {
                expect($injector.get('bluetoothService')).toBe(false);
            });
        });

        it('should return false if no bluetooth provider is present', function() {
            expect(bluetoothServiceProvider.detectProviderName()).toBeFalsy();
        });

        it('should detect the chrome provider based on window properties', function() {

            window.chrome = {
                bluetooth : true,
                bluetoothLowEnergy : true
            };

            expect(bluetoothServiceProvider.detectProviderName()).toBe('chrome');

            delete window.chrome;
        });

        it('should detect the cordova provider based on window properties', function() {

            window.cordova = {};

            expect(bluetoothServiceProvider.detectProviderName()).toBe('cordova');

            delete window.cordova;
        });

        it('should return the chrome bluetooth service', function() {

            bluetoothServiceProvider.setProvider('chrome');

            inject(function ($injector) {
                bluetoothService = $injector.get('bluetoothService');
            });

            expect(bluetoothService).toBeTruthy();
        });

        it('should return the cordova bluetooth service', function() {

            bluetoothServiceProvider.setProvider('cordova');

            inject(function ($injector) {
                bluetoothService = $injector.get('bluetoothService');
            });

            expect(bluetoothService).toBeTruthy();
        });

    });
}());