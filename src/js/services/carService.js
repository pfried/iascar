'use strict';
angular.module('iasCar.services').factory('Car', ['$q', 'bluetoothService', function($q, bluetoothService) {

    var services = {
        'drive' : {
            'uuid' : '5d5f0000-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'SpeedAndAngle' : {
                    'uuid'   : '5d5f0001-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 4
                },
                'SpeedMode' : {
                    'uuid'   : '5d5f0002-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 1
                }
            }
        },
        'horn' : {
            'uuid' : '5d5f0010-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'Horn' : {
                    'uuid'   : '5d5f0011-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 1
                }
            }
        },
        'lights' : {
            'uuid' : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'Lights' : {
                    'uuid'   : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 1
                }
            }
        },
        'battery' : {
            'uuid' : '5d5f0030-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'Battery' : {
                    'uuid'   : '5d5f0031-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                }
            }
        },
        'distance' : {
            'uuid' : '5d5f0040-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'DistanceUSFront' : {
                    'uuid'   : '5d5f0041-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                },
                'DistanceUSRear' : {
                    'uuid'   : '5d5f0042-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                },
                'DistanceIRFront' : {
                    'uuid'   : '5d5f0043-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                },
                'DistanceIRRear' : {
                    'uuid'   : '5d5f0044-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                },
                'SensorServo' : {
                    'uuid'   : '5d5f0045-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                }
            }
        },
        'brightness' : {
            'uuid' : '5d5f0050-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'Brightness' : {
                    'uuid'   : '5d5f0051-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                }
            }
        },
        'generic' : {
            'uuid' : '5d5f0070-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'GenericActor1' : {
                    'uuid'   : '5d5f0071-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                },
                'GenericActor2' : {
                    'uuid'   : '5d5f0072-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                }
            }
        },
        'temperature' : {
            'uuid' : '5d5f0090-e670-11e3-a4f3-0002a5d5c51b',
            'characteristics' : {
                'Temperature' : {
                    'uuid'   : '5d5f0091-e670-11e3-a4f3-0002a5d5c51b',
                    'length' : 2
                }
            }
        }
    };

    window.console.log(services);

    function Car(address) {
        if(address) {
            this.address = address;
            this.state = 'initializing';
        }
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
                    }

                    if(result.status === 'disconnecting') {
                        scope.state = 'disconnecting';
                    }
                }
            });
        },
        disconnect :  function () {
            return bluetoothService.disconnect();
        },
        discover : function() {
            var scope = this;
            bluetoothService.discover().then(function(result) {
                scope.name = result.name;
                scope.services = result.services;
            });
        }

    };

    return Car;
}]);