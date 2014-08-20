'use strict';

(function() {
    describe('Car Service', function() {

        var Car;
        var car;
        var $rootScope, $q;
        var success, error, notify, bluetoothService, localStorage;

        beforeEach(function() {

            module('iasCar.services');

            window.mockCordovaBluetooth();

            inject(function ($injector) {
                Car = ($injector.get('Car'));
                $rootScope = ($injector.get('$rootScope'));
                $q = ($injector.get('$q'));
                bluetoothService = ($injector.get('bluetoothService'));
                localStorage = ($injector.get('storageService')).localStorage;
            });

            car = new Car('ab:cd:ef:12:34:56');

            success = jasmine.createSpy('success');
            error = jasmine.createSpy('error');
            notify = jasmine.createSpy('notify');

        });

        it('should throw an error if the address is not valid', function() {
            expect(function() {new Car('invalid');}).toThrow();
            expect(function() {new Car();}).toThrow();
        });

        it('should encode an integer to a 16-bit value', function() {
            //var value = 1000;

            //var encoded = car.encode16Bit(value);
            //var decoded = car.decode16Bit(encoded);
            //expect(decoded).toBe(value);
        });

        it('should write to characteristics of the bluetooth service', function() {

            spyOn(bluetoothService, 'write');

            car.write('drive', 'speedAndAngle', 'value');

            expect(bluetoothService.write).toHaveBeenCalledWith({
                serviceUuid : '5d5f0000-e670-11e3-a4f3-0002a5d5c51b',
                characteristicUuid : '5d5f0001-e670-11e3-a4f3-0002a5d5c51b',
                value : 'value'
            });

        });

        it('should read characteristics from the bluetoot service', function() {

            spyOn(bluetoothService, 'read');

            car.read('sensors', 'sensors');

            expect(bluetoothService.read).toHaveBeenCalledWith({
                serviceUuid : '5d5f0010-e670-11e3-a4f3-0002a5d5c51b',
                characteristicUuid : '5d5f0011-e670-11e3-a4f3-0002a5d5c51b'
            });

        });

        it('should read descriptors from the bluetoot service', function() {

            spyOn(bluetoothService, 'readDescriptor');

            car.readDescriptor('actuators', 'actuators', 'genericActuators');

            expect(bluetoothService.readDescriptor).toHaveBeenCalledWith({
                serviceUuid : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
                characteristicUuid : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                descriptorUuid : '5d5f00f0-e670-11e3-a4f3-0002a5d5c51b'
            });
        });

        it('should read the generic actor button descriptors from the bluetoot service', function() {

            var deferred = $q.defer();

            spyOn(bluetoothService, 'readDescriptor').andCallFake(function() {
                return deferred.promise;
            });

            car.readGenericActorButtonConfiguration();

            expect(bluetoothService.readDescriptor).toHaveBeenCalledWith({
                serviceUuid : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
                characteristicUuid : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                descriptorUuid : '5d5f00f0-e670-11e3-a4f3-0002a5d5c51b'
            });

            var result = {
                'status' : 'readDescriptor',
                'serviceUuid' : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
                'characteristicUuid' : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                'descriptorUuid' : '5d5f00f0-e670-11e3-a4f3-0002a5d5c51b',
                // Testing button behaviour AAE= AgA= AQA=
                'value' : 'AgE='
            };

            deferred.resolve(result);

            //// https://github.com/ariya/phantomjs/issues/11172
            //$rootScope.$apply();

            //expect(car.genericActorButtonSettings.generic1).toBe(1);
            //expect(car.genericActorButtonSettings.generic2).toBe(2);
        });

        it('should subscribe to a value', function() {

            spyOn(bluetoothService, 'subscribe');

            car.subscribe('distance', 'distance');

            expect(bluetoothService.subscribe).toHaveBeenCalledWith({
                serviceUuid : '5d5f0030-e670-11e3-a4f3-0002a5d5c51b',
                characteristicUuid : '5d5f0031-e670-11e3-a4f3-0002a5d5c51b'
            });
        });

        it('should encode the speed and angle into a 32Bit Integer value', function() {

            //expect(car.encodeSpeedAndAngle(750,750,750)).toBe('ASDASD');
        });

        it('can store its settings to the localstorage', function() {

            var that = this;
            that.store = {};

            spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
                var deferred = $q.defer();

                deferred.resolve(function() {
                    that.store[key] = value + '';
                });

                return deferred.promise;
            });

            car = new Car('ab:cd:ef:12:34:56');

            car.settings.steeringTrim = 10;

            car.storeSettings();

            expect(localStorage.setItem).toHaveBeenCalledWith('ab:cd:ef:12:34:56', '{"steeringTrim":10,"sensorServoTrim":0,"lockDistanceRotation":false,"expertMode":false}');

        });

        it('can restore its settings from the localstorage', function() {

            spyOn(localStorage, 'getItem').andCallFake(function () {
                var deferred = $q.defer();
                deferred.resolve('{"steeringTrim" : 10, "sensorServoTrim" : 2, "lockDistanceRotation" : true}');
                return deferred.promise;
            });

            car = new Car('ab:cd:ef:12:34:56');

            car.restoreSettings();

            $rootScope.$apply();

            expect(localStorage.getItem).toHaveBeenCalledWith('ab:cd:ef:12:34:56');
            expect(car.settings).toEqual({ steeringTrim : 10, sensorServoTrim : 2, lockDistanceRotation : true, expertMode : false });
        });

    });
}());