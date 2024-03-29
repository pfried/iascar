'use strict';
angular.module('iasCar.services').factory('bluetoothTools', function() {

    var macRegex = /^([0-9a-fA-F]{2}[:]){5}([0-9a-fA-F]{2})$/;

    var nordicSemiRegex = /^(E4[:]47[:]3F[:])([0-9a-fA-F]{2}[:]){2}([0-9a-fA-F]{2})$/;

    var errorMessages = {
        notInitialized : 'Initialize Bluetooth first',
        noAddress : 'Please provide an address for connecting to a device',
        addressNotValid : 'Please provide the address in the correct format',
        notPreviouslyConnected : 'Device was not previously connected',
        notConnected : 'Device is not connected'
    };

    function isValidAddress(address) {

        if (address && (macRegex.test(address) || macRegex.test(addressToAndroidFormat(address)))) {
            return true;
        }

        return false;
    }

    function unifyAddress(address) {
        return address.replace(/\:/g,'');
    }

    function addressToAndroidFormat(address) {
        // Replace each two Chars of alphanumeric characters if they are followed by another char by the chars + :. $& is the lastMath identifier
        return address.replace(/\w{2}(?=\w)/g, '$&:');
    }

    function isNordicSemiVendorMac(mac) {
        return nordicSemiRegex.test(mac);
    }

    return {
        isValidAddress : isValidAddress,
        errorMessages  : errorMessages,
        unifyAddress : unifyAddress,
        addressToAndroidFormat : addressToAndroidFormat,
        isNordicSemiVendorMac : isNordicSemiVendorMac
    };

});
