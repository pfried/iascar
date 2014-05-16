'use strict';
angular.module('iasCar').config(['$translateProvider', function ($translateProvider) {

    //Use static file loader to load language files from json file
    $translateProvider.useStaticFilesLoader({
        prefix : 'lang/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

}]);
