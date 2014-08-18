'use strict';
angular.module('iasCar.services').service('storageService', [function() {


    function LocalStorage() {

        var localStorage, fail, uid;

        try {
            uid = 'unique';
            (localStorage = window.localStorage).setItem(uid, uid);
            fail = localStorage.getItem(uid) !== uid;
            localStorage.removeItem(uid);
            if(fail) {
                localStorage = false;
            }
        } catch(e) {}

        if (!localStorage) {
            localStorage = {
                setItem: function (item) { console.info(item); },
                getItem: function (item) { console.info(item); }
            };
        }

        this.setItem = function (key, value) {
            return localStorage.setItem(key, value);
        };

        this.getItem = function (key) {
            return localStorage.getItem(key);
        };

    }

    return {
        localStorage : new LocalStorage()
    };

}]);
