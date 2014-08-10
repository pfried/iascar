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
                getItem: function (item) { console.info(item); },
                removeItem: function (item) { console.info(item); },
                key: function (item) { console.info(item); },
                clear: function (item) { console.info(item); }
            };
        }

        this.setItem = function (key, value) {
            return localStorage.setItem(key, value);
        };

        this.getItem = function (key) {
            return localStorage.getItem(key);
        };

        this.removeItem = function (key) {
            return localStorage.removeItem(key);
        };

        this.key = function (position) {
            return localStorage.key(position);
        };

        this.clear = function () {
            return localStorage.clear();
        };
    }

    return {
        localStorage : new LocalStorage()
    };

}]);
