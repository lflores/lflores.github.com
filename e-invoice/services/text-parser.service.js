'use strict';



angular.module('e-invoice.services')
    .service('textParser', ['$window', function ($window) {
        //var dateRegex = /([^\n\d\-\s\,][\w\s\Í\:\.]*(\d{2}\/\d{2}\/\d{2,4}))[^\d]/g;
        //var dateLineRegex = /^.*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}).*$/gm
        var dateLineRegex = /^.*(\d{2}[\/|\-|\.]\d{2}[\/|\-|\.]\d{2,4}).*$/gm
        //var dateRegex = /.*(\d{2}[\/-]\d{2}[\/-]\d{2,4}).*/g
        var hora = /\d{2}:\d{2}:\d{2}/g;
        var amountRegex1 = /^.*([\s|\$|\-]\d+[,|.]\d+).*$/gm;
        var amountRegex = /^.*\s*([\s|\$|\-]\d*.\d*[,]\d*).*$/gm;

        this.names = [
            "Fibertel", "Edenor", "AySA", "Personal", "Municipio de Hurlingham", "OSDE", "Plan Rombo", "Movistar", "Gas Natural Fenosa", "Victoria Seguros", "Inst. Cristo Obrero"
        ]

        //3- Finalmente tengo que parsear el texto para ofrecer las coincidencias
        //this.parseFile = function (fileId, then) {
        this.parseFile = function (text) {
            var obj = {
                dates: [],
                amounts: []
            };
            //busco fechas primero 
            var m;
            while ((m = dateLineRegex.exec(text)) !== null) {
                if (m.index === dateLineRegex.lastIndex) {
                    dateLineRegex.lastIndex++;
                }

                obj.dates.push({
                    date: moment(m[1], "DDMMYYYY").toDate(),
                    text: m[0]
                });
            }

            while ((m = amountRegex.exec(text)) !== null) {
                if (m.index === dateLineRegex.lastIndex) {
                    dateLineRegex.lastIndex++;
                }

                obj.amounts.push({
                    amount: numeral(m[1].trim()).value(),
                    text: m[0]
                });
            }

            for (var i = 0; i < this.names.length; i++) {
                if (text.indexOf(this.names[i]) > -1) {
                    obj.name = this.names[i];
                }
            }
            return obj;
        }
    }]);
