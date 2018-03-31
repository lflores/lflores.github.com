'use strict';
var _fileId = '0B1xExtVoYNhaMG9LTy0yc00tc0k';
var $httpBackend;
var factOSDE1, factPersonal1, factPersonal2, factPersonal3, pmcEdenor, pmcVictoria, pmcHurlingham, factFibertel1, factFibertel2, pmcAysa, pmcOSDE, pmcGasNatural;

describe('app-config-service', function () {
    var appConfig;
    var gapi;

    beforeEach(module('e-invoice'));
    beforeEach(inject(function (_appConfig_, _GApi_, _$httpBackend_, _$injector_, _$http_) {
        $httpBackend = _$httpBackend_;
        appConfig = _appConfig_;
        gapi = _GApi_;
    }));

//    it('check getAppConfig', function () {
//        appConfig.getAppConfig().then(function (data) {
//            console.log(data);
//        }, function (error) {
//            console.error(data);
//        })
//    });
});
