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
            var middle = 4;
            var near = 1;
            var zero = 0;

            var green = '#0a8f08';
            var orange = '#fb8c00';
            var red = '#dd191d';

            expect($filter('distanceColor')(farAway)).toBe(green);
            expect($filter('distanceColor')(middle)).toBe(orange);
            expect($filter('distanceColor')(near)).toBe(red);
            expect($filter('distanceColor')(zero)).toBe(green);
        });

    });

}());