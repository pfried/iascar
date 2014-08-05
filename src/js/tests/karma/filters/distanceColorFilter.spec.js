'use strict';

(function() {

    describe('The distance color filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should return a color for each distance value', function() {
            var farAway = 6;
            var near = 1;
            var zero = 0;

            expect($filter('distanceColor')(farAway)).toBe('green');
            expect($filter('distanceColor')(near)).toBe('red');
            expect($filter('distanceColor')(zero)).toBe('green');
        });

    });

}());