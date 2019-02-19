'use strict';
var regex_pmc = /Fecha\sHora Nro\. Trans\.\n(\d{2}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2})\s\d*[^\n]\n/g;

describe('file-load-component', function () {
    beforeEach(module('e-invoice.components'));
});
