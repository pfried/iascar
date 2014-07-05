'use strict';

(function() {
    describe('Cordova Bluetooth Service', function() {

        var bluetoothService, bluetoothTools;
        var $rootScope;
        var success, error, notify;

        beforeEach(function() {

            module('iasCar.services');

            window.mockCordovaBluetooth();

            inject(function ($injector) {
                bluetoothService = $injector.get('cordovaBluetoothService');
                bluetoothTools = $injector.get('bluetoothTools');
                $rootScope = $injector.get('$rootScope');
            });

            success = jasmine.createSpy('success');
            error = jasmine.createSpy('error');
            notify = jasmine.createSpy('notify');
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
            expect(error).toHaveBeenCalledWith(bluetoothTools.errorMessages.notInitialized);
        });

        it('should scan for bluetooth devices', function() {
            bluetoothService.initialize().then(bluetoothService.startScan).then(success,error);
            $rootScope.$apply();
            expect(success).toHaveBeenCalled();
        });

        it('should not connect to bluetooth devices before initialization', function() {
            bluetoothService.connect().then(success, error);
            $rootScope.$apply();
            expect(error).toHaveBeenCalledWith(bluetoothTools.errorMessages.notInitialized);
        });

        it('should not connect to bluetooth devices without an address', function() {
            bluetoothService.initialize().then(bluetoothService.connect).then(success, error);
            $rootScope.$apply();
            expect(error).toHaveBeenCalledWith(bluetoothTools.errorMessages.noAddress);
        });

        // TODO Jasmine 2.0 changes jasmine clock, we need this feature here since there will be two callbacks
        it('should connect to a bluetooth device if an address is given', function() {
            bluetoothService.initialize().then(function() {
                return bluetoothService.connect({
                    'address' : 'ab'
                });
            }).then(success, error, notify);
            $rootScope.$apply();
            //expect(notify).toHaveBeenCalled();
        });

        it('should disconnect from a bluetooth device', function() {
            bluetoothService._bt.deviceState.connected = true;

            bluetoothService.disconnect().then(success, error);

            $rootScope.$apply();
            expect(success).toHaveBeenCalled();
        });

        it('should not disconnect if the device is not connected', function() {
            bluetoothService._bt.deviceState.connected = false;

            bluetoothService.disconnect().then(success, error);

            $rootScope.$apply();
            expect(error).toHaveBeenCalled();
        });


    });
}());