'use strict';
angular.module('iasCarMock', ['iasCar', 'ngMockE2E']).run(['$httpBackend', function ($httpBackend) {

    // Pass through all dependencies
    $httpBackend.whenGET(/^partials\//).passThrough();
    $httpBackend.whenGET(/^lang\//).passThrough();

}]);