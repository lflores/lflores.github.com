'use strict';
var regex_pmc = /Fecha\sHora Nro\. Trans\.\n(\d{2}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2})\s\d*[^\n]\n/g;

describe('settings-component', function () {
    var $httpBackend;
    beforeEach(module('e-invoice'));
    beforeEach(inject(function ($componentController, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
    }));

    it('check default settings', function () {

    });
});
