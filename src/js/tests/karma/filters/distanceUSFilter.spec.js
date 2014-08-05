'use strict';

(function() {

    describe('The ultrasonic distance filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should a value between 0 and 6 indicating the distance from 0 near to 6 far', function() {
            var farAway = 61;
            var close = 6;

            expect($filter('distanceUS')(farAway)).toBe(6);
            expect($filter('distanceUS')(close)).toBe(1);
        });

    });

}());