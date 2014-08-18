'use strict';

(function() {

    describe('The speed filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should calculate the right transformation for the steering of the car from the joystick values', function() {
            var forward = 100;
            var backwards = -100;
            var center = 0;

            expect($filter('speed')(forward)).toBe(500);
            expect($filter('speed')(backwards)).toBe(1000);
            expect($filter('speed')(center)).toBe(750);
        });

    });

}());