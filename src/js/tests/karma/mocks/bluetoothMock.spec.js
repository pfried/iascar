'use strict';

(function() {
    describe('Cordova Bluetooth Mock', function() {

        var bt;

        beforeEach(function() {
            window.mockCordovaBluetooth();
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

        it('should be able to initialize the bluetooth module', function() {
            var state;
            bt.isInitialized(function(result) {
                state = result;
            });
            expect(state).toEqual({'isInitialized' : false});
            bt.initialize(function(result) {
                expect(result.status).toBe('initialized');
            }, function() {});
            bt.isInitialized(function(result) {
                state = result;
            });
            expect(state).toEqual({'isInitialized' : true});
        });

        it('should scan for bluetooth devices', function() {
            var result;
            bt.startScan(function(res) {
                result = res;
            }, function(){

            });
            expect(result).toEqual({
                'status' : 'scanStarted'
            });
        });

        // Receiving devices is asynchronous, need to figure out a test
        it('connects to a device and return an error if no address is given', function() {
            var error, result;
            bt.connect(function(res) {
                result = res;
            }, function(err) {
                error = err;
            });
            expect(error.message).toBe(bt.errorMessages.connect.noAddress);
        });

        it('connects to a device by a given address', function() {
            var error, result;
            bt.connect(function(res){
                result = res;
            }, function(err) {
                error = err;
            }, {
                'address' : '01:23:45:67:89:AB'
            });

            //expect(result).toEqual({ 'status': 'connecting', 'address': '01:23:45:67:89:AB', 'name': 'iasCar1' });

        });

        // https://github.com/ariya/phantomjs/issues/11172
        //it('should convert string to array buffer and back', function() {
        //    console.log(Uint16Array);
        //    expect(bt.bytesToString(bt.stringToBytes('foo'))).toEqual('foo');
        //});

        // https://github.com/ariya/phantomjs/issues/11172
        //it('should convert an encoded string to array buffer and back', function(){
        //    expect(bt.bytesToEncodedString(bt.encodedStringToBytes('foo'))).toBe('foo');
        //});

    });
}());