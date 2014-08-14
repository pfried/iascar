'use strict';
angular.module('iasCar.services').factory('Car', ['$rootScope', '$q', '$interval', '$timeout', '$filter', 'bluetoothService', 'bluetoothTools', 'storageService', function($rootScope, $q, $interval, $timeout, $filter, bluetoothService, bluetoothTools, storageService) {

    function Car(address) {

        if(address && bluetoothTools.isValidAddress(address)) {
            this.address = address;
            this.state = 'initializing';

            this.sensors = {
                brightness      : 10000,
                battery         : 7,
                distanceIRFront : 0,
                distanceIRRear  : 0,
                distanceUSFront : 0,
                distanceUSRear  : 0,
                temperature     : 100,
                signal          : 2,
            };
            this.actuators = {
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

            this.genericActorButtonSettings = {
                generic1 : 0,
                generic2 : 0
            };

            this.settings = {
                steeringTrim : 0,
                sensorServoTrim : 0,
                lockDistanceRotation : false
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
            'actuators' : {
                'uuid' : '5d5f0020-e670-11e3-a4f3-0002a5d5c51b',
                'characteristics' : {
                    'actuators' : {
                        'uuid'   : '5d5f0021-e670-11e3-a4f3-0002a5d5c51b',
                        'length' : 6,
                        'descriptors' : {
                            'genericActors' : {
                                'uuid' : '5d5f00f0-e670-11e3-a4f3-0002a5d5c51b',
                                'length' : 2
                            }
                        }
                    },
                },
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
        encodeActuators : function() {
            var that = this;

            var u16 = new Uint16Array([that.actuators.generic1, that.actuators.generic2]);
            var u82 = new Uint8Array(u16.buffer.slice(0,4));
            
            var u8  = new Uint8Array(2);
            u8[0] = that.actuators.horn;

            u8[1] = 0x00;

            u8[1] |= (that.actuators.lights.front << 0);
            u8[1] |= (that.actuators.lights.back  << 1);
            u8[1] |= (that.actuators.lights.brake << 2);
            u8[1] |= (that.actuators.lights.blinkerLeft << 3);
            u8[1] |= (that.actuators.lights.blinkerRight << 4);

            // buffer, offset, length
            var actuator_values = new Uint8Array(6);
            actuator_values.set(u8, 0);
            actuator_values.set(u82, 2);
            return bluetoothService.bytesToEncodedString(actuator_values);
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

            return bluetoothService.connect(params);
        },
        reconnect : function() {
            return bluetoothService.reconnect();
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
        readDescriptor : function(service, characteristic, descriptor) {
            //var that = this;

            var params = {
                'serviceUuid' : service,
                'characteristicUuid' : characteristic,
                'descriptorUuid' :  descriptor
            };

            return bluetoothService.readDescriptor(params);
        },
        readGenericActorButtonConfiguration : function() {
            var that = this;

            this.readDescriptor(
                that.services.actuators.uuid,
                that.services.actuators.characteristics.actuators.uuid,
                that.services.actuators.characteristics.actuators.descriptors.genericActors.uuid
            ).then(function(result) {
                    var bytes = bluetoothService.encodedStringToBytes(result.value);
                    var u8bytes = bytes.buffer.slice(0,4);
                    var u8 = new Uint8Array(u8bytes);

                    that.genericActorButtonSettings.generic1 = u8[0];
                    that.genericActorButtonSettings.generic2 = u8[1];

                }, function(error) {
                    console.log(error.message);
                }
            );
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

            return that.subscribe('actuators', 'actuators').then(function() {

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

                    that.actuators.generic1 = u16[0];
                    that.actuators.generic2 = u16[1];

                    // We can just set horn as 0x01 will be 1
                    //that.horn = u8[0];

                    var lights = u8[1];

                    // Get the single bits from the lights byte
                    that.actuators.lights.front        = (lights & (1 << 0)) ? 1 : 0;
                    that.actuators.lights.back         = (lights & (1 << 1)) ? 1 : 0;
                    that.actuators.lights.brake        = (lights & (1 << 2)) ? 1 : 0;
                    that.actuators.lights.blinkerLeft  = (lights & (1 << 3)) ? 1 : 0;
                    that.actuators.lights.blinkerRight = (lights & (1 << 4)) ? 1 : 0;

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
                    that.actuators.speed       = u16[0];
                    that.actuators.angle       = u16[1];
                    that.actuators.sensorServo = u16[2];
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

                    that.sensors.brightness  = u16[0];
                    that.sensors.temperature = u16[1];
                    that.sensors.battery     = u16[2];
                }
            });
        },

        setSpeedAndAngle : function(speed, angle) {
            var servoAngle = $filter('steering')(angle, this.settings.steeringTrim);
            var servoSpeed = $filter('speed')(speed);
            var sensorServo = $filter('steering')(this.actuators.sensorServo, this.settings.sensorServoTrim);
            var value = this.encodeSpeedAndAngle(servoSpeed, servoAngle, sensorServo);
            return this.write('drive', 'speedAndAngle', value);
        },

        setHorn : function(value) {
            var that = this;
            var char = value ? 1 : 0;
            that.actuators.horn = char;
            return that.write('actuators', 'actuators', that.encodeActuators());
        },

        setGenericActor : function(number, value) {
            var that = this;

            if(number === '1') {
                that.actuators.generic1 = value;
            }
            if(number === '2') {
                that.actuators.generic2 = value;
            }

            return that.write('actuators', 'actuators', that.encodeActuators());
        },

        getGenericActor : function(number) {
            var that = this;

            if(number === '1') {
                return that.actuators.generic1;
            }
            if(number === '2') {
                return that.actuators.generic2;
            }
        },

        // 7 Notifications possible in android 4.4?
        // Well the timeout is basically bullshit, but the android bt doesnt take the commands at once.
        subscribeToCar : function() {
            var that = this;
            var deferred = $q.defer();

            // Read the desriptors configuration
            that.readGenericActorButtonConfiguration();

            $timeout(function() { that.subscribeDistance(); }, 400);
            $timeout(function() { that.subscribeSensors(); }, 600);
            $timeout(function() { that.subscribeActors(); }, 800);
            $timeout(function() { that.subscribeSpeedAndAngle(); }, 1000);

            $timeout(function() { deferred.resolve(); }, 1200);

            return deferred.promise;
        },

        setDrivingControl : function() {
            var that = this;

            var oldSpeed;
            var oldSteering;
            var oldSensorServo;
            var oldSteeringTrim;
            var oldSensorServoTrim;

            that.drivingInterval = $interval(function() {
                // Check if values have changed
                if(oldSpeed !== that.joystick.y | oldSteering !== that.joystick.x | oldSensorServo !== that.actuators.sensorServo | oldSteeringTrim !== that.settings.steeringTrim | oldSensorServoTrim !== that.settings.sensorServoTrim) {
                    that.setSpeedAndAngle(that.joystick.y, that.joystick.x, that.actuators.sensorServo);
                }
                oldSpeed = that.joystick.y;
                oldSteering = that.joystick.x;
                oldSensorServo = that.actuators.sensorServo;
                oldSteeringTrim = that.settings.steeringTrim;
                oldSensorServoTrim = that.settings.sensorServoTrim;

             // 150 works pretty well
            }, 175);

            // Checking for the signal strength
            that.rssiInterval = $interval(function() {
                bluetoothService.rssi().then(function(result) {
                    if(result.status === 'rssi' && result.rssi) {
                        that.sensors.signal = result.rssi;
                    }
                });
            }, 1000);
        },

        unsetDrivingControl : function() {
            if(this.drivingInterval) {
                $interval.cancel(this.drivingInterval);
                $interval.cancel(this.rssiInterval);
            }
        },

        // Save this car's settings to the storage
        storeSettings : function() {
            var that = this;

            var settings = that.settings;

            storageService.localStorage.setItem(that.address, JSON.stringify(settings));
        },

        // Retrieve settings from the storage
        restoreSettings : function() {
            var that = this;
            var data = storageService.localStorage.getItem(that.address);
            if(data) {
                data = JSON.parse(data);
                for (var key in data) {
                    that.settings[key] = data[key];
                }
            }
        }

    };

    return Car;
}]);
