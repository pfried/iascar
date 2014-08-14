angular.module('iasCar').controller('InfoController', ['$scope', '$state', function($scope, $state) {
    'use strict';

    $scope.closeInfo = function() {
        $state.go('home');
    };

}]);