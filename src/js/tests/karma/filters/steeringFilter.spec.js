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

            expect($filter('steering')(left)).toBe(500);
            expect($filter('steering')(right)).toBe(1000);
            expect($filter('steering')(center)).toBe(750);
        });

    });

 }());