'use strict';

(function() {
    describe('Cordova Service', function() {

        var cordovaService;

        beforeEach(function() {

            module('iasCar.services');

            inject(function ($injector) {
                cordovaService = ($injector.get('cordovaService'));
            });
        });

        it('should detect whether cordova is present or not', function() {
            expect(cordovaService.isAvailable()).toBe(false);
            window.cordova = true;
            expect(cordovaService.isAvailable()).toBe(true);
        });
    });
}());