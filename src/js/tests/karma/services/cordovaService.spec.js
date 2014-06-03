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
            window.mockCordova();
            expect(cordovaService.isAvailable()).toBe(true);
            delete window.cordova;
            expect(cordovaService.isAvailable()).toBe(false);
        });

    });
}());