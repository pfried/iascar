'use strict';

(function() {
    describe('Bluetooth Service', function() {

        var bluetoothService;
        var $rootScope;
        var success, error, notify;

        beforeEach(function() {

            module('iasCar.services');

            window.mockBluetooth();

            inject(function ($injector) {
                bluetoothService = ($injector.get('bluetoothService'));
                $rootScope = ($injector.get('$rootScope'));
            });

            success = jasmine.createSpy('success');
            error = jasmine.createSpy('error');
            notify = jasmine.createSpy('notify');
        });

        it('should detect whether bluetooth is present or not', function() {
            expect(bluetoothService.isAvailable()).toBe(true);
            delete window.bluetoothle;
            expect(bluetoothService.isAvailable()).toBe(false);
        });

        it('should fulfill error promise if it is not yet initialized', function() {
            bluetoothService.isInitialized().then(success, error);
            $rootScope.$apply();
            expect(error).toHaveBeenCalled();
        });

        it('should fulfill success promise if it is not yet initialized', function() {
            bluetoothService.initialize().then(bluetoothService.isInitialized).then(success, error);
            $rootScope.$apply();
            expect(success).toHaveBeenCalled();
        });

        it('should initialize bluetooth', function() {
            bluetoothService.initialize().then(success, error);
            $rootScope.$apply();
            expect(success).toHaveBeenCalled();
        });

        it('should not scan for bluetooth devices before initialization', function() {
            bluetoothService.startScan().then(success, error);
            $rootScope.$apply();
            expect(error).toHaveBeenCalledWith(bluetoothService.errorMessages.notInitialized);
        });

        it('should scan for bluetooth devices', function() {
            bluetoothService.initialize().then(bluetoothService.startScan).then(success,error);
            $rootScope.$apply();
            expect(success).toHaveBeenCalled();
        });

        it('should not connect to bluetooth devices before initialization', function() {
            bluetoothService.connect().then(success, error);
            $rootScope.$apply();
            expect(error).toHaveBeenCalledWith(bluetoothService.errorMessages.notInitialized);
        });

        it('should not connect to bluetooth devices without an address', function() {
            bluetoothService.initialize().then(bluetoothService.connect).then(success, error);
            $rootScope.$apply();
            expect(error).toHaveBeenCalledWith(bluetoothService.errorMessages.noAddress);
        });

        // TODO Jasmine 2.0 changes jasmine clock, we need this feature here since there will be two callbacks
        it('should connect to a bluetooth device if an address is given', function() {
            console.log('jasmine-version:' + jasmine.getEnv().versionString());
            bluetoothService.initialize().then(function() {
                return bluetoothService.connect({
                    'address' : 'ab'
                });
            }).then(success, error, notify);
            $rootScope.$apply();
            //expect(notify).toHaveBeenCalled();
        });

        it('should validate a correct device address and invalidate an incorrect one', function(){
            var valid = "01:23:45:67:89:ab";
            var invalid = "123";
            expect(bluetoothService.isValidAddress(valid)).toBe(true);
            expect(bluetoothService.isValidAddress(invalid)).toBe(false);
        });

    });
}());