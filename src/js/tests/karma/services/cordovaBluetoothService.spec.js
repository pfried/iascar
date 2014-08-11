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

        it('should close a connection', function() {

            bluetoothService.close().then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalled();
        });

        it('should not disconnect if the device is not connected', function() {
            bluetoothService._bt.deviceState.connected = false;

            bluetoothService.disconnect().then(success, error);

            $rootScope.$apply();
            expect(error).toHaveBeenCalled();
        });

        it('should discover services and characteristics', function() {
            bluetoothService._bt.deviceState.connected = true;
            bluetoothService._bt.deviceState.discovered = false;

            bluetoothService.discover().then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalled();
        });

        it('should read a characeristic\'s value', function() {
            bluetoothService._bt.deviceState.connected = true;

            var params = {
                'serviceUuid' : '5678',
                'characteristicUuid' : '1234'
            };

            bluetoothService.read(params).then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalledWith({ 'status' : 'read', 'serviceUuid' : '5678', 'characteristicUuid' : '1234', 'value' : ''});
        });

        it('should write a value to a characteristic', function() {
            bluetoothService._bt.deviceState.connected = true;

            var params = {
                'serviceUuid' : '5678',
                'characteristicUuid' : '1234',
                'value' : 1
            };

            bluetoothService.write(params).then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalledWith({ 'status' : 'written', 'serviceUuid' : '5678', 'characteristicUuid' : '1234', 'value' : 1});
        });

        it('should subscribe to a characteristic', function() {
            bluetoothService._bt.deviceState.connected = true;

            var params = {
                'serviceUuid' : '5678',
                'characteristicUuid' : '1234'
            };

            bluetoothService.subscribe(params).then(success, error, notify);

            $rootScope.$apply();

            //expect(notify).toHaveBeenCalledWith({ 'status' : 'subscribed', 'serviceUuid' : '5678', 'characteristicUuid' : '1234'});
        });

        it('should unsubscribe to a characteristic', function() {
            bluetoothService._bt.deviceState.connected = true;

            var params = {
                'serviceUuid' : '5678',
                'characteristicUuid' : '1234'
            };

            bluetoothService.unsubscribe(params).then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalledWith({ 'status' : 'unsubscribed', 'serviceUuid' : '5678', 'characteristicUuid' : '1234'});
        });

        it('should read a descriptor\'s value', function() {
            bluetoothService._bt.deviceState.connected = true;

            var params = {
                'serviceUuid' : '5678',
                'characteristicUuid' : '1234',
                'descriptorUuid' : '7890'
            };

            bluetoothService.readDescriptor(params).then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalledWith({ 'status' : 'readDescriptor', 'serviceUuid' : '5678', 'characteristicUuid' : '1234', 'descriptorUuid' : '7890', 'value' : 'abcd'});

        });

        it('should return the bluetooth device rssi (signal strength)', function() {
            bluetoothService._bt.deviceState.connected = true;

            bluetoothService.rssi().then(success);

            $rootScope.$apply();

            expect(success).toHaveBeenCalledWith({ 'status' : 'rssi', 'rssi' : -5 });

        });

    });
}());