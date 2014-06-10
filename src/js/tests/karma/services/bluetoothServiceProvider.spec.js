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

        it('should be configurable', function() {

            bluetoothServiceProvider.setProvider('chrome');

            inject(function ($injector) {
                bluetoothService = $injector.get('bluetoothService');
            });

            expect(bluetoothService).toBeTruthy();
        });

        it('should throw an error if there is no bluetooth provider available', function() {
            inject(function ($injector) {
                bluetoothService = $injector.get('bluetoothService');
            });
        });

    });
}());