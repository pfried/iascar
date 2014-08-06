'use strict';

(function() {

    describe('The sensor servo to angle in radiant filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should calculate the right transformation from steering value to degree radiant', function() {
            var left = 500;
            var right = 1000;
            var center = 750;

            expect($filter('sensorServoToRad')(left)).toBe((215/180) * Math.PI);
            expect($filter('sensorServoToRad')(right)).toBe((325/180) * Math.PI);
            expect($filter('sensorServoToRad')(center)).toBe((3/2) * Math.PI);
        });

    });

}());