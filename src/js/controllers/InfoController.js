angular.module('iasCar').controller('InfoController', ['$scope', '$state', function($scope, $state) {
    'use strict';

    this.closeInfo = function() {
        $state.go('home');
    };

    $scope.closeInfo = this.closeInfo;

}]);