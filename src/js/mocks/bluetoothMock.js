/*jshint unused:false */
'use strict';
angular.module('iasCarMock', ['iasCar', 'ngMockE2E']).run(['$httpBackend', '$window', '$interval', function ($httpBackend, $window, $interval) {

    // Pass through all dependencies
    $httpBackend.whenGET(/^partials\//).passThrough();
    $httpBackend.whenGET(/^lang\//).passThrough();

    $window.BluetoothMock = function BluetoothMock() {

        var errorMessages = {
            default : 'Default error message',
            initialize : {
                notEnabled : 'Bluetooth not enabled',
                notEnabledUser : 'Bluetooth not enabled by user',
                notSupported : 'Hardware doesn\'t support Bluetooth LE',
                notInit : 'Bluetooth not initialized'
            },
            startScan : {
                alreadyScanning : 'Scanning already in progress',
                scanStartFail : 'Scan failed to start',
                notScanning : 'Not scanning'
            },
            connect : {
                previouslyConnected : 'Device previously connected, reconnect or close for new device',
                neverConnected : 'Never connected to device',
                isNotConnected : 'Device isn\'t connected',
                isNotDisconnected : 'Device isn\'t disconnected',
                isDisconnected : 'Device is disconnected',
                noAddress : 'No device address',
                noDevice : 'Device not found',
                reconnectFail : 'Reconnection to device failed'
            },
            discover : {
                alreadyDiscovering : 'Already discovering device',
                discoveryFail : 'Unable to discover service'
            },
            readWrite : {
                noArgument : 'Argument object not found',
                noService : 'Service not found',
                noCharacteristic : 'Characteristic not found',
                noDescriptor : 'Descriptor not found',
                readFail : 'Unable to read',
                readFailReturn : 'Unable to read on return',
                subscribeFail : 'Unable to subscribe',
                unsubscribeFail : 'Unable to unsubscribe',
                writeFail : 'Unable to write',
                writeReturnFail : 'Unable to write on return',
                writeValueNotFound : 'Write value not found',
                writeValueNotSet : 'Write value not set',
                readDescriptorFail : 'Unable to read descriptor',
                readDescriptorFailReturn : 'Unable to read descriptor on return',
                writeDescriptorNotAllowed : 'Unable to write client configuration descriptor',
                writeDescriptorFail : 'Unable to write descriptor',
                writeDescriptorValueNotFound : 'Write descriptor value not found',
                writeDescriptorValueNotSet : 'Write descriptor value not set',
                writeDescriptorFailReturn : 'Descript not written on return',
                rssiFail : 'Unable to read RSSI',
                rssiFailReturn : 'Unable to read RSSI on return'
            }
        };

        var OS = 'android';
        var expectingError = false;

        /**
         * Initialize Bluetooth on the device. Must be called before anything else. If Bluetooth is disabled, the user will be prompted to enable it on Android devices. Note: Although Bluetooth initialization could initially be successful, there's no guarantee whether it will stay enabled. Each call checks whether Bluetooth is disabled. If it becomes disabled, the user must reinitialize Bluetooth, connect to the device, start a read/write operation, etc.
         * @param successCallback
         * @param errorCallback
         */
        function initialize(successCallback, errorCallback) {

            var result = {
                'status' : 'initialized'
            };

            if(!expectingError) {
                successCallback(result);
            } else {
                errorCallback({
                    error : 'initialize',
                    message : errorMessages.initialize.notEnabled
                });
            }

        }

        /**
         * Scan for Bluetooth LE devices. Since scanning is expensive, stop as soon as possible. The Phonegap app should use a timer to limit the scan interval.
         * @param successCallback
         * @param errorCallback
         */
        function startScan(successCallback, errorCallback) {

            var resultAndroid = {
                'status': 'scanResult',
                'address': '01:23:45:67:89:AB',
                'name': 'IASCar1',
                'rssi': -5
            };

            var resultIOS = {
                'status'  : 'scanResult',
                'address' : '123234',
                'name'    : 'IASCar1',
                'rssi'    : -5
            };

            var resultStartScan = {
                'status' : 'scanStarted'
            };

            if(!expectingError) {

                if (OS === 'android') {
                    successCallback(resultStartScan);
                }

                window.setInterval(function() {
                    window.console.log('adding device');
                    successCallback(resultAndroid);
                }, 5000);

            } else {
                errorCallback({
                    error : 'initialize',
                    message : errorMessages.startScan.scanStartFail
                });
            }
        }

        /**
         * Stop scan for Bluetooth LE devices. Since scanning is expensive, stop as soon as possible. The Phonegap app should use a timer to limit the scanning time.
         * @param successCallback
         * @param errorCallback
         */
        function stopScan(successCallback, errorCallback) {
            successCallback({
                'status' : 'scanStopped'
            });
        }

        /**
         * Connect to a Bluetooth LE device. The Phonegap app should use a timer to limit the connecting time in case connecting is never successful. Once a device is connected, it may disconnect without user intervention. The original connection callback will be called again and receive an object with status => disconnected. To reconnect to the device, use the reconnect method. Before connecting to a new device, the current device must be disconnected and closed. If a timeout occurs, the connection attempt should be canceled using disconnect().
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        function connect(successCallback, errorCallback, params) {

            if(params && !params.address) {
                errorCallback({
                    'status' : 'connecting',
                    'message': errorMessages.connect.noAddress
                });
            }

            var resultConnected = {
                'status'  : 'connected',
                'address' : '01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            var resultConnecting = {
                'status'  : 'connecting',
                'address' : '01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            if(!expectingError) {
                successCallback(resultConnected);
            } else {
                errorCallback({
                    error : 'connecting',
                    message : errorMessages.connect.neverConnected
                });
            }
        }

        /**
         * Reconnect to a previously connected Bluetooth device. The Phonegap app should use a timer to limit the connecting time. If a timeout occurs, the reconnection attempt should be canceled using disconnect().
         * @param successCallback
         * @param errorCallback
         */
        function reconnect(successCallback, errorCallback) {

            var resultConnected = {
                'status'  : 'connected',
                'address' : '01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            if(!expectingError) {
                successCallback(resultConnected);
            } else {
                errorCallback({
                    error : 'reconnecting',
                    message : errorMessages.connect.neverConnected
                });
            }
        }

        /**
         * Disconnect from a Bluetooth LE device.
         * @param successCallback
         * @param errorCallback
         */
        function disconnect(successCallback, errorCallback) {

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

            if(!expectingError) {
                successCallback(resultDisconnected);
            } else {
                errorCallback({
                    error : 'reconnecting',
                    message : errorMessages.connect.isNotDisconnected
                });
            }
        }

        /**
         * Close/dispose a Bluetooth LE device. Must disconnect before closing.
         * @param successCallback
         * @param errorCallback
         */
        function close(successCallback, errorCallback) {
            var result = {
                'status'  : 'closed',
                'address' :'01:23:45:67:89:AB',
                'name'    : 'iasCar1'
            };

            if(!expectingError) {
                successCallback(result);
            } else {
                errorCallback({
                    error : 'closing',
                    message : errorMessages.default
                });
            }
        }

        /**
         * Discover all the devices services, characteristics and descriptors. Doesn't need to be called again after disconnecting and then reconnecting. Android support only. Calling on iOS will return void.
         * @param successCallback
         * @param errorCallback
         */
        function discover(successCallback, errorCallback) {

            var result = {
                'address':'01:23:45:67:89:AB',
                'name':'iasCar1',
                'services':[
                    {
                        'serviceUuid':'180d',
                        'characteristics':[
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

            if(!expectingError) {
                if(OS === 'ios') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                errorCallback({
                    error : 'closing',
                    message : errorMessages.default
                });
            }


        }

        /**
         * Discover the device's services. Not providing an array of services will return all services and take longer to discover. iOS support only. Calling on Android will return void.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        function services(successCallback, errorCallback, params) {

            var result = {
                'status' : 'discoverServices',
                'serviceUuids' : [
                    '180D',
                    '180F'
                ]
            };

            if(!expectingError) {
                if(OS === 'android') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                errorCallback({
                    error : 'services',
                    message : errorMessages.default
                });
            }

        }

        /**
         * Discover the service's characteristics. Not providing an array of characteristics will return all characteristics and take longer to discover. iOS support only. Calling on Android will return void.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        function characteristics(successCallback, errorCallback, params) {

            var result = {
                'status' : 'discoverCharacteristics',
                'serviceUuid' : '180D',
                'characteristicUuids' : [
                    '2A37',
                    '2A38'
                ]
            };

            if(!expectingError) {
                if(OS === 'android') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                errorCallback({
                    error : 'characteristics',
                    message : errorMessages.default
                });
            }
        }

        /**
         * Discover the characteristic's descriptors. iOS support only. Calling on Android will return void.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        function descriptors(successCallback, errorCallback, params) {

            var result = {
                'status' : 'discoverDescriptors',
                'serviceUuid' : '180D',
                'characteristicUuid' : '2A37',
                'descriptorUuids' : [
                    '2902'
                ]
            };

            if(!expectingError) {
                if(OS === 'android') {
                    successCallback(void(0));
                }
                successCallback(result);
            } else {
                errorCallback({
                    error : 'descriptors',
                    message : errorMessages.default
                });
            }
        }

        /**
         * Read a particular service's characteristic once.
         * @param successCallback
         * @param errorCallback
         * @param params
         */
        function read(successCallback, errorCallback, params) {

            var result = {
                'status': 'read',
                'serviceUuid': '180F',
                'characteristicUuid': '2A19',
                'value': ''
            };

            if(!expectingError) {
                successCallback(result);
            } else {
                errorCallback({
                    error : 'descriptors',
                    message : errorMessages.readWrite.readFail
                });
            }

        }

        function subscribe(successCallback, errorCallback, params) {

            var subscribedResult = {
                'status' : 'subscribed',
                'serviceUuid' : '180D',
                'characteristicUuid' : '2A37'
            };

            var subscriptionValue = {
                'status' : 'subscribedResult',
                'serviceUuid' : '180D',
                'characteristicUuid' : '2A37',
                'value' : ''
            };

            if(!expectingError) {
                successCallback(subscribedResult);
            } else {
                errorCallback({
                    error : 'descriptors',
                    message : errorMessages.readWrite.readFail
                });
            }
        }

        return {
            expectingError   : expectingError,
            OS               : OS,
            initialize       : initialize,
            startScan        : startScan,
            stopScan         : stopScan,
            connect          : connect,
            reconnect        : reconnect,
            close            : close,
            discover         : discover,
            services         : services,
            characteristics  : characteristics,
            descriptors      : descriptors,
            read             : read
        };
    };

    // Mock the presence of Cordova
    $window.mockCordova = function() {
        window.cordova = {};
    };

    // Mocking the bluetooth dependecy
    $window.mockBluetooth = function() {
        window.bluetoothle = window.BluetoothMock();
    };

    window.console.log('Mocking cordova and bluetooth');
    $window.mockBluetooth();
    $window.mockCordova();

}]);



