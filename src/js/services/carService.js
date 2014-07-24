'use strict';
angular.module('iasCar.services').factory('Car', ['$rootScope', '$q', 'bluetoothService', function($rootScope, $q, bluetoothService) {

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
                lights      : {
                    front        : 0,
                    back         : 0,
                    blinkerLeft  : 0,
                    blinkerRight : 0
                },
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
            return bluetoothService.disconnect().then(bluetoothService.close);
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
                value : bluetoothService.bytesToEncodedString(value)
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
            return this.subscribeTo16BitValue('temperature', 'temperature', 'sensors.temperature');
        },

        subscribeBrightness : function() {
            return this.subscribeTo16BitValue('brightness', 'brightness', 'sensors.brightness');
        },

        subscribeBattery : function() {
            return this.subscribeTo16BitValue('battery', 'battery', 'sensors.battery');
        },

        subscribeDistanceUSFront : function() {
            return this.subscribeTo16BitValue('distance', 'distanceUSFront', 'sensors.distanceUSFront');
        },

        subscribeDistanceUSRear : function() {
            return this.subscribeTo16BitValue('distance', 'distanceUSRear', 'sensors.distanceUSRear');
        },

        subscribeDistanceIRFront : function() {
            return this.subscribeTo16BitValue('distance', 'distanceIRFront', 'sensors.distanceIRFront');
        },

        subscribeDistanceIRRear : function() {
            return this.subscribeTo16BitValue('distance', 'distanceIRRear', 'sensors.distanceIRRear');
        },

        subscribeSpeedAndAngle : function() {
            var that = this;

            return that.subscribe('drive', 'speedAndAngle').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    that.actors.speed = bluetoothService.encodedStringToBytes(result.value)[1];
                    that.actors.angle = bluetoothService.encodedStringToBytes(result.value)[0];
                }
            });
        },

        subscribeSpeedMode : function() {
            var that = this;

            return that.subscribe('drive', 'speedMode').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    that.actors.speedMode = bluetoothService.encodedStringToBytes(result.value)[0];
                }
            });
        },

        subscribeSensorServo : function() {
            var that = this;

            return that.subscribe('distance', 'sensorServo').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    that.actors.sensorServo = bluetoothService.encodedStringToBytes(result.value)[0];
                }
            });
        },

        subscribeHorn : function() {
            var that = this;

            return that.subscribe('horn', 'horn').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    that.actors.horn = bluetoothService.encodedStringToBytes(result.value)[0];
                }
            });
        },

        setHorn : function(value) {
            var that = this;

            var values = [value];

            if(value) {
                return that.write('horn', 'horn', values);
            } else {
                return that.write('horn', 'horn', values);
            }
        },

        subscribeLights : function() {
            var that = this;

            return that.subscribe('lights', 'lights').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    that.actors.lights = bluetoothService.encodedStringToBytes(result.value)[0];
                }
            });
        },

        subscribeGeneric1 : function() {
            return this.subscribeTo16BitValue('generic', 'generic1', 'actors.generic1');
        },

        subscribeGeneric2 : function() {
            return this.subscribeTo16BitValue('generic', 'generic2', 'actors.generic2');
        },

        subscribeTo16BitValue : function(service, characteristic, carProperty) {
            var that = this;

            return that.subscribe(service, characteristic).then(function() {

            }, function(error) {
                console.error(error);
            }, function(result) {
                if(result.status === 'subscribedResult') {
                    // Well not really 16bit, simply take the number from the dataview
                    that.setProperty(carProperty, bluetoothService.encodedStringToBytes(result.value)[0]);
                }
            });
        },

        // Set a property based on a property string
        setProperty : function(property, value) {
            var that = this,
                parts = property.split('.'),
                last = parts.pop(),
                l = parts.length,
                i = 1,
                current = parts[0];

            while((that = that[current]) && i < l) {
                current = parts[i];
                i++;
            }

            that[last] = value;
        },

        // 7 Notifications possible in android 4.4?
        subscribeToSensorValues : function() {
            var that = this;
            that.subscribeTemperature();
            that.subscribeBattery();
            that.subscribeBrightness();
            that.subscribeDistanceUSFront();
            that.subscribeDistanceUSRear();
            that.subscribeDistanceIRFront();
            that.subscribeDistanceIRRear();
        },

        subscribeToActorValues : function() {
            var that = this;
            that.subscribeSpeedAndAngle();
            that.subscribeSpeedMode();
            that.subscribeSensorServo();
            that.subscribeHorn();
            that.subscribeLights();
            that.subscribeGeneric1();
            that.subscribeGeneric2();
        }

};

    return Car;
}]);