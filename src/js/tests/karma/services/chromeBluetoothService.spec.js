'use strict';

(function() {
    describe('Chrome Bluetooth Service', function() {

        var bluetoothService;
        var $rootScope;
        var success, error, notify;

        beforeEach(function() {

            module('iasCar.services');

            window.mockChromeBluetooth();

            inject(function ($injector) {
                bluetoothService = ($injector.get('cordovaBluetoothService'));
                $rootScope = ($injector.get('$rootScope'));
            });

            success = jasmine.createSpy('success');
            error = jasmine.createSpy('error');
            notify = jasmine.createSpy('notify');
        });


    });
}());