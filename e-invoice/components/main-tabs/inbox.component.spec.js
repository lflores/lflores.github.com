'use strict';
var regex_pmc = /Fecha\sHora Nro\. Trans\.\n(\d{2}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2})\s\d*[^\n]\n/g;

describe('file-load-component', function () {
    beforeEach(module('e-invoice'));

    // Test the controller
    describe('PhoneDetailController', function () {
        var $httpBackend;
        var pmcFile = {
            name: 'phone xyz',
            images: ['image/url1.png', 'image/url2.png']
        };

        beforeEach(inject(function ($componentController, _$httpBackend_) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('../files/pmc-aysa.txt').respond(pmcFile);
        }));

        it('check factura fibertel', function () {
            console.log(pmcFile);
            var regex = /^([\d\,]*)\n(\d{2}-\d{2}-\d{4})\n(\d*)\nCablevision[↵\.\w\n\s\(\)-\\,°]*(Fibertel)/g;
            //console.log(regex.exec(text));
            var matches = regex.exec(factura_fibertel);
            if (matches) {
                expect(matches[1]).toEqual("698,00");
                expect(matches[2]).toEqual("08-11-2016");
                expect(matches[3]).toEqual("00421777694");
            }
        });

        it('check pago personal', function () {
            var matches = regex_pmc.exec(pago_personal);
            //expect(matches).not.toBe(null);
            //        expect(matches[1]).toEqual("3526943505");
            //        expect(matches[2]).toEqual("442,40");
            //        expect(matches[3]).toEqual("Personal");
            //        expect(matches[4]).toEqual("07/11/16 09:55:21");

        });

        it('check pago victoria', function () {
            var matches1 = regex_pmc.exec(pago_victoria);
            //expect(matches1).not.toBe(null);
            //        expect(matches1[1]).toEqual("270217");
            //        expect(matches1[2]).toEqual("1632,00");
            //        expect(matches1[3]).toEqual("Victoria Seguros");
            //        expect(matches1[4]).toEqual("07/11/16 09:55:16");
        });

        it('check pago movistar', function () {
            var matches = regex_pmc.exec(pago_movistar);
            //expect(matches).not.toBe(null);

            //        expect(matches[1]).toEqual("0420073767523");
            //        expect(matches[2]).toEqual("181,44");
            //        expect(matches[3]).toEqual("Movistar");
            //        expect(matches[4]).toEqual("07/11/16 09:55:19");

        });
    });
});



var pago_personal = "﻿Pago de\nIdentificación 3526943505\nPor un importe de $ 442,40\nDebitado de su cta. CA $ XXXX328013\nNro. de\nPersonal\nFecha Hora Nro. Trans.\n07/11/16 09:55:21 1002\n3526943505 COMPROBANTE VALIDO DE PAGO. CONSERVELO\n1557";

var pago_victoria = "﻿Pago de\nIdentificación 270217\nPor un importe de $ 1632,00\nDebitado de su cta. CA $ XXXX328013\nNro. de\nVictoria Seguros\nFecha Hora Nro. Trans.\n07/11/16 09:55:16 9578\nCUOTA VTO. NOV DE 2016 COMPROBANTE VALIDO DE PAGO. CONSERVELO.\n1125";

var pago_movistar = "﻿Pago de\nIdentificación 0420073767523\nPor un importe de $ 181,44\nDebitado de su cta. CA $ XXXX328013\nNro. de\nMovistar\nFecha Hora Nro. Trans.\n07/11/16 09:55:19 9701\nA CUENTA SALDO COMPROBANTE VALIDO DE PAGO. CONSERVELO.\n1317";

var factura_fibertel = "﻿698,00↵08-11-2016\n00421777694\nCablevision S.A. Hornos 690 (1272) - Capital Federal IVA Responsable Inscripto\n17-10-2016\nSaldo Anterior 698,00 Su Pago Anterior -698,00 1022-68396191\nTotal Factura 698,00 B\nFECHA: 19-10-2016 C.U.I.T.:30573652084 Ing. Brutos: C.M.:901-180042-9 Inicio de actividades 27/04/2011 Codigo N° 06 LEONARDO FLORES\nDebito Automatico 19-10-2016 SANTA FE 951 3 B\nNOV-2016 DMOR006 /W (1708A) MORON -\nConsumidor Final BELGRANO GRAL MANUEL / SAN MARTIN GRAL JOSE DE\nNumero de Referencia de Pago: 91031475\nFibertel 6 Megas 11-2016 698,00 Servicios Banda Ancha (SBA) Subtotal 698,00\n698,00↵3057365208402102266424752623419201610296↵$698,00↵Orientacion al Consumidor Provincia de Buenos Aires 0-800-222-9042↵CAE Nro.: 66424752623419 Fecha Vto.: 29-10-2016↵2do. Vencimiento↵0000003091031475";
