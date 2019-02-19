'use strict';

//angular.module('e-invoice.services', ['ngRoute'])
//    .service('appConfig', ['$window', 'GApi', function ($window, GApi) {
//
//    }]);
var defaultConfig = {
    "folder": "Pagos",
    "dateFormat": "DD/MM/YYYY",
    "language": "en",
    "names": ["Fibertel", "Edenor", "AySA", "Personal", "Municipio de Hurlingham", "OSDE", "Plan Rombo", "Movistar", "Gas Natural Fenosa", "Victoria Seguros", "Inst. Cristo Obrero", "Telefónica", "ARBA Automotor", "ARBA Inmobiliario", "Cablevisión"]
};
angular.module('e-invoice.services')
    .service("appConfig",function (GAuth, GApi, $rootScope, $q) {
        return {
            getAppConfig: getAppConfig,
            loadFolders: loadFolders,
            isInFolders: isInFolders,
            folder: folder,
            saveConfig: saveConfig
        }

        function getAppConfig() {
            var _this = this;
            var defered = $q.defer();
            if (_this.appConfig) {
                setTimeout(function(){
                    defered.resolve(_this.appConfig);
                },1000);
                return defered.promise;
            }
            var appData = gdad('config.json', '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com');
            appData.read().then(function (data) {
                if (!data) {
                    appData.save(defaultConfig).then(function (data) {
                        _this.appConfig = data;
                        _this.loadFolders().then(
                            function(folders){
                                _this.folders = folders;
                                defered.resolve(_this);
                                _this.appStarted = true;
                            }, function (err) {
                                defered.reject(err);
                            })
                    });
                }
                                                     
                _this.appConfig = data;
                _this.loadFolders()
                    .then(function(folders){
                        _this.folders = folders;
                        _this.appStarted = true;
                        defered.resolve(_this);
                    }, function (err) {
                        defered.reject(err);
                    });
            }, function (err) {
                defered.reject(err);
            });
            return defered.promise;
        }

        function setAppConfig(appConfig) {
            var _this = this;
            this.appConfig = angular.merge(appConfig, defaultConfig);
            appData.save(appConfig).then(function (config) {
                _this.appConfig = config;
            }, function (err) {
                console.log(err);
            });
        }

        function loadFolders() {
            var _this = this;
            var defered = $q.defer();
            var _q = "mimeType = 'application/vnd.google-apps.folder'";
            _q += " and name = '" + _this.appConfig.folder + "'";
            GApi.execute('drive', 'files.list', {
                q: _q
            }).then(function (resp) {
                if (resp.files.length === 1) {
                    _this.folderId = resp.files[0].id;
                    //tengo que ver dentro de pagos las carpetas que hay
                    var _subf = "mimeType = 'application/vnd.google-apps.folder'";
                    _subf += " and '" + resp.files[0].id + "' in parents and trashed=false";
                    GApi.execute('drive', 'files.list', {
                        q: _subf
                    }).then(function (resp) {
                        _this.folders = [];
                        for (var i = 0; i < resp.files.length; i++) {
                            _this.folders.push(resp.files[i].id);
                        }
                        defered.resolve(_this.folders);
                    }, function () {
                        //console.log('error :(');
                        defered.reject("Error obteniendo las carpetas");
                    });
                }
                //defered.reject("Error");
            }, function () {
                console.log('Error listando las carpetas');
            });
            return defered.promise;
        }

        function isInFolders(parents) {
            if (!parents || parents.length == 0) {
                return false;
            }
            var foldersId = this.folders.join(" ");
            for (var i = 0; i < parents.length; i++) {
                if (foldersId.indexOf(parents[i]) > -1) {
                    return true;
                }
            }
            return false;
        };

        function folder(folderName, then) {
            var _this = this;
            var _q = "mimeType = 'application/vnd.google-apps.folder' and name='" + folderName+"'";
            _q += " and '" + _this.folderId + "' in parents";
            _q += " and trashed=false";

            var params = {
                //q: "mimeType = 'application/vnd.google-apps.folder' and name='" + folderName + " and trashed=false"
                q: _q
            }
            GApi.execute('drive', 'files.list', params).then(function (resp) {
                if (resp.files.length === 1 && then) {
                    then.apply(_this, [resp.files[0].id]);
                    return;
                }

                GApi.execute('drive', 'files.generateIds', {
                    count: 1
                }).then(function (resp) {
                    GApi.execute('drive', 'files.create', {
                        mimeType: "application/vnd.google-apps.folder",
                        parents: [_this.folderId],
                        name: folderName,
                        id: resp.ids[0]
                    }).then(function (resp) {
                        //Tengo que agregarla a la lista de carpetas
                        _this.folders.push(resp.id);
                        then.apply(_this, [resp.id]);
                    });
                });

            }, function () {
                console.log('error :(');
            });
        };

        function saveConfig() {
            var deferred = $q.defer();
            var appData = gdad('config.json', '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com');
            appData.save(this.appConfig).then(function (data) {
                deferred.resolve(data);
            }, function (err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    });
