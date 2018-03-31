'use strict';
var $httpBackend;

describe('app-config-service', function () {
    var loginService;
    var userInfo;

    beforeEach(module('e-invoice'));
    beforeEach(inject(function (_loginService_, _$httpBackend_, _$injector_, _$http_, _GAuth_) {
        $httpBackend = _$httpBackend_;
        loginService = _loginService_;
        _GAuth_.checkAuth().then(function (user) {
                userInfo = user;
            },
            function (err) {
                console.log(error);
            });
    }));

//    it('check login service', function () {
//        var userInfo = loginService.getUserInfo().then(function (data) {
//            console.log(data);
//        }, function (err) {
//            console.error("Error: " + err);
//        });
//    });
});
