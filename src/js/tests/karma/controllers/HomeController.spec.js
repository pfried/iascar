'use strict';

(function() {
    describe('Home Controller', function () {

        var infoController, $state, scope;

        beforeEach(function () {

            module('iasCar');

            inject(function ($injector, $controller, $rootScope) {

                $state = ($injector.get('$state'));
                scope = $rootScope.$new();

                infoController = $controller('HomeController', {
                    $scope : scope,
                    $state : $state
                });

            });

        });

        it('should go to the info state', function() {

            spyOn($state, 'go');

            scope.goToInfo();

            expect($state.go).toHaveBeenCalledWith('info');
        });

    });

}());