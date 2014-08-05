'use strict';

(function() {
    describe('Car Service', function() {

        var Car;
        var car;
        var $rootScope;
        var success, error, notify;

        beforeEach(function() {

            module('iasCar.services');

            window.mockCordovaBluetooth();

            inject(function ($injector) {
                Car = ($injector.get('Car'));
                $rootScope = ($injector.get('$rootScope'));
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

        it('should encode the speed and angle into a 32Bit Integer value', function() {

        });

    });
}());