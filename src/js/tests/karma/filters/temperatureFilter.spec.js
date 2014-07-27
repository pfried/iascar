'use strict';

(function() {

    describe('The temperature filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should calculate the right transformation for the temperature sensor to degrees celcius', function() {
            var temperatureSensor = 103;

            expect($filter('temperatureCelcius')(temperatureSensor)).toBe(25.75);
        });

    });

}());