'use strict';
(function() {

    describe('Bluetooth Tools', function () {

        var bluetoothTools;

        beforeEach(function() {

            module('iasCar.services');
            inject(function ($injector) {
                bluetoothTools = ($injector.get('bluetoothTools'));
            });

        });

        it('should validate a correct device address and invalidate an incorrect one', function () {
            var valid = '01:23:45:67:89:ab';
            var invalid = '123';
            expect(bluetoothTools.isValidAddress(valid)).toBe(true);
            expect(bluetoothTools.isValidAddress(invalid)).toBe(false);
        });
    });

}());