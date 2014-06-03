'use strict';

(function() {
    describe('Bluetooth Service', function() {

        var bluetoothService;

        beforeEach(function() {

            module('iasCar.services');

            window.mockBluetooth();

            inject(function ($injector) {
                bluetoothService = ($injector.get('bluetoothService'));
            });
        });

        it('should detect whether bluetooth is present or not', function() {
            expect(bluetoothService.isAvailable()).toBe(true);
            delete window.bluetoothle;
            expect(bluetoothService.isAvailable()).toBe(false);
        });

        it('should return false if it is not yet initialized', function() {
            expect(bluetoothService.isInitialized()).toBe(false);
        });

        it('should initialize bluetooth', function() {
            bluetoothService.initialize();
            expect(bluetoothService.isInitialized()).toBe(true);
        });

        it('should return a list of bluetooth devices', function() {

        });

    });
}());