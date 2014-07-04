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

        it('should unify the address format between android and ios', function() {
            var android =  '01:23:45:67:89:ab';
            var ios = '0123456789ab';
            expect(bluetoothTools.unifyAddress(android)).toBe(bluetoothTools.unifyAddress(ios));
            expect(bluetoothTools.unifyAddress(android)).toBe('0123456789ab');
        });

        it('should translate an address to the android format', function() {
           var address =  '0123456789ab';
           var androidFormat = bluetoothTools.addressToAndroidFormat(address);
           expect(androidFormat).toBe('01:23:45:67:89:ab');
           // Should be idempotent
           expect(bluetoothTools.addressToAndroidFormat(androidFormat)).toBe('01:23:45:67:89:ab');
           expect(bluetoothTools.isValidAddress(androidFormat)).toBe(true);
        });
    });

}());