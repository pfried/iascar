/* jshint unused:false */
/**
 * @author Friedrich Mäckle, Rand Dusing
 * This file contains code from https://github.com/randdusing Rand Dusing released under the Apache2 licence
 */
'use strict';
angular.module('iasCarMock', ['iasCar', 'ngMockE2E']).run(['$httpBackend', '$window', function ($httpBackend, $window) {

    // Pass through all dependencies
    $httpBackend.whenGET(/^partials\//).passThrough();
    $httpBackend.whenGET(/^directives\//).passThrough();
    $httpBackend.whenGET(/^lang\//).passThrough();

    function CordovaBluetoothMock() {
        // State machine
        this.deviceState = {
            initialized : false,
            connected   : false,
            discovered  : false,
            scanning    : false
        };

        this.OS = 'android';
        this.expectedErrors = [];
    }

    CordovaBluetoothMock.prototype = {

        errorMessages : {
            'default' : 'Default error message',
            'initialize' : {
                'notEnabled' : 'Bluetooth not enabled',
                'notEnabledUser' : 'Bluetooth not enabled by user',
                'notSupported' : 'Hardware doesn\'t support Bluetooth LE',
                'notInit' : 'Bluetooth not initialized'
            },
            'startScan' : {
                'alreadyScanning' : 'Scanning already in progress',
                'scanStartFail' : 'Scan failed to start',
                'notScanning' : 'Not scanning'
            },
            'connect' : {
                'previouslyConnected' : 'Device previously connected, reconnect or close for new device',
                'neverConnected' : 'Never connected to device',
                'isNotConnected' : 'Device isn\'t connected',
                'isNotDisconnected' : 'Device isn\'t disconnected',
                'isDisconnected' : 'Device is disconnected',
                'noAddress' : 'No device address',
                'noDevice' : 'Device not found',
                'reconnectFail' : 'Reconnection to device failed'
            },
            'discover' : {
                'alreadyDiscovering' : 'Already discovering device',
                'discoveryFail' : 'Unable to discover service'
            },
            'readWrite' : {
                'noArgument' : 'Argument object not found',
                'noService' : 'Service not found',
                'noCharacteristic' : 'Characteristic not found',
                'noDescriptor' : 'Descriptor not found',
                'readFail' : 'Unable to read',
                'readFailReturn' : 'Unable to read on return',
                'subscribeFail' : 'Unable to subscribe',
                'unsubscribeFail' : 'Unable to unsubscribe',
                'writeFail' : 'Unable to write',
                'writeReturnFail' : 'Unable to write on return',
                'writeValueNotFound' : 'Write value not found',
                'writeValueNotSet' : 'Write value not set',
                'readDescriptorFail' : 'Unable to read descriptor',
                'readDescriptorFailReturn' : 'Unable to read descriptor on return',
                'writeDescriptorNotAllowed' : 'Unable to write client configuration descriptor',
                'writeDescriptorFail' : 'Unable to write descriptor',
                'writeDescriptorValueNotFound' : 'Write descriptor value not found',
                'writeDescriptorValueNotSet' : 'Write descriptor value not set',
                'writeDescriptorFailReturn' : 'Descript not written on return',
                'rssiFail' : 'Unable to read RSSI',
                'rssiFailReturn' : 'Unable to read RSSI on return'
            }
        },

        /**
         * Get a random integer number for simulating rssi
         * @param min
         * @param max
         * @returns {*}
         */
        getRandomInt : function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        /**
         * Add an event error to the expected errors
         * @param event The event/action we are expecting an error for
         * @param errorMessage The error message to expect, errorMessages contains a set of messages that can be used.
         */
        addError : function addError(event, errorMessage) {
            // Add the error, event is key, if no array yet, create one and push message in
            var message = errorMessage ? errorMessage : this.errorMessages.default;
            (this.expectedErrors[event] = this.expectedErrors[event] ? this.expectedErrors[event] : []).push(errorMessage);
        },

        /**
         * Returns whether we are expecting an error for a special event
         * @param status The event
         * @returns {boolean} Returns whether we expect an error for that event
         */
        expectingError : function expectingError(event) {
            return this.expectedErrors.hasOwnProperty(event) && this.expectedErrors[event].length > 0;
        },

        /**
         * Produces an error and passes it to the callback
         * @param errorCallback The error callback which will be called with the error
         * @param event The event we are creating an error for
         */
        produceError : function produceError(errorCallback, event) {

            // Taking the first error message in the array
            errorCallback({
                'status'  : event,
                'message' : this.expectedErrors[event].shift()
            });
        },

        /**
         * Initialize Bluetooth on the device. Must be called before anything else. If Bluetooth is disabled, the user will be prompted to enable it on Android devices. Note: Although Bluetooth initialization could initially be successful, there's no guarantee whether it will stay enabled. Each call checks whether Bluetooth is disabled. If it becomes disabled, the user must reinitialize Bluetooth, connect to the device, start a read/write operation, etc.
         * @param successCallback
         * @param errorCallback
         */
        initialize : function initialize(successCallback, errorCallback, params) {

            var result = {
                'status' : 'initialized'
            };

            if(!this.expectingError('initialize')) {
                this.deviceState.initialized = true;
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'initialize');
            }

        },

        /**
         * Scan for Bluetooth LE devices. Since scanning is expensive, stop as soon as possible. The Phonegap app should use a timer to limit the scan interval.
         * @param successCallback
         * @param errorCallback
         */
        startScan : function startScan(successCallback, errorCallback, params) {
            var callback = successCallback;

            var resultAndroid = {
                'status': 'scanResult',
                'address': '01:23:45:67:89:AB',
                'name': 'IASCar1',
                'rssi': -50
            };

            var resultIOS = {
                'status'  : 'scanResult',
                'address' : '123234',
                'name'    : 'IASCar1',
                'rssi'    : -50
            };

            var resultStartScan = {
                'status' : 'scanStarted'
            };

            if(!this.expectingError('startScan')) {

                successCallback(resultStartScan);
                this.deviceState.scanning = true;
                var that = this;

                // We dont use $interval here since the real thin will happen outside of angularjs as well
                // this is not the object within the window scope
                this.interval = window.setInterval(function() {

                    if(that.OS === 'android') {
                        resultAndroid.rssi = -50 - that.getRandomInt(0,20);
                        callback(resultAndroid);
                    }
                    if(that.OS === 'ios') {
                        resultIOS.rssi = -50 - that.getRandomInt(0,20);
                        callback(resultIOS);
                    }
                }, 1000);

            } else {
                this.produceError(errorCallback, 'startScan');
            }
        },

        /**
         * Stop scan for Bluetooth LE devices. Since scanning is expensive, stop as soon as possible. The Phonegap app should use a timer to limit the scanning time.
         * @param successCallback
         * @param successCallback
         * @param errorCallback
         */
        stopScan : function stopScan(successCallback, errorCallback) {

            if(!this.expectingError('stopScan')) {
                window.clearInterval(this.interval);
                this.deviceState.scanning = false;
                successCallback({
                    'status': 'scanStopped'
                });
            } else {
                this.produceError(errorCallback, 'stopScan');
            }

        },

        /**
         * Connect to a Bluetooth LE device. The Phonegap app should use a timer to limit the connecting time in case connecting is never successful. Once a device is connected, it may disconnect without user intervention. The original connection callback will be called again and receive an object with status => disconnected. To reconnect to the device, use the reconnect method. Before connecting to a new device, the current device must be disconnected and closed. If a timeout occurs, the connection attempt should be canceled using disconnect().
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        connect : function connect(successCallback, errorCallback, params) {

            var that = this;

            if(!params || !params.address) {
                return errorCallback({
                    'status' : 'connecting',
                    'message': this.errorMessages.connect.noAddress
                });
            }

            if(this.deviceState.connected) {
                return errorCallback({
                    'status' : 'connecting',
                    'message': this.errorMessages.connect.previouslyConnected
                });
            }

            var resultConnected = {
                'status'  : 'connected',
                'address' : params.address,
                'name'    : 'iasCar1'
            };

            var resultConnecting = {
                'status'  : 'connecting',
                'address' : params.address,
                'name'    : 'iasCar1'
            };

            if(!this.expectingError('connect')) {
                window.setTimeout(function() {
                    successCallback(resultConnecting);
                }, 200);
                window.setTimeout(function() {
                    that.deviceState.connected = true;
                    successCallback(resultConnected);
                }, 2000);
            } else {
                this.produceError(errorCallback, 'connect');
            }
        },

        /**
         * Reconnect to a previously connected Bluetooth device. The Phonegap app should use a timer to limit the connecting time. If a timeout occurs, the reconnection attempt should be canceled using disconnect().
         * @param successCallback
         * @param errorCallback
         */
        reconnect : function reconnect(successCallback, errorCallback) {

            var resultConnected = {
                'status'  : 'connected',
                'address' : '01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            if(!this.expectingError('reconnect')) {
                this.deviceState.connected = true;
                successCallback(resultConnected);
            } else {
                this.produceError(errorCallback, 'reconnect');
            }
        },

        /**
         * Disconnect from a Bluetooth LE device.
         * @param successCallback
         * @param errorCallback
         */
        disconnect : function disconnect(successCallback, errorCallback) {

            if(!this.deviceState.connected) {
                return errorCallback({
                    'status' : 'connecting',
                    'message': this.errorMessages.connect.isNotConnected
                });
            }

            var resultDisconnecting = {
                'status'  : 'disconnecting',
                'address' : '01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            var resultDisconnected = {
                'status'  : 'disconnected',
                'address' : '01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            if(!this.expectingError('disconnect')) {
                this.deviceState.connected = false;
                successCallback(resultDisconnected);
            } else {
                this.produceError(errorCallback, 'disconnect');
            }
        },

        /**
         * Close/dispose a Bluetooth LE device. Must disconnect before closing.
         * @param successCallback
         * @param errorCallback
         */
        close : function close(successCallback, errorCallback) {
            var result = {
                'status'  : 'closed',
                'address' :'01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            if(!this.expectingError('close')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'close');
            }
        },

        /**
         * Discover all the devices services, characteristics and descriptors. Doesn't need to be called again after disconnecting and then reconnecting. Android support only. Calling on iOS will return void.
         * @param successCallback
         * @param errorCallback
         */
        discover : function discover(successCallback, errorCallback) {

            var result = {
                'address':'01:23:45:67:89:AB',
                'name':'iasCar1',
                'status' : 'discovered',
                'services':[
                    {
                        'serviceUuid':'180d',
                        'characteristics' : [
                            {
                                'characteristicUuid':'2a37',
                                'descriptors':[
                                    {
                                        'descriptorUuid':'2902'
                                    }
                                ]
                            },
                            {
                                'characteristicUuid':'2a38',
                                'descriptors':[]
                            }
                        ]
                    }
                ]
            };

            if(!this.expectingError('discover')) {
                if(this.OS === 'ios') {
                    return successCallback(void(0));
                }
                this.deviceState.discovered = true;
                return successCallback(result);
            } else {
                return this.produceError(errorCallback, 'discover');
            }
        },

        /**
         * Discover the device's services. Not providing an array of services will return all services and take longer to discover. iOS support only. Calling on Android will return void.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        services : function services(successCallback, errorCallback, params) {

            var result = {
                'status' : 'discoverServices',
                'serviceUuids' : [
                    '180D',
                    '180F'
                ]
            };

            if(!this.expectingError('services')) {
                if(this.OS === 'android') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'services');
            }
        },

        /**
         * Discover the service's characteristics. Not providing an array of characteristics will return all characteristics and take longer to discover. iOS support only. Calling on Android will return void.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        characteristics : function characteristics(successCallback, errorCallback, params) {

            var result = {
                'status' : 'discoverCharacteristics',
                'serviceUuid' : '180D',
                'characteristicUuids' : [
                    '2A37',
                    '2A38'
                ]
            };

            if(!this.expectingError('characteristics')) {
                if(this.OS === 'android') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'characteristics');
            }
        },

        /**
         * Discover the characteristic's descriptors. iOS support only. Calling on Android will return void.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        descriptors : function descriptors(successCallback, errorCallback, params) {

            var result = {
                'status' : 'discoverDescriptors',
                'serviceUuid' : '180D',
                'characteristicUuid' : '2A37',
                'descriptorUuids' : [
                    '2902'
                ]
            };

            if(!this.expectingError('descriptors')) {
                if(this.OS === 'android') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'descriptors');
            }
        },

        /**
         * Read a particular service's characteristic once.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        read: function read(successCallback, errorCallback, params) {

            var result = {
                'status': 'read',
                'serviceUuid': params.serviceUuid,
                'characteristicUuid': params.characteristicUuid,
                'value': ''
            };

            if(!this.expectingError('read')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'read');
            }
        },

        /**
         * Subscribe to a particular service's characteristic. Once a subscription is no longer needed, execute unsubscribe in a similar fashion. The Client Configuration descriptor will automatically be written to enable notification/indication.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        subscribe : function subscribe(successCallback, errorCallback, params) {

            var subscribedResult = {
                'status' : 'subscribed',
                'serviceUuid' : params.serviceUuid,
                'characteristicUuid' : params.characteristicUuid
            };

            var subscriptionValue = {
                'status' : 'subscribedResult',
                'serviceUuid' : params.serviceUuid,
                'characteristicUuid' : params.characteristicUuid,
                'value' : ''
            };

            if(!this.expectingError('subscribe')) {
                successCallback(subscribedResult);
            } else {
                this.produceError(errorCallback, 'subscribe');
            }
        },

        /**
         * Unsubscribe to a particular service's characteristic.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        unsubscribe : function unsubscribe(successCallback, errorCallback, params) {

            var result = {
                'status' : 'unsubscribed',
                'serviceUuid' : params.serviceUuid,
                'characteristicUuid' : params.characteristicUuid
            };

            if(!this.expectingError('unsubscribe')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'unsubscribe');
            }
        },

        /**
         * Write a particular service's characteristic. NOTE: this hasn't been well tested
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        write : function write(successCallback, errorCallback, params) {

            var result = {
                'status' : 'written',
                'serviceUuid' : params.serviceUuid,
                'characteristicUuid' : params.characteristicUuid,
                'value' : params.value
            };

            if(!this.expectingError('write')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'write');
            }
        },

        /**
         * Read a particular characterist's descriptor
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        readDescriptor : function readDescriptor(successCallback, errorCallback, params) {

            var result = {
                'status' : 'readDescriptor',
                'serviceUuid' : params.serviceUuid,
                'characteristicUuid' : params.characteristicUuid,
                'descriptorUuid' : params.descriptorUuid,
                'value' : 'abcd'
            };

            if(!this.expectingError('readDescriptor')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'readDescriptor');
            }
        },

        /**
         * Write a particular characteristic's descriptor. Unable to write characteristic configuration directly to keep in line with iOS implementation. Instead use subscribe/unsubscribe, which will automatically enable/disable notification. Note, limited testing and likely needs to be made more generic
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        writeDescriptor : function writeDescriptor(successCallback, errorCallback, params) {

            var result = {
                'status' : 'writeDescriptor',
                'serviceUuid' : params.serviceUuid,
                'characteristicUuid' : params.characteristicUuid,
                'descriptorUuid' : params.descriptorUuid,
                'value' :  params.value
            };

            if(!this.expectingError('writeDescriptor')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'writeDescriptor');
            }
        },

        /**
         * Read RSSI of a connected device. RSSI is also returned with scanning.
         * @param successCallback
         * @param errorCallback
         */
        rssi : function rssi(successCallback, errorCallback) {

            var result = {
                'status' : 'rssi',
                'rssi' : -5
            };

            if(!this.expectingError('rssi')) {
                successCallback(result);
            } else {
                this.produceError(errorCallback, 'rssi');
            }
        },

        /**
         * Determine whether the adapter is initialized. No error callback
         * @param successCallback
         */
        isInitialized : function isInitialized(successCallback) {
            successCallback({
                'isInitialized' : this.deviceState.initialized
            });
        },

        /**
         * Determine whether the adapter is initialized. No error callback
         * @param successCallback
         */
        isScanning : function isScanning(successCallback) {
            successCallback({
                'isScanning' : this.deviceState.scanning
            });
        },

        /**
         * Determine whether the device is connected. No error callback
         * @param successCallback
         */
        isConnected : function isConnected(successCallback) {
            successCallback({
                'isConncted' : this.deviceState.connected
            });
        },

        /**
         * Determine whether the device's characteristics and descriptors have been discovered. No error callback. Android support only. Calling on iOS will return false.
         * @param successCallback
         */
        isDiscovered : function isDiscovered(successCallback) {
            if (this.OS === 'ios') {
                return successCallback({
                    'isDiscovered' : false
                });
            } else {
                successCallback({
                    'isDiscovered' : this.deviceState.discovered
                });
            }
        },

        /**
         * @author https://github.com/randdusing
         * Helper function to convert a base64 encoded string from a characteristic or descriptor value into a uint8Array object.
         * @param string
         */
        encodedStringToBytes : function encodedStringToBytes(string) {
            var data = atob(string);
            var bytes = new Uint8Array(data.length);
            for (var i = 0; i < bytes.length; i++)
            {
                bytes[i] = data.charCodeAt(i);
            }
            return bytes;
        },

        /**
         * Helper function to convert a unit8Array to a base64 encoded string for a characteric or descriptor write.
         * @param bytes
         * @returns {*|string}
         */
        bytesToEncodedString : function bytesToEncodedString(bytes) {
            return btoa(String.fromCharCode.apply(null, bytes));
        },

        /**
         * Helper function to convert a string to bytes.
         * @param str
         */
        stringToBytes : function stringToBytes(string) {
            var buf = new ArrayBuffer(string.length*2); // 2 bytes for each char
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=string.length; i<strLen; i++) {
                bufView[i] = string.charCodeAt(i);
            }
            return buf;
        },

        /**
         * Helper function to convert bytes to a string.
         * @param buf
         */
        bytesToString : function bytesToString(buf) {
            return String.fromCharCode.apply(null, new Uint16Array(buf));
        }
    };

    // Mocking the cordova bluetooth dependecy
    $window.mockCordovaBluetooth = function() {
        //$window.console.log('Mocking cordova and bluetooth');
        $window.cordova = {};
        $window.bluetoothle = new CordovaBluetoothMock();
    };

    $window.ChromeBluetoothMock = function ChromeBluetoothMock() {

        var expectedErrors = [];
        var interval;

        // State machine
        var deviceState = {
            initialized : false,
            connected   : false,
            discovered  : false,
            scanning    : false
        };

        var bluetooth;

        bluetooth.initialize = function() {
            var result = {
                'address'     : '00:1A:7D:DA:71:13',
                'available'   : true,
                'discovering' : false,
                'name'        : 'FRIEDRICH',
                'powered'     : true
            };
        };

        var bluetoothLowEnergy;

        return {
            bluetooth : bluetooth,
            bluetoothLowEnergy : bluetoothLowEnergy
        };
    };

    // Mocking the chrome bluetooth dependency
    $window.mockChromeBluetooth = function() {
        //$window.console.log('Mocking chrome and bluetooth');
        $window.chrome = $window.chrome || {};
        var mock = $window.ChromeBluetoothMock();
        $window.chrome.bluetooth = mock.bluetooth;
        $window.chrome.bluetoothLowEnergy = mock.bluetoothLowEnergy;
    };

    $window.mockCordovaBluetooth();

}]);



