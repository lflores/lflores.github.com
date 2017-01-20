'use strict';

angular.module('e-invoice.services')
    .service('textDiscovery', ['$window', 'GApi', "appConfigService", function ($window, GApi, appConfigService) {
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        lang = lang.split("-")[0];
        var svr = this;

        //        this.names = [
        //            "Fibertel", "Edenor", "AySA", "Personal", "Municipio de Hurlingham", "OSDE", "Plan Rombo", "Movistar", "Gas Natural Fenosa", "Victoria Seguros", "Inst. Cristo Obrero"
        //        ]

        //moment.locale(lang);
        moment.locale("es");
        numeral.locale("es");

        this.origins = function (search) {
            if (!search || search.length === 0) {
                return appConfigService.getAppConfig().names;
            }
            var names = appConfigService.getAppConfig().names.filter(function (item, i) {
                if (item.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            })
            return names;
        }

        this.createOrigin = function (origin, then) {
            appConfigService.getAppConfig().names.push(origin);
            appConfigService.saveConfig();
            //lo estructuro con then para cuando tenga que guardarlo en otro lado
            if (then) {
                then.apply(svr, [origin]);
            }
        }

        /**
        Copia un archivo a un documento de de google office
        */
        this.fileCopy = function (fileId, then) {
                GApi.executeAuth('drive', 'files.copy', {
                        fileId: fileId,
                        mimeType: 'application/vnd.google-apps.document',
                        convert: true,
                        ocr: true,
                        ocrLanguage: lang
                    })
                    .then(function (result) {
                        if (then) {
                            then.apply(svr, [result.id]);
                        }
                        console.log('anduvo :)');
                    }, function (err) {
                        console.log('error :(' + err);
                    });
            }
            /**
                Exporta un archivo de office a un texto plano
                */
        this.fileExport = function (fileId, then) {
            svr.fileCopy(fileId, function (fileId) {
                gapi.client.drive.files.export({
                    'fileId': fileId,
                    'mimeType': 'text/plain'
                }).then(function (success) {
                    if (then) {
                        then.apply(svr, [success.body])
                    }
                    svr.fileRemove(fileId);
                }, function (fail) {
                    console.log(fail);
                })
            });
        }

        this.fileRemove = function (fileId, then) {
            GApi.executeAuth('drive', 'files.delete', {
                    fileId: fileId
                })
                .then(function (result) {
                    if (then) {
                        then.apply(svr, [result.id]);
                    }
                }, function (err) {
                    console.log('error :(');
                });
        }

        this.fileMatches = function (fileId, then) {
            svr.fileExport(fileId, function (text) {
                if (then) {
                    then.apply(svr, [svr.parseFile(text)]);
                }
            });
        }

        //var dateRegex = /([^\n\d\-\s\,][\w\s\Í\:\.]*(\d{2}\/\d{2}\/\d{2,4}))[^\d]/g;
        var dateLineRegex = /^.*(\d{2}[\/-]\d{2}[\/-]\d{2,4}).*$/gm
            //var dateRegex = /.*(\d{2}[\/-]\d{2}[\/-]\d{2,4}).*/g
        var hora = /\d{2}:\d{2}:\d{2}/g;
        var amountRegex = /^.*([\$]*\s[-]*\d+[,]\d+).*$/gm;

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

            for (var i = 0; i < appConfigService.getAppConfig().names.length; i++) {
                if (text.indexOf(appConfigService.getAppConfig().names[i]) > -1) {
                    obj.name = appConfigService.getAppConfig().names[i];
                }
            }
            return obj;
        }
    }]);
