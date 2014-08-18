'use strict';

(function() {

    describe('The signal strength filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should translate a rssi into a number from 1-4 for the signal strength indication', function() {
            var rssiOne = -100;
            var rssiTwo = -70;
            var rssiThree = -55;
            var rssiFour = -30;
            var rssiDefault = -1000;

            expect($filter('signalStrength')(rssiOne)).toBe(1);
            expect($filter('signalStrength')(rssiTwo)).toBe(2);
            expect($filter('signalStrength')(rssiThree)).toBe(3);
            expect($filter('signalStrength')(rssiFour)).toBe(4);
            expect($filter('signalStrength')(rssiDefault)).toBe(1);
        });

    });

}());