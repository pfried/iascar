'use strict';
angular.module('iasCar.services').factory('Car', ['$q', 'bluetoothService', function($q, bluetoothService) {

    function Car(address) {
        if(address) {
            this.address = address;
            this.state = 'initializing';
            this.sensors = {
                brightness      : 0,
                battery         : 0,
                distanceIRFront : 0,
                distanceIRRear  : 0,
                distanceUSFront : 0,
                distanceUSRear  : 0,
                temperature     : 0
            };
            this.actors = {
                speed       : 0,
                angle       : 0,
                speedMode   : 0,
                sensorServo : 0,
                horn        : 0,
                lights      : 0,
                generic1    : 0,
                generic2    : 0
            };
        }
    }

    Car.prototype = {
        'services' : {
            'drive' : {
                'uuid' : '5d5f0000-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'speedAndAngle' : {
                        'uuid'   : '5d5f0001-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 4
                    },
                    'speedMode' : {
                        'uuid'   : '5d5f0002-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 1
                    }
                }
            },
            'horn' : {
                'uuid' : '5d5f0010-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'horn' : {
                        'uuid'   : '5d5f0011-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 1
                    }
                }
            },
            'lights' : {
                'uuid' : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'lights' : {
                        'uuid'   : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 1
                    }
                }
            },
            'battery' : {
                'uuid' : '5d5f0030-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'battery' : {
                        'uuid'   : '5d5f0031-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    }
                }
            },
            'distance' : {
                'uuid' : '5d5f0040-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'distanceUSFront' : {
                        'uuid'   : '5d5f0041-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    },
                    'distanceUSRear' : {
                        'uuid'   : '5d5f0042-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    },
                    'distanceIRFront' : {
                        'uuid'   : '5d5f0043-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    },
                    'distanceIRRear' : {
                        'uuid'   : '5d5f0044-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    },
                    'sensorServo' : {
                        'uuid'   : '5d5f0045-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    }
                }
            },
            'brightness' : {
                'uuid' : '5d5f0050-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'brightness' : {
                        'uuid'   : '5d5f0051-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    }
                }
            },
            'generic' : {
                'uuid' : '5d5f0070-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'genericActor1' : {
                        'uuid'   : '5d5f0071-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    },
                    'genericActor2' : {
                        'uuid'   : '5d5f0072-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    }
                }
            },
            'temperature' : {
                'uuid' : '5d5f0090-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'temperature' : {
                        'uuid'   : '5d5f0091-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 2
                    }
                }
            }
        },
        connect : function() {

            var that = this;

            var params = {
                address : that.address
            };

            return bluetoothService.connect(params).then(function() {

                // If this is called the promise is fullfilled and we are disconnected
                that.state = 'disconnected';

            }, function (error) {
                that.state = 'error';
                console.error(error.message);
            }, function(result) {
                if(result) {

                    if(result.status === 'connecting') {
                        that.state = 'cc connecting';
                    }

                    if(result.status === 'connected') {
                        that.state = 'connected';
                        that.name = result.name;
                    }

                    if(result.status === 'disconnecting') {
                        that.state = 'disconnecting';
                    }
                }
            });
        },
        disconnect :  function () {
            return bluetoothService.disconnect();
        },
        discover : function() {
            var that = this;

            return bluetoothService.discover().then(function(result) {
                that.name = result.name;
                // We do not take the result from the discover since we already know everything about the car
                //that.services = result.services;
            });
        },
        read : function(service, characteristic) {
            var that = this;

            var params = {
                serviceUuid: that.services[service].uuid,
                characteristicUuid: that.services[service].characteristics[characteristic].uuid
            };

            return bluetoothService.read(params);
        },
        write : function(service, characteristic, value) {
           var that = this;

            var params = {
                serviceUuid: that.services[service].uuid,
                characteristicUuid: that.services[service].characteristics[characteristic].uuid,
                value : value
            };

            return bluetoothService.write(params);
        },
        subscribe : function(service, characteristic) {
            var that = this;

            var params = {
                serviceUuid: that.services[service].uuid,
                characteristicUuid: that.services[service].characteristics[characteristic].uuid
            };

            return bluetoothService.subscribe(params);
        },
        unsubscribe : function(service, characteristic) {
            var that = this;

            var params = {
                serviceUuid: that.services[service].uuid,
                characteristicUuid: that.services[service].characteristics[characteristic].uuid
            };

            return bluetoothService.unsubscribe(params);
        },
        subscribeTemperature : function() {
            var that = this;

            that.subscribe('temperature', 'temperature').then(function() {

            }, function () {

            }, function(result) {
                 if(result.status === 'subscribedResult') {
                     that.sensors.temperature = bluetoothService.encodedStringToBytes(result.value)[0];
                 }
             });
        }

};

    return Car;
}]);