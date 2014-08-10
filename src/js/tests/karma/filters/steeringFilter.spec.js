'use strict';

(function() {

    describe('The steering filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should calculate the right transformation for the steering of the car from the joystick values', function() {
            var left = -100;
            var right = 100;
            var center = 0;

            var trim = 50;

            expect($filter('steering')(left, 0)).toBe(500);
            expect($filter('steering')(right, 0)).toBe(1000);
            expect($filter('steering')(center, 0)).toBe(750);

            // Trimming  to the max value
            expect($filter('steering')(center, trim)).toBe(800);
            expect($filter('steering')(right, trim)).toBe(1000);
            expect($filter('steering')(left, -trim)).toBe(500);
        });

    });

 }());