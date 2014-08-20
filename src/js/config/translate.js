'use strict';
angular.module('iasCar').config(['$translateProvider', function ($translateProvider) {

    //Use static file loader to load language files from json file
    $translateProvider.useStaticFilesLoader({
        prefix : 'lang/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

}]).run([ 'storageService', '$translate', function (storageService, $translate) {

    function restoreLanguage() {
         storageService.localStorage.getItem('language').then(function(data) {
             if(data) {
                 data = JSON.parse(data);
                 $translate.use(data.language);
             }
        });
    }

    restoreLanguage();

}]);
