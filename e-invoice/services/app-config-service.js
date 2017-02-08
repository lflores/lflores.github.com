'use strict';

//angular.module('e-invoice.services', ['ngRoute'])
//    .service('appConfigService', ['$window', 'GApi', function ($window, GApi) {
//
//    }]);
var defaultConfig = {
    "folder": "Pagos",
    "dateFormat": "DD/MM/YYYY",
    "language": "en",
    "names": ["Fibertel", "Edenor", "AySA", "Personal", "Municipio de Hurlingham", "OSDE", "Plan Rombo", "Movistar", "Gas Natural Fenosa", "Victoria Seguros", "Inst. Cristo Obrero"]
};


angular.module('e-invoice.services')
    .factory("appConfigService", ['GAuth', 'GApi', '$rootScope', function (GAuth, GApi, $rootScope) {
        var appData = gdad('config.json', '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com');
        return {
            appConfig: null,
            folders: [],
            getAppConfig: function () {
                return this.appConfig;
            },
            setAppConfig: function (appConfig) {
                this.appConfig = angular.merge(appConfig, defaultConfig);
            },
            loadConfig: function () {
                var _this = this;
                var params = {
                    _spaces: 'appDataFolder',
                    fields: 'nextPageToken, files(id, name)',
                    _q: "'appDataFolder' in parents"
                }

                appData.read().then(function (data) {
                        // do something with data here
                        //console.log(data);
                        if (!data) {
                            appData.save(defaultConfig).then(function (data) {
                                _this.setAppConfig(defaultConfig);
                                _this.loadFolders();
                            }, function (err) {
                                console.log("Error guardando la configuración");
                            });
                        } else {
                            _this.setAppConfig(data);
                            _this.loadFolders();
                        }
                    },
                    function () {
                        console.log("No me pude conectar");
                    });
            },
            saveConfig: function () {
                appData.save(this.appConfig).then(function (data) {
                    console.log("updateSuccessful!!");
                });
            },
            loadFolders: function () {
                var _this = this;
                var _q = "mimeType = 'application/vnd.google-apps.folder'";
                _q += " and name = '" + _this.getAppConfig().folder + "'";

                var params = {
                    q: _q
                }
                GApi.execute('drive', 'files.list', params).then(function (resp) {
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
                            //_this.folders.push(_this.folderId);
                            _this.appConfig.folders = _this.folders;
                            $rootScope.$broadcast("start-app");
                        }, function () {
                            console.log('error :(');
                        });
                        //$rootScope.$broadcast('start-app');
                    }
                }, function () {
                    console.log('error :(');
                });
            },

            isInFolders: function (parents) {
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
            },

            folder: function (folderName, then) {
                var _this = this;
                var params = {
                    q: "mimeType = 'application/vnd.google-apps.folder' and name='" + folderName + "' and '" + _this.folderId + "' in parents and trashed=false"
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
            }
        }
            }]);
