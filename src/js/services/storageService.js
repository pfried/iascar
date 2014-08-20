'use strict';
angular.module('iasCar.services').service('storageService', ['$q', function($q) {


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


        if(localStorage) {
            localStorage = {
                getItem : function(key) {
                    var deferred = $q.defer();
                    deferred.resolve(window.localStorage.getItem(key));
                    return deferred.promise;
                },
                setItem : function(key, value) {
                    var deferred = $q.defer();
                    deferred.resolve(window.localStorage.setItem(key, value));
                    return deferred.promise;
                }
            };
        }

        if(window.chrome && window.chrome.storage && window.chrome.storage.local) {
            localStorage = {
                getItem : function(key) {
                    var deferred = $q.defer();
                    window.chrome.storage.local.get(key, function(value) {
                        deferred.resolve(value[key]);
                    });
                    return deferred.promise;
                },
                setItem : function(key, value) {
                    var deferred = $q.defer();
                    var storageObject = {};
                    storageObject[key] = value;
                    window.chrome.storage.local.set(storageObject, function() {
                        deferred.resolve();
                    });
                    return deferred.promise;
                }
            };
        }

        if (!localStorage) {
            localStorage = {
                setItem: function (key, value) {
                    return $q.when(console.info('Setting item: ', key, ' as ', value));
                },
                getItem: function (key) {
                    return $q.when(console.info('Getting item: ', key));
                }
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
