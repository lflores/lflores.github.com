'use strict';
var _fileId = '0B1xExtVoYNhaMG9LTy0yc00tc0k';
var $httpBackend;
var factOSDE1, factPersonal1, factPersonal2, factPersonal3, pmcEdenor, pmcVictoria, pmcHurlingham, factFibertel1, factFibertel2, pmcAysa, pmcOSDE, pmcGasNatural;

describe('text-discovery-service', function () {
    var textParser;
    var mockDependency;

    beforeEach(module('e-invoice'));
    beforeEach(inject(function (_textParser_, _$httpBackend_, _$injector_, _$http_) {
        $httpBackend = _$httpBackend_;
        textParser = _textParser_;
        factPersonal1 = readJSON('files/personal-fact-1.json').responseText;
        factPersonal2 = readJSON('files/personal-fact-2.json').responseText;
        factPersonal3 = readJSON('files/personal-fact-3.json').responseText;

        factFibertel1 = readJSON('files/fibertel-fact-1.json').responseText;
        factFibertel2 = readJSON('files/fibertel-fact-2.json').responseText;

        pmcAysa = readJSON('files/pmc-aysa.json').responseText;
        pmcOSDE = readJSON('files/pmc-OSDE.json').responseText;
        pmcEdenor = readJSON('files/pmc-edenor.json').responseText;
        pmcVictoria = readJSON('files/pmc-victoria.json').responseText;
        pmcHurlingham = readJSON('files/pmc-hurlingham.json').responseText;
        pmcGasNatural = readJSON('files/pmc-gas-natural.json').responseText;
        factOSDE1 = readJSON('files/osde-fact-1.json').responseText;
    }));

//    it('file discovery personal factura 1', function () {
            //        var response = textParser.parseFile(factPersonal1);
            //        //console.log(factPersonal1);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(7);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("03-08-2015");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("11-03-1996");
            //        expect(moment(response.dates[2].date).format("DD-MM-YYYY")).toEqual("27-07-2015");
            //        expect(moment(response.dates[3].date).format("DD-MM-YYYY")).toEqual("03-08-2015");
            //        expect(moment(response.dates[4].date).format("DD-MM-YYYY")).toEqual("03-08-2015");
            //        expect(moment(response.dates[5].date).format("DD-MM-YYYY")).toEqual("13-07-2015");
            //        expect(moment(response.dates[6].date).format("DD-MM-YYYY")).toEqual("03-09-2015");
            //
            //        expect(response.dates[0].text).toEqual("VENCIMIENTO 03/08/2015");
            //        expect(response.dates[1].text).toEqual('Telecom Personal S.A. Lugar de Emisión: La Pampa 2295 C1428EAM C.A.B.A IVA Responsable Inscripto - Agente de Retención R.G. 18/97 C.U.I.T. N° 30-67818644-5 Ing. Brutos: Conv. Mult. N° 901-172963-3 Inicio de Actividades: 11/03/1996');
            //        expect(response.dates[2].text).toEqual("Fecha Vto. C.A.E. 27/07/2015");
            //        expect(response.dates[3].text).toEqual("VENCIMIENTO 03/08/2015");
            //        expect(response.dates[4].text).toEqual("VENCIMIENTO 03/08/2015");
            //        expect(response.dates[5].text).toEqual('PERÍODO FACTURADO 14/06/2015 al 13/07/2015');
            //        expect(response.dates[6].text).toEqual("FACTURA NRO.: 5514-00076575 FECHA DE EMISION 17/07/2015 VENCIMIENTO DE LA PROXIMA FACTURA 03/09/2015 CODIGO LINK PAGOS 3723526943505");
            //        //check prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(7);
            //
            //        expect(response.amounts[0].amount).toEqual(56.29);
            //        expect(response.amounts[1].amount).toEqual(281.07);
            //        expect(response.amounts[2].amount).toEqual(-281.07);
            //        expect(response.amounts[3].amount).toEqual(281.07);
            //        expect(response.amounts[4].amount).toEqual(281.07);
            //        expect(response.amounts[5].amount).toEqual(281.07);
            //        expect(response.amounts[6].amount).toEqual(281.07);
            //        //expect(response.amounts[7].amount).toEqual(281.07);
            //
            //
            //        expect(response.amounts[0].text).toEqual("Cargos Fijos Abono Fijo 3 +i (14-07 - 13-08) 1 178,1700 21% 178,17 Protección GSM Médium Ind (14-07 - 13-08) # 1 46,0500 21% 46,05 Protección Medium Ind Exento (14-07 - 13-08) # 1 0,5600 0% 0,56 Crédito Promocional 1 46,0000 -46,00 21% 0,00 224,78 Impuestos IVA 21% 47,09 Imp. Internos Ley 25.239 4.1667% 7,42 Cargo ENARD Ley 26.573 1% 1,78 56,29");
            //        expect(response.amounts[1].text).toEqual("TOTAL FACTURA $ 281,07");
            //        expect(response.amounts[2].text).toEqual("Saldo Anterior 281,07 Pagos Realizados -281,07");
            //        expect(response.amounts[3].text).toEqual("Cargos del Mes 281,07");
            //        expect(response.amounts[4].text).toEqual("TOTAL A PAGAR $ 281,07");
            //        expect(response.amounts[5].text).toEqual("$ 281,07");
            //        expect(response.amounts[6].text).toEqual("TOTAL A PAGAR $ 281,07\n$ 281,07");
            //        //expect(response.amounts[7].text).toEqual("$ 281,07");
            //
            //        expect(response.name).toEqual("Personal");
            //    });
            //    it('file discovery personal factura 2', function () {
            //        var response = textParser.parseFile(factPersonal2);
            //        //console.log(factura1);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(7);
            //        //Pruebo que todas las fechas buscadas sean las del archivo
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("03-06-2016");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("11-03-1996");
            //        expect(moment(response.dates[2].date).format("DD-MM-YYYY")).toEqual("27-05-2016");
            //        expect(moment(response.dates[3].date).format("DD-MM-YYYY")).toEqual("03-06-2016");
            //        expect(moment(response.dates[4].date).format("DD-MM-YYYY")).toEqual("03-06-2016");
            //        expect(moment(response.dates[5].date).format("DD-MM-YYYY")).toEqual("13-05-2016");
            //        expect(moment(response.dates[6].date).format("DD-MM-YYYY")).toEqual("04-07-2016");
            //
            //        expect(response.dates[0].text).toEqual("VENCIMIENTO 03/06/2016");
            //        expect(response.dates[1].text).toEqual('Telecom Personal S.A. Lugar de Emisión: La Pampa 2295 C1428EAM C.A.B.A IVA Responsable Inscripto - Agente de Retención R.G. 18/97 C.U.I.T. N° 30-67818644-5 Ing. Brutos: Conv. Mult. N° 901-172963-3 Inicio de Actividades: 11/03/1996');
            //        expect(response.dates[2].text).toEqual("Fecha Vto. C.A.E. 27/05/2016");
            //        expect(response.dates[3].text).toEqual("VENCIMIENTO 03/06/2016");
            //        expect(response.dates[4].text).toEqual("VENCIMIENTO 03/06/2016");
            //        expect(response.dates[5].text).toEqual("PERÍODO FACTURADO 14/04/2016 al 13/05/2016");
            //        expect(response.dates[6].text).toEqual("FACTURA NRO.: 5514-43666769 FECHA DE EMISION 17/05/2016 VENCIMIENTO DE LA PROXIMA FACTURA 04/07/2016 CODIGO LINK PAGOS 3723526943505");
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(9);
            //
            //        expect(response.amounts[0].amount).toEqual(2.178);
            //        expect(response.amounts[1].amount).toEqual(66.51);
            //        expect(response.amounts[2].amount).toEqual(334.04);
            //        expect(response.amounts[3].amount).toEqual(-334.04);
            //        expect(response.amounts[4].amount).toEqual(334.04);
            //        expect(response.amounts[5].amount).toEqual(334.04);
            //        expect(response.amounts[6].amount).toEqual(334.04);
            //        expect(response.amounts[7].amount).toEqual(334.04);
            //        expect(response.amounts[8].amount).toEqual(334.04);
            //
            //        expect(response.amounts[0].text).toEqual("El precio de tu Abono Fijo 3 +i es $256,03. Datos Incluidos El precio del SMS es $1,15. El precio del MMS es $1,39. El precio del segundo de voz local excedente es $0,0516, y el bloque de 30 segundos es $1,548. El precio del segundo de Larga Distancia Nacional (hasta 110km) es $0,0636, y el bloque de 30 segundos es $1,908. El precio del segundo de Larga Distancia Internacional (paises limitrofes + USA) es $0,0726, y el bloque de 30 segundos es $2,178. Todos los precios expresados son finales.");
            //        expect(response.amounts[1].text).toEqual("Cargos Fijos Abono Fijo 3 +i (14-05 - 13-06) 1 202,9300 21% 202,93 Protección GSM Médium Ind (14-05 - 13-06) # 1 63,8300 21% 63,83 Protección Medium Ind Exento (14-05 - 13-06) # 1 0,7700 0% 0,77 Crédito Promocional 1 46,0000 -46,00 21% 0,00 267,53 Impuestos IVA 21% 56,02 Imp. Internos Ley 25.239 4.1667% 8,46 Cargo ENARD Ley 26.573 1% 2,03 66,51");
            //        expect(response.amounts[2].text).toEqual("TOTAL FACTURA $ 334,04");
            //        expect(response.amounts[3].text).toEqual("Saldo Anterior 334,04 Pagos Realizados -334,04");
            //        expect(response.amounts[4].text).toEqual("Cargos del Mes 334,04");
            //        expect(response.amounts[5].text).toEqual("TOTAL A PAGAR $ 334,04");
            //        expect(response.amounts[6].text).toEqual("$ 334,04");
            //        expect(response.amounts[7].text).toEqual("TOTAL A PAGAR $ 334,04");
            //        expect(response.amounts[8].text).toEqual("$ 334,04");
            //
            //        expect(response.name).toEqual("Personal");
            //    });
            //    it('file discovery personal factura 3', function () {
            //        var response = textParser.parseFile(factPersonal3);
            //        //console.log(factPersonal1);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(7);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("08-05-2015");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("11-03-1996");
            //        expect(moment(response.dates[2].date).format("DD-MM-YYYY")).toEqual("27-04-2015");
            //        expect(moment(response.dates[3].date).format("DD-MM-YYYY")).toEqual("08-05-2015");
            //        expect(moment(response.dates[4].date).format("DD-MM-YYYY")).toEqual("08-05-2015");
            //        expect(moment(response.dates[5].date).format("DD-MM-YYYY")).toEqual("13-04-2015");
            //        expect(moment(response.dates[6].date).format("DD-MM-YYYY")).toEqual("08-06-2015");
            //
            //        expect(response.dates[0].text).toEqual("VENCIMIENTO 08/05/2015");
            //        expect(response.dates[1].text).toEqual('Telecom Personal S.A. Lugar de Emisión: Migueletes 2423 - (C1428ASM) C.A.B.A IVA Responsable Inscripto - Agente de Retención R.G. 18/97 C.U.I.T. N° 30-67818644-5 Ing. Brutos: Conv. Mult. N° 901-172963-3 Inicio de Actividades: 11/03/1996');
            //        expect(response.dates[2].text).toEqual("Fecha Vto. C.A.E. 27/04/2015");
            //        expect(response.dates[3].text).toEqual("VENCIMIENTO 08/05/2015");
            //        expect(response.dates[4].text).toEqual("VENCIMIENTO 08/05/2015");
            //        expect(response.dates[5].text).toEqual('PERÍODO FACTURADO 14/03/2015 al 13/04/2015');
            //        expect(response.dates[6].text).toEqual("FACTURA NRO.: 5478-41373313 FECHA DE EMISION 17/04/2015 VENCIMIENTO DE LA PROXIMA FACTURA 08/06/2015 CODIGO LINK PAGOS 3723526943505");
            //        //check prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(7);
            //
            //        expect(response.amounts[0].amount).toEqual(56.29);
            //        expect(response.amounts[1].amount).toEqual(281.07);
            //        expect(response.amounts[2].amount).toEqual(-315.00);
            //        expect(response.amounts[3].amount).toEqual(281.07);
            //        expect(response.amounts[4].amount).toEqual(281.07);
            //        expect(response.amounts[5].amount).toEqual(281.07);
            //        expect(response.amounts[6].amount).toEqual(281.07);
            //
            //        expect(response.amounts[0].text).toEqual("Cargos Fijos Abono Fijo 3 +i (14-04 - 13-05) 1 178,1700 21% 178,17 Protección GSM Médium Ind (14-04 - 13-05) # 1 46,0500 21% 46,05 Protección Medium Ind Exento (14-04 - 13-05) # 1 0,5600 0% 0,56 Crédito Promocional 1 46,0000 -46,00 21% 0,00 224,78 Impuestos IVA 21% 47,09 Imp. Internos Ley 25.239 4.1667% 7,42 Cargo ENARD Ley 26.573 1% 1,78 56,29");
            //        expect(response.amounts[1].text).toEqual("TOTAL FACTURA $ 281,07");
            //        expect(response.amounts[2].text).toEqual("Saldo Anterior 315,00 Pagos Realizados -315,00");
            //        expect(response.amounts[3].text).toEqual("Cargos del Mes 281,07");
            //        expect(response.amounts[4].text).toEqual("TOTAL A PAGAR $ 281,07");
            //        expect(response.amounts[5].text).toEqual("$ 281,07");
            //        expect(response.amounts[6].text).toEqual("TOTAL A PAGAR $ 281,07");
            //        expect(response.amounts[7].text).toEqual("$ 281,07");
            //
            //        expect(response.name).toEqual("Personal");
            //    });
            //    it('file discovery Pago mis cuentas Edenor', function () {
            //        var response = textParser.parseFile(pmcEdenor);
            //        //console.log(pmcEdenor);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(1);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("03-03-2014");
            //        expect(response.dates[0].text).toEqual("03/03/14 09:23:33 7094");
            //
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(1);
            //        expect(response.amounts[0].amount).toEqual(284.76);
            //        expect(response.amounts[0].text).toEqual("Por un importe de $ 284,76");
            //
            //        expect(response.name).toEqual("Edenor");
            //    });
            //    it('file discovery Pago Mis Cuentas Victoria', function () {
            //        var response = textParser.parseFile(pmcVictoria);
            //        //console.log(pmcVictoria);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(1);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("07-11-2016");
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(1);
            //        expect(response.amounts[0].amount).toEqual(1632.00);
            //        expect(response.amounts[0].text).toEqual("Por un importe de $ 1632,00");
            //        expect(response.name).toEqual("Victoria Seguros");
            //    });
            //    it('file discovery Pago mis cuentas Hurlingham', function () {
            //        var response = textParser.parseFile(pmcHurlingham);
            //        //console.log(pmcEdenor);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(1);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("05-01-2016");
            //        expect(response.dates[0].text).toEqual("05/01/16 10:13:00 1920");
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(1);
            //        expect(response.amounts[0].amount).toEqual(65.00);
            //        expect(response.amounts[0].text).toEqual("Por un importe de $ 65,00");
            //        expect(response.name).toEqual("Municipio de Hurlingham");
            //    });
            //    it('file discovery Pago mis cuentas Aysa', function () {
            //        var response = textParser.parseFile(pmcAysa);
            //        //console.log(pmcEdenor);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(2);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("05-01-2016");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("01-02-2016");
            //        expect(response.dates[0].text).toEqual("05/01/16 10:13:00 7145");
            //        expect(response.dates[1].text).toEqual("PAGO FACTURA 10734410883 VTO. 01/02/16 COMPROBANTE VALIDO DE PAGO. CONSERVELO.");
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(1);
            //        expect(response.amounts[0].amount).toEqual(26.50);
            //        expect(response.amounts[0].text).toEqual("Por un importe de $ 26,50");
            //        expect(response.name).toEqual("AySA");
            //    });
            //    it('file discovery Pago mis cuentas OSDE', function () {
            //        var response = textParser.parseFile(pmcOSDE);
            //        //console.log(pmcEdenor);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(1);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("05-01-2016");
            //        expect(response.dates[0].text).toEqual("05/01/16 10:13:00 0474");
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(1);
            //        expect(response.amounts[0].amount).toEqual(3172.40);
            //        expect(response.amounts[0].text).toEqual("Por un importe de $ 3172,40");
            //        expect(response.name).toEqual("OSDE");
            //    });
            //    it('file discovery fibertel factura 1', function () {
            //        var response = textParser.parseFile(factFibertel1);
            //        //console.log(factPersonal1);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(11);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("09-11-2015");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("16-10-2015");
            //        expect(moment(response.dates[2].date).format("DD-MM-YYYY")).toEqual("27-04-2011");
            //        expect(moment(response.dates[3].date).format("DD-MM-YYYY")).toEqual("18-10-2015");
            //        expect(moment(response.dates[4].date).format("DD-MM-YYYY")).toEqual("28-10-2015");
            //        expect(moment(response.dates[5].date).format("DD-MM-YYYY")).toEqual("16-11-2015");
            //        expect(moment(response.dates[6].date).format("DD-MM-YYYY")).toEqual("16-11-2015");
            //        expect(moment(response.dates[7].date).format("DD-MM-YYYY")).toEqual("09-11-2015");
            //        expect(moment(response.dates[8].date).format("DD-MM-YYYY")).toEqual("16-11-2015");
            //        expect(moment(response.dates[9].date).format("DD-MM-YYYY")).toEqual("09-11-2015");
            //        expect(moment(response.dates[10].date).format("DD-MM-YYYY")).toEqual("09-11-2015");
            //
            //        expect(response.dates[0].text).toEqual("09-11-2015");
            //        expect(response.dates[1].text).toEqual('16-10-2015');
            //        expect(response.dates[2].text).toEqual("FECHA: 18-10-2015 C.U.I.T.:30573652084 Ing. Brutos: C.M.:901-180042-9 Inicio de actividades 27/04/2011 Codigo N° 06 LEONARDO FLORES");
            //        expect(response.dates[3].text).toEqual("Debito Automatico 18-10-2015 SANTA FE 951 3 B");
            //        expect(response.dates[4].text).toEqual("CAE Nro.: 65424083224477 Fecha Vto.: 28-10-2015");
            //        expect(response.dates[5].text).toEqual("16-11-2015");
            //        expect(response.dates[6].text).toEqual("0000003091031475 16-11-2015 **********");
            //        expect(response.dates[7].text).toEqual("09-11-2015");
            //        expect(response.dates[8].text).toEqual('16-11-2015');
            //        expect(response.dates[9].text).toEqual("0000003091031475 09-11-2015 **********");
            //        expect(response.dates[10].text).toEqual("09-11-2015");
            //
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(4);
            //
            //        expect(response.amounts[0].amount).toEqual(-482.00);
            //        expect(response.amounts[1].amount).toEqual(0);
            //        expect(response.amounts[2].amount).toEqual(482.00);
            //        expect(response.amounts[3].amount).toEqual(482);
            //
            //        expect(response.amounts[0].text).toEqual("Saldo Inicial 482,00 Su Pago -482,00 1022-25857848");
            //        expect(response.amounts[1].text).toEqual("Factura B-1022-25857848 482,00 Saldo Final 0,00 B");
            //        expect(response.amounts[2].text).toEqual("Fibertel 6 Megas 11-2015 482,00 Servicios Banda Ancha (SBA) Subtotal 482,00\n482,00");
            //        expect(response.amounts[3].text).toEqual("3057365208402102265424083224477201510283\n$482,00");
            //        expect(response.name).toEqual("Fibertel");
            //    });
            //    it('file discovery fibertel factura 2', function () {
            //        var response = textParser.parseFile(factFibertel2);
            //        //console.log(factPersonal1);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(11);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("07-08-2015");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("17-07-2015");
            //        expect(moment(response.dates[2].date).format("DD-MM-YYYY")).toEqual("27-04-2011");
            //        expect(moment(response.dates[3].date).format("DD-MM-YYYY")).toEqual("19-07-2015");
            //        expect(moment(response.dates[4].date).format("DD-MM-YYYY")).toEqual("29-07-2015");
            //        expect(moment(response.dates[5].date).format("DD-MM-YYYY")).toEqual("14-08-2015");
            //        expect(moment(response.dates[6].date).format("DD-MM-YYYY")).toEqual("14-08-2015");
            //        expect(moment(response.dates[7].date).format("DD-MM-YYYY")).toEqual("07-08-2015");
            //        expect(moment(response.dates[8].date).format("DD-MM-YYYY")).toEqual("14-08-2015");
            //        expect(moment(response.dates[9].date).format("DD-MM-YYYY")).toEqual("07-08-2015");
            //        expect(moment(response.dates[10].date).format("DD-MM-YYYY")).toEqual("07-08-2015");
            //
            //        expect(response.dates[0].text).toEqual("07-08-2015");
            //        expect(response.dates[1].text).toEqual('17-07-2015');
            //        expect(response.dates[2].text).toEqual("FECHA: 19-07-2015 C.U.I.T.:30573652084 Ing. Brutos: C.M.:901-180042-9 Inicio de actividades 27/04/2011 Codigo N° 06 LEONARDO FLORES");
            //        expect(response.dates[3].text).toEqual("Debito Automatico 19-07-2015 SANTA FE 951 3 B");
            //        expect(response.dates[4].text).toEqual("CAE Nro.: 65294964942385 Fecha Vto.: 29-07-2015");
            //        expect(response.dates[5].text).toEqual("14-08-2015");
            //        expect(response.dates[6].text).toEqual("0000003091031475 14-08-2015 **********");
            //        expect(response.dates[7].text).toEqual("07-08-2015");
            //        expect(response.dates[8].text).toEqual('14-08-2015');
            //        expect(response.dates[9].text).toEqual("0000003091031475 07-08-2015 **********");
            //        expect(response.dates[10].text).toEqual("07-08-2015");
            //
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(4);
            //
            //        expect(response.amounts[0].amount).toEqual(-313.31);
            //        expect(response.amounts[1].amount).toEqual(0);
            //        expect(response.amounts[2].amount).toEqual(313.31);
            //
            //        expect(response.amounts[0].text).toEqual("Saldo Inicial 313,31 Su Pago -313,31 1022-15304220");
            //        expect(response.amounts[1].text).toEqual("Factura B-1022-15304220 313,31 Saldo Final 0,00 B");
            //        expect(response.amounts[2].text).toEqual("Fibertel 6 Megas 08-2015 482,00 Promoción Fibertel 6 Megas Mes 5 de 6 6 MESES AL 35% -168,69 Servicios Banda Ancha (SBA) Subtotal 313,31\n313,31");
            //
            //        expect(response.name).toEqual("Fibertel");
            //    });
            //    it('file discovery Pago mis cuentas Gas Natural', function () {
            //        var response = textParser.parseFile(pmcGasNatural);
            //        //console.log(pmcEdenor);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(1);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("05-07-2015");
            //        expect(response.dates[0].text).toEqual("05/07/15 10:43:54 2321");
            //
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(1);
            //        expect(response.amounts[0].amount).toEqual(29.03);
            //        expect(response.amounts[0].text).toEqual("Por un importe de $ 29,03");
            //
            //        expect(response.name).toEqual("Gas Natural Fenosa");
            //    });
            //    //
            //    //    it('file discovery test search personal origins', function () {
            //    //        var response = textParser.origins("person");
            //    //        //console.log(pmcVictoria);
            //    //        expect(response).not.toEqual(null);
            //    //        expect(response.length).toEqual(1);
            //    //        expect(response[0]).toEqual("Personal");
            //    //    });
            //    //
            //    //        it('file discovery test search hurlingham origins', function () {
            //    //            var response = textParser.origins("hurli");
            //    //            //console.log(pmcVictoria);
            //    //            expect(response).not.toEqual(null);
            //    //            expect(response.length).toEqual(1);
            //    //            expect(response[0]).toEqual("Municipio de Hurlingham");
            //    //        });
            //    it('file discovery OSDE factura digital 1', function () {
            //        var response = textParser.parseFile(factOSDE1);
            //        //console.log(factPersonal1);
            //        expect(response.dates).not.toEqual(null);
            //        expect(response.dates.length).toEqual(6);
            //        expect(moment(response.dates[0].date).format("DD-MM-YYYY")).toEqual("27-03-2017");
            //        expect(moment(response.dates[1].date).format("DD-MM-YYYY")).toEqual("14-03-2017");
            //        expect(moment(response.dates[2].date).format("DD-MM-YYYY")).toEqual("27-03-2017");
            //        expect(moment(response.dates[3].date).format("DD-MM-YYYY")).toEqual("27-03-2017");
            //        expect(moment(response.dates[4].date).format("DD-MM-YYYY")).toEqual("14-03-2017");
            //        expect(moment(response.dates[5].date).format("DD-MM-YYYY")).toEqual("14-03-2017");
            //
            //
            //        expect(response.dates[0].text).toEqual("Talón para ser utilizado hasta el 27.03.2017 150036259302");
            //        expect(response.dates[1].text).toEqual('Vencimiento: 14.03.2017');
            //        expect(response.dates[2].text).toEqual("Talón para ser utilizado hasta el 27.03.2017");
            //        expect(response.dates[3].text).toEqual("27.03.2017");
            //        expect(response.dates[4].text).toEqual("Id.Emisión: 6011701290432080 Vencimiento 14.03.2017 Id.Emisión: 6011701290432080");
            //        expect(response.dates[5].text).toEqual("Vencimiento 14.03.2017");
            //
            //        //Test detected prices
            //        expect(response.amounts).not.toEqual(null);
            //        expect(response.amounts.length).toEqual(3);
            //
            //        expect(response.amounts[0].amount).toEqual(3969.26);
            //        expect(response.amounts[1].amount).toEqual(3969.26);
            //        expect(response.amounts[2].amount).toEqual(3969.26);
            //
            //        expect(response.amounts[0].text).toEqual("IMPORTE $ 3.969,26");
            //        expect(response.amounts[1].text).toEqual("01/2017 IMPORTE $ 3.969,26 01/2017");
            //        expect(response.amounts[2].text).toEqual("IMPORTE $ 3.969,26");
            //
            //        expect(response.name).toEqual("OSDE");
            //    });
});
