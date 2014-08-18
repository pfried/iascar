'use strict';

(function() {

    describe('The nordic semiconductor mac filter', function() {

        var $filter;

        beforeEach(function() {

            module('iasCar.filters');
            module('iasCar.services');

            inject(function (_$filter_) {
                $filter = _$filter_;
            });

        });

        it('should filter cars with invalid mac addresses', function() {

            var nordicSemiAddress = 'E4:47:3F:67:89:AB';
            var otherVendorAddress = '01:23:45:67:89:ab';

            var cars = [
                {
                    address : nordicSemiAddress
                },
                {
                    address : otherVendorAddress
                }
            ];

            expect($filter('nordicMac')(cars)).toEqual([{ address : nordicSemiAddress}]);
        });

    });

}());