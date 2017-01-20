'use strict';

describe('file-list-component', function () {
    var files;
    var textDiscovery

    beforeEach(module('e-invoice'));

    beforeEach(inject(function (_textDiscovery_, _$httpBackend_, _$injector_, _$http_) {
        $httpBackend = _$httpBackend_;
        textDiscovery = _textDiscovery_;
        files = readJSON('files/grouping-files-1.json').files;
    }));

    it('check file integrity', function () {
        expect(files).not.toEqual(null);
        expect(files.length).toEqual(30);
    })

    it('check date sort asc', function () {
        expect(files).not.toEqual(null);
        expect(files.length).toEqual(30);
        var sorted = files.sortDate("createdTime");
        expect(sorted[0].name).toEqual("20130105-Plan Rombo.pdf");
        expect(sorted[sorted.length - 1].name).toEqual("20170105-Plan Rombo2.pdf");
        var groups = d3.nest()
            .key(function (d) {
                if (!d.appProperties || !d.appProperties.expirationDate) {
                    return "";
                }
                return new Date(d.appProperties.expirationDate).getFullYear();
            }).sortKeys(d3.descending)
            .sortValues(d3.descending)
            .entries(sorted);
        expect(groups.length).toEqual(6);
        expect(groups[0].key).toEqual("2017");
        expect(groups[groups.length - 2].key).toEqual("2012");
        expect(groups[groups.length - 1].key).toEqual("");
        var flattened = groups.flattened();
        console.log(groups.print());
    })

    it('check date sort desc', function () {
        expect(files).not.toEqual(null);
        expect(files.length).toEqual(30);
        var sorted = files.sortDate("createdTime", false);
        expect(sorted[0].name).toEqual("20170105-Plan Rombo2.pdf");
        expect(sorted[sorted.length - 1].name).toEqual("20130105-Plan Rombo.pdf");
        var groups = d3.nest()
            .key(function (d) {
                if (!d.appProperties || !d.appProperties.expirationDate) {
                    return "";
                }
                return new Date(d.appProperties.expirationDate).getFullYear();
            }).sortKeys(d3.ascending)
            .sortValues(d3.ascending)
            .entries(sorted);
        expect(groups.length).toEqual(6);
        expect(groups[0].key).toEqual("");
        expect(groups[1].key).toEqual("2012");
        expect(groups[groups.length - 1].key).toEqual("2017");

        console.log(groups.print());
    });

    it('check flattened result', function () {
        expect(files).not.toEqual(null);
        expect(files.length).toEqual(30);
        var sorted = files.sortDate("createdTime", false);
        expect(sorted[0].name).toEqual("20170105-Plan Rombo2.pdf");
        expect(sorted[sorted.length - 1].name).toEqual("20130105-Plan Rombo.pdf");
        var groups = d3.nest()
            .key(function (d) {
                if (!d.appProperties || !d.appProperties.expirationDate) {
                    return "";
                }
                return new Date(d.appProperties.expirationDate).getFullYear();
            }).sortKeys(d3.ascending)
            .sortValues(d3.ascending)
            .entries(sorted);
        expect(groups.length).toEqual(6);
        expect(groups[0].key).toEqual("");
        expect(groups[1].key).toEqual("2012");
        expect(groups[2].key).toEqual("2013");
        expect(groups[3].key).toEqual("2015");
        expect(groups[4].key).toEqual("2016");
        expect(groups[5].key).toEqual("2017");

        //''
        expect(groups[0].values.length).toEqual(3);
        //2012
        expect(groups[1].values.length).toEqual(1);
        //2013
        expect(groups[2].values.length).toEqual(1);
        //2015
        expect(groups[3].values.length).toEqual(9);
        //2016
        expect(groups[4].values.length).toEqual(15);
        //2017
        expect(groups[5].values.length).toEqual(1);

        var flattened = groups.flattened();
        console.log(flattened.print());
        expect(flattened.length).toEqual(36);
        expect(flattened[0].name).toEqual("");
        expect(flattened[4].name).toEqual("2012");
        expect(flattened[6].name).toEqual("2013");

    });
});
