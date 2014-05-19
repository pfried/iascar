'use strict';

(function() {
    describe('Bluetooth Service', function() {

        var bluetoothService;

        beforeEach(function() {

            module('iasCar.services');

            inject(function ($injector) {
                bluetoothService = ($injector.get('bluetoothService'));
            });
        });

        it('should detect whether cordova is present or not', function() {
            expect(bluetoothService.listDevices()).toBeUndefined();
        });

    });
}());