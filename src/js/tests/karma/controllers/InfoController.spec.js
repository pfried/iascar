'use strict';

(function() {
    describe('Info Controller', function () {

        var infoController, $state, scope;

        beforeEach(function () {

            module('iasCar');

            inject(function ($injector, $controller, $rootScope) {

                $state = ($injector.get('$state'));
                scope = $rootScope.$new();

                infoController = $controller('InfoController', {
                    $scope : scope,
                    $state : $state
                });

            });

        });

        it('should return to the home state if the page is closed', function() {

            spyOn($state, 'go');

            infoController.closeInfo();

            expect($state.go).toHaveBeenCalledWith('home');
        });

    });

}());