'use strict';

(function() {
    describe('Bluetooth Mock', function() {

        var cordovaService;
        var bt;

        beforeEach(function() {
            window.mockBluetooth();
            bt = window.bluetoothle;
        });

        it('should be present on the window object', function() {
            expect(bt).toBeDefined();
        });

        it('should have errorMessages available', function() {
            expect(bt.errorMessages).toBeDefined();
            expect(bt.errorMessages.default).toBe('Default error message');
        });

        it('should be able to add an error to an event', function() {
            bt.addError('initialize', bt.errorMessages.initialize.notEnabled);
            expect(bt.expectingError('initialize')).toBe(true);
        });

        it('should be able to return an error to function call', function() {
            var result;
            bt.addError('initialize', bt.errorMessages.initialize.notEnabled);
            expect(bt.expectingError('initialize')).toBe(true);
            bt.initialize(function(result) {
                result = result;
            }, function (error) {
                result = error;
            });
            // Error must be removed from error queue
            expect(bt.expectingError('initialize')).toBe(false);
            expect(result).toEqual({
                status : 'initialize',
                message : bt.errorMessages.initialize.notEnabled
            });
        });

        it('should not throw an error for a different event', function() {
            bt.addError('initialize', bt.errorMessages.initialize.notEnabled);
            expect(bt.expectingError('read')).toBe(false);
        });

        it('should keep errors in the error queue if one is returned', function() {
            bt.addError('initialize', bt.errorMessages.initialize.notEnabled);
            bt.addError('initialize', bt.errorMessages.initialize.notSupported);
            expect(bt.expectingError('initialize')).toBe(true);
            bt.initialize(function() {}, function () {});
            expect(bt.expectingError('initialize')).toBe(true);
        });

    });
}());