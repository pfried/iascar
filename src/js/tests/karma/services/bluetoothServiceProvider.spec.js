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

        it('should throw an error if there is no bluetooth provider available', function() {

            // Config sets a provider, so set to empty string here
            bluetoothServiceProvider.setProvider('noProvider');

            inject(function ($injector) {
                expect(function () {$injector.get('bluetoothService');}).toThrow();
            });
        });

        it('should return false if no bluetooth provider is present', function() {
            // TODO: Tests wont work in chrome itself since window.chrome is not deleteable
            try {
                delete window.bluetoothle;
                delete window.chrome;
            } catch(e) {
                console.error(e);
            }

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
            window.bluetoothle = {};

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