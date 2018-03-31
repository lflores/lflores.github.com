'use strict';

angular.module('e-invoice.services')
    .service('textDiscovery', ['$window', 'GApi', "appConfig", "$q", function ($window, GApi, appConfig, $q) {
        var lang = $window.navigator.language || $window.navigator.userLanguage;
        lang = lang.split("-")[0];
        var svr = this;

        //moment.locale(lang);
        moment.locale("es");
        numeral.locale("es");

        this.origins = function (search) {
            if (!search || search.length === 0) {
                return appConfig.getAppConfig().names;
            }
            var names = appConfig.getAppConfig().names.filter(function (item, i) {
                if (item.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            });
            return names;
        };

        this.createOrigin = function (origin) {
            var deferred = $q.defer();
            appConfig.getAppConfig().names.push(origin);
            appConfig.saveConfig().then(
                function (config) {
                    deferred.resolve(config);
                },
                function (err) {
                    deferred.reject(err);
                });
            return deferred.promise;
        };

        /**
        Copia un archivo a un documento de de google office
        */
        this.fileCopy = function (fileId) {
            var deferred = $q.defer();
            GApi.executeAuth('drive', 'files.copy', {
                fileId: fileId,
                mimeType: 'application/vnd.google-apps.document',
                convert: true,
                ocr: true,
                ocrLanguage: lang
            }).then(function (result) {
                deferred.resolve(result.id);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };
        /**
            Exporta un archivo de office a un texto plano
            */
        this.fileExport = function (fileId) {
            var deferred = $q.defer();
            svr.fileCopy(fileId).then(function (fileId) {
                gapi.client.drive.files.export({
                    'fileId': fileId,
                    'mimeType': 'text/plain'
                }).then(function (success) {
                    deferred.resolve(success);
                    svr.fileRemove(fileId);
                }, function (fail) {
                    deferred.reject(fail);
                });
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.fileRemove = function (fileId) {
            var deferred = $q.defer();
            GApi.executeAuth('drive', 'files.delete', {
                fileId: fileId
            }).then(function (result) {
                deferred.resolve(result.id);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        this.fileMatches = function (fileId) {
            var deferred = $q.defer();
            svr.fileExport(fileId).then(function (text) {
                deferred.resolve(svr.parseFile(text.body));
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        };

        //var dateRegex = /([^\n\d\-\s\,][\w\s\Í\:\.]*(\d{2}\/\d{2}\/\d{2,4}))[^\d]/g;
        //var dateLineRegex = /^.*(\d{2}[\/-]\d{2}[\/-]\d{2,4}).*$/gm
        var dateLineRegex = /^.*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4}).*$/gm;
        var hora = /\d{2}:\d{2}:\d{2}/g;
        var amountRegex = /^.*([\s|\$|\-]\d+[,|.]\d+).*$/gm;
        var config = appConfig.getAppConfig();

        //3- Finalmente tengo que parsear el texto para ofrecer las coincidencias
        //this.parseFile = function (fileId, then) {
        this.parseFile = function (text) {
            var obj = {
                dates: [],
                amounts: [],
                names: []
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
                if (m.index === amountRegex.lastIndex) {
                    amountRegex.lastIndex++;
                }

                obj.amounts.push({
                    amount: numeral(m[1].trim()).value(),
                    text: m[0]
                });
            }

            for (var i = 0; i < config.names.length; i++) {
                var nameRegex = new RegExp("^.*(" + config.names[i] + ").*$", "gm");
                m = nameRegex.exec(text);
                if (m != null) {
                    obj.names.push({
                        name: m[1],
                        text: m[0]
                    });
                }
            }
            return obj;
        };
    }]);
