'use strict';
angular.module('iasCar.services').factory('Car', ['$rootScope', '$q', '$interval', '$timeout', '$filter', 'bluetoothService', 'bluetoothTools', function($rootScope, $q, $interval, $timeout, $filter, bluetoothService, bluetoothTools) {

    function Car(address) {

        if(address && bluetoothTools.isValidAddress(address)) {
            this.address = address;
            this.state = 'initializing';
            this.sensors = {
                brightness      : 0,
                battery         : 0,
                distanceIRFront : 500,
                distanceIRRear  : 3000,
                distanceUSFront : 65,
                distanceUSRear  : 40,
                temperature     : 0,
                signal          : 0
            };
            this.actors = {
                speed       : 750,
                angle       : 750,
                speedMode   : 0,
                sensorServo : 750,
                horn        : 0,
                lights      : {
                    front        : 0,
                    back         : 0,
                    brake        : 0,
                    blinkerLeft  : 0,
                    blinkerRight : 0
                },
                generic1    : 0,
                generic2    : 0
            };

            this.joystick = {
                x : 0,
                y : 0
            };

        } else {
            throw new Error('Car Address invalid');
        }
    }

    Car.prototype = {
        'services' : {
            'drive' : {
                'uuid' : '5d5f0000-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'speedAndAngle' : {
                        'uuid'   : '5d5f0001-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 6
                    }
                }
            },
            'actors' : {
                'uuid' : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'actors' : {
                        'uuid'   : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 6
                    }
                }
            },
            'distance' : {
                'uuid' : '5d5f0030-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'distance' : {
                        'uuid'   : '5d5f0031-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 8
                    }
                }
            },
            'sensors' : {
                'uuid' : '5d5f0010-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'sensors' : {
                        'uuid'   : '5d5f0011-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 6
                    }
                }
            }
        },
        encodeSpeedAndAngle : function(speed, angle, sensorServo) {
            var u16 = new Uint16Array([angle, speed, sensorServo]);
            var u8 = new Uint8Array(u16.buffer);
            return bluetoothService.bytesToEncodedString(u8);
        },
        encodeActors : function(horn, lights ,generic1, generic2) {
            var u16 = new Uint16Array([generic1, generic2]);
            var u8  = new Uint8Array(2);
            u8[0] = horn;

            u8[1] = 0x00;

            if(lights) {
                u8[1] |= (lights.front << 0);
                u8[1] |= (lights.back  << 1);
                u8[1] |= (lights.brake << 2);
                u8[1] |= (lights.blinkerLeft << 3);
                u8[1] |= (lights.blinkerRight << 4);
            }

            // buffer, offset, length
            var actor_values = new Uint8Array(u8, 0, 6);
            actor_values.set(u16.buffer, 2);
            return bluetoothService.bytesToEncodedString(actor_values);
        },
        decode16Bit : function(value) {
            var bytes = bluetoothService.encodedStringToBytes(value);
            var u16bytes = bytes.buffer.slice(0, 2);
            var u16 = new Uint16Array(u16bytes)[0];
            return u16;
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
                console.error(error);
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
            this.unsetDrivingControl();
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

            //console.log('Writing ', service, ': ', characteristic, ': ', value);

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

        subscribeActors : function() {
            var that = this;

            return that.subscribe('actors', 'actors').then(function() {

            }, function(error) {
                console.error(error);
            }, function(result) {
                if(result.status === 'subscribedResult') {

                    // Getting the bytes from the result
                    var bytes = bluetoothService.encodedStringToBytes(result.value);

                    var u16bytes = bytes.buffer.slice(2, 6);
                    var u16 = new Uint16Array(u16bytes);
                    var u8bytes = bytes.buffer.slice(0,2);
                    var u8 = new Uint8Array(u8bytes);

                    that.actors.generic1 = u16[0];
                    that.actors.generic2 = u16[1];

                    // We can just set horn as 0x01 will be 1
                    that.horn = u8[0];

                    var lights = u8[1];

                    // Get the single bits from the lights byte
                    that.actors.lights.front        = (lights & (1 << 0));
                    that.actors.lights.back         = (lights & (1 << 1));
                    that.actors.lights.brake        = (lights & (1 << 2));
                    that.actors.lights.blinkerLeft  = (lights & (1 << 3));
                    that.actors.lights.blinkerRight = (lights & (1 << 4));

                }
            });
        },

        subscribeDistance : function() {
            var that = this;

            return that.subscribe('distance', 'distance').then(function() {

            }, function(error) {
                console.error(error);
            }, function(result) {
                if(result.status === 'subscribedResult') {

                    // Getting the bytes from the result
                    var bytes = bluetoothService.encodedStringToBytes(result.value);
                    var u16bytes = bytes.buffer.slice(0, 8);
                    var u16 = new Uint16Array(u16bytes);

                    that.sensors.distanceIRFront = u16[0];
                    that.sensors.distanceIRRear  = u16[1];
                    that.sensors.distanceUSFront = u16[2];
                    that.sensors.distanceUSRear  = u16[3];

                }
            });
        },

        subscribeSpeedAndAngle : function() {
            var that = this;

            return that.subscribe('drive', 'speedAndAngle').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    // Getting the bytes from the result
                    var bytes = bluetoothService.encodedStringToBytes(result.value);
                    var u16bytes = bytes.buffer.slice(0, 6);
                    var u16 = new Uint16Array(u16bytes);

                    that.actors.speed       = u16[0];
                    that.actors.angle       = u16[1];
                    that.actors.sensorServo = u16[2];
                }
            });
        },

        subscribeSensors : function() {
            var that = this;

            return that.subscribe('sensors', 'sensors').then(function() {

            }, function () {

            }, function(result) {
                if(result.status === 'subscribedResult') {
                    // Getting the bytes from the result
                    var bytes = bluetoothService.encodedStringToBytes(result.value);
                    var u16bytes = bytes.buffer.slice(0, 6);
                    var u16 = new Uint16Array(u16bytes);

                    that.actors.brightness  = u16[0];
                    that.actors.temperature = u16[1];
                    that.actors.battery     = u16[2];
                }
            });
        },

        setSpeedAndAngle : function(speed, angle) {
            var servoAngle = $filter('steering')(angle);
            var servoSpeed = $filter('speed')(speed);
            var sensorServo = $filter('steering')(this.actors.sensorServo);
            var value = this.encodeSpeedAndAngle(servoSpeed, servoAngle, sensorServo);
            return this.write('drive', 'speedAndAngle', value);
        },

        setHorn : function(value) {
            var that = this;
            var char = value ? 1 : 0;
            that.actors.horn = char;
            return this.write('actors', 'actors', that.encodeActors(that.actors.horn, that.actors.lights, that.actors.generic1, that.actors.generic2 ));
        },

        // 7 Notifications possible in android 4.4?
        // Well the timeout is basically bullshit, but the android bt doesnt take the commands at once.
        subscribeToCar : function() {
            var that = this;
            that.subscribeDistance();
            $timeout(function() { that.subscribeSensors(); }, 200);
            $timeout(function() { that.subscribeActors(); }, 400);
            $timeout(function() { that.subscribeSpeedAndAngle(); }, 600);
        },

        setDrivingControl : function() {
            var that = this;

            var oldSpeed;
            var oldSteering;
            var oldSensorServo;

            that.drivingInterval = $interval(function() {
                // Check if values have changed
                if(oldSpeed !== that.joystick.y | oldSteering !== that.joystick.x | oldSensorServo !== that.actors.sensorServo) {
                    that.setSpeedAndAngle(that.joystick.y, that.joystick.x, that.actors.sensorServo);
                }
                oldSpeed = that.joystick.y;
                oldSteering = that.joystick.x;
                oldSensorServo = that.actors.sensorServo;
            }, 100);
        },

        unsetDrivingControl : function() {
            if(this.drivingInterval) {
                $interval.cancel(this.drivingInterval);
            }
        }

};

    return Car;
}]);