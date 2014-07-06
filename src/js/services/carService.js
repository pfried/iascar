'use strict';
angular.module('iasCar.services').factory('Car', ['$q', 'bluetoothService', function($q, bluetoothService) {


    function Car(address) {
        this.address = address;
        this.state = 'initializing';
    }

    Car.prototype = {
        connect : function() {

            var scope = this;

            var params = {
                address : scope.address
            };

            return bluetoothService.connect(params).then(function() {

                // If this is called the promise is fullfilled and we are disconnected
                scope.state = 'disconnected';

            }, function (error) {
                scope.state = 'error';
                console.error(error.message);
            }, function(result) {
                if(result) {

                    if(result.status === 'connecting') {
                        scope.state = 'cc connecting';
                    }

                    if(result.status === 'connected') {
                        scope.state = 'connected';
                        scope.name = result.name;
                        scope.rssi = result.rssi;
                        console.log(scope);
                    }

                    if(result.status === 'disconnecting') {
                        scope.state = 'disconnecting';
                    }
                }
            });
        },
        disconnect :  function () {
            return bluetoothService.disconnect();
        }

    };

    return Car;
}]);