'use strict';
angular.module('iasCar.services').factory('bluetoothTools', function() {

    var macRegex = /^([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2})$/;

    var errorMessages = {
        notInitialized : 'Initialize Bluetooth first',
        noAddress : 'Please provide an address for connecting to a device',
        addressNotValid : 'Please provide the address in the correct format'
    };

    function isValidAddress(address) {

        if (address && macRegex.test(address)) {
            return true;
        }

        return false;
    }

    function unifyAddress(address) {
        return address.replace(/\:/g,'');
    }

    return {
        isValidAddress : isValidAddress,
        errorMessages  : errorMessages,
        unifyAddress : unifyAddress
    }

});
