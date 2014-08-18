'use strict';

(function() {

    describe('The infrared distance filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should a value between 0 and 6 indicating the distance from 0 near to 6 far', function() {
            var farAway = 4000;
            var farAway1 = 2600;
            var farAway2 = 2100;
            var middle = 1600;
            var close = 1200;
            var standard = 0;

            expect($filter('distanceIR')(farAway)).toBe(1);
            expect($filter('distanceIR')(farAway1)).toBe(2);
            expect($filter('distanceIR')(farAway2)).toBe(3);
            expect($filter('distanceIR')(middle)).toBe(4);
            expect($filter('distanceIR')(close)).toBe(5);
            expect($filter('distanceIR')(standard)).toBe(6);
        });

    });

}());