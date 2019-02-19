/* global inject: false */
'use strict';

describe('pascalprecht.translate', function () {

    describe('$translateModule#run', function () {

        describe('with a storage', function () {
            describe('with values and json', function () {
                beforeEach(module('pascalprecht.translate', function ($translateProvider, $provide) {
                    $translateProvider.translations('en-us', readJSON('i18n/en-us.json'));
                    $translateProvider.translations('es-ar', readJSON('i18n/es-ar.json'));
                    $translateProvider.preferredLanguage("es-ar");
                }));

                it('should fallback to preferred locale', inject(function ($translate) {
                    expect($translate.use()).toEqual('es-ar');
                    expect($translate.getTranslationTable().hasOwnProperty("menu.trashed")).toEqual(true);
                    var table = $translate.getTranslationTable();
                    expect(Object.keys(table).length).toEqual(36);
                }));
            });
        });
    });
});
