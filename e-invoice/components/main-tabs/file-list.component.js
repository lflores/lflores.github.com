'use strict';
angular
    .module('e-invoice')
    .filter('groupBy', function () {
        return function (data, key) {
            if (!(data && key)) return;
            var result = {};
            for (var i = 0; i < data.length; i++) {
                var _key = moment(data[i][key]).startOf("day").fromNow();
                if (!result[_key])
                    result[_key] = [];
                result[_key].push(data[i])
            }
            return result;
        };
    }).component('fileList', {
        bindings: {
            data: '=',
            counter: '=',
            grouping: '<',
            type: '@',
            search: '@'
        },
        templateUrl: "components/main-tabs/file-list.tpl.html",
        controller: function ($scope, GAuth, GApi, $mdDialog, appConfigService) {
            $scope.list = [];
            $scope.files = [];
            $scope.nextPageToken = "init";
            $scope.loading = true;

            //Fin test
            var ctrl = this;

            ctrl.counter = {
                loaded: 0,
                hasMore: true,
                filtered: false
            }

            this.$onChanges = function (changesObj) {
                if (changesObj.grouping) {
                    $scope.resetInfiniteItems();
                    ctrl.counter.loaded = $scope.infiniteItems.numLoaded_;
                    ctrl.counter.hasMore = true;
                    $scope.loading = true;
                }
            }

            $scope.groups = {};

            $scope.actions = {
                delete: {},
                visibility: {},
                starred: {},
                infolder: {},
                export: {},
                upload: {},
                remove: {}
            };

            $scope.indexGroups = function (data, key) {
                if (!(data && key)) return;
                for (var i = 0; i < data.length; i++) {
                    var _key = moment(data[i][key]).startOf("day").fromNow();
                    if (!$scope.groups[_key])
                        $scope.groups[_key] = [];
                    $scope.groups[_key].push(data[i])
                }
            }

            $scope.groupBy = moment().startOf("day").fromNow();

            ctrl.type = 'inbox';

            $scope.hasMoreItems = function () {
                return ctrl.counter.hasMore;
            }

            $scope.toDay = function (history) {
                if (history === 0)
                    return;
                history.day = moment(history.createdTime).startOf("day").fromNow();
                return history;
            }


            $scope.infiniteItems = {
                numLoaded_: 0,
                toLoad_: 0,
                length: 200,
                list: [],
                // Required.
                getItemAtIndex: function (index) {
                    if (!appConfigService.getAppConfig() || !appConfigService.folderId) {
                        return null;
                    }
                    if (index > this.numLoaded_) {
                        this.fetchMoreItems_(index);
                        return null;
                    }
                    //return $scope.list[index];
                    return $scope.list[index];
                },

                // Required.
                // For infinite scroll behavior, we always return a slightly higher
                // number than the previously loaded items.
                getLength: function () {
                    return this.numLoaded_ + 4;
                },

                fetchMoreItems_: function (index) {
                    // For demo purposes, we simulate loading more items with a timed
                    // promise. In real code, this function would likely contain an
                    // $http request.
                    if (this.toLoad_ < index) {
                        this.toLoad_ += this.length;
                        var _query = "";
                        _query += "'me' in owners";
                        _query += " and mimeType != 'application/vnd.google-apps.folder'";

                        if (ctrl.type === 'trashed') {
                            _query += " and trashed = true";
                        } else {
                            _query += " and trashed = false";
                        }
                        switch (ctrl.type) {
                            case 'inbox':
                                for (var i = 0; i < appConfigService.folders.length; i++) {
                                    _query += " and not '" + appConfigService.folders[i] + "' in parents"
                                }
                                //_query += " and not '" + appConfigService.folderId + "' in parents";
                                //_query += " and not appProperties has {key='status' and value=''}";
                                _query += " and not appProperties has {key='status' and value='invisible'}";
                                _query += " and not appProperties has {key='status' and value='archived'}";
                                //_query += " and not appProperties has {key='status' and value='classified'}";
                                break;
                            case 'starred':
                                _query += " and not appProperties has {key='status' and value='invisible'}";
                                _query += " and starred = true";
                                break;
                            case 'invisible':
                                _query += " and appProperties has {key='status' and value='invisible'}";
                                break;
                            case 'classified':
                                //_query += " and appProperties has {key='status' and value='classified'}";
                                _query += " and not appProperties has {key='status' and value='invisible'}";
                                //_query += " and appProperties has {key='type' and value=''}";
                                _query += " and ( appProperties has {key='type' and value='invoice'} or";
                                _query += " appProperties has {key='type' and value='receipt'})";
                                //_query += " and ( appProperties has {key='type' and value='true'} or ";
                                //_query += " appProperties has {key='type' and value='false'} )";
                                break;
                            case 'archived':
                                //_query += " and not appProperties has {key='status' and value='invisible'}";
                                //_query += " and appProperties/status and appProperties/status != ''";
                                _query += " and appProperties has {key='status' and value='archived'}";
                                //_query += " and '" + appConfigService.folderId + "' in parents";
                                for (var i = 0; i < appConfigService.folders.length; i++) {
                                    if (appConfigService.folders.length == 1) {
                                        _query += " and '" + appConfigService.folderId + "' in parents";
                                    } else {
                                        _query += " and ('";
                                        _query += appConfigService.folders.join("' in parents or '");
                                        _query += "' in parents)";
                                    }
                                }
                                break;
                        }

                        if ($scope._searchText) {
                            _query += " and fullText contains '" + $scope._searchText + "'";
                            // _query += " and title contains '" + $scope._searchText + "'";

                        }

                        var params = {
                            'pageSize': this.length,
                            'orderBy': $scope._searchText == null ? "modifiedTime desc" : null,
                            'fields': "nextPageToken, files(id,name,createdTime,iconLink,thumbnailLink,properties,appProperties,starred,owners,trashed,parents)",
                            'q': _query
                        };

                        if (typeof $scope.nextPageToken != 'undefined' && $scope.nextPageToken != 'init') {
                            params.pageToken = $scope.nextPageToken;
                        } else if (typeof $scope.nextPageToken == 'undefined') {
                            return null;
                        }
                        //Valido si está logueado

                        GApi.executeAuth('drive', 'files.list', params)
                            .then(function (_this) {
                                return function (resp) {
                                    _this.list = _this.list.concat(resp.files);
                                    $scope.list = $scope.list.concat(resp.files);

                                    if (ctrl.type === "archived" || ctrl.type === "classified") {
                                        var groups = d3.nest()
                                            .key(function (d) {
                                                if (!d.appProperties || !d.appProperties[ctrl.grouping]) {
                                                    return d.name;
                                                }
                                                if (ctrl.grouping === "filename") {

                                                }
                                                if (ctrl.grouping === "expirationDate") {
                                                    return new Date(d.appProperties[ctrl.grouping]).getFullYear();
                                                }
                                                return d.appProperties[ctrl.grouping];
                                            }).sortKeys(d3.descending)
                                            .sortValues(d3.descending)
                                            .entries(_this.list);
                                        var flattened = groups.flattened();
                                        //console.log(flattened.print());
                                        $scope.list = flattened;
                                        //_this.list = groups;
                                    }
                                    $scope.nextPageToken = resp.nextPageToken;
                                    //                                    $scope.indexGroups(resp.files, "createdTime");
                                    _this.numLoaded_ += resp.files.length;
                                    $scope.loading = typeof resp.nextPageToken != 'undefined';
                                    ctrl.counter.loaded = _this.numLoaded_;
                                    ctrl.counter.hasMore = $scope.loading;
                                }
                            }(this), function () {
                                console.log('error :(');
                            });
                    }
                }
            };

            $scope.$on("searchText", function (evt, searchText) {
                $scope._searchText = typeof searchText === 'undefined' || searchText === '' ? null : searchText;
                $scope.resetInfiniteItems();
                $scope.loading = true;
                ctrl.counter.loaded = 0;
                ctrl.counter.hasMore = true;
                ctrl.counter.filtered = $scope._searchText ? true : false;
                ctrl.data = null;
            });

            $scope.resetInfiniteItems = function () {
                $scope.infiniteItems.numLoaded_ = 0;
                $scope.infiniteItems.toLoad_ = 0;
                $scope.infiniteItems.length = 200;
                $scope.infiniteItems.list = [];
                $scope.list = [];
                $scope.nextPageToken = "init";
            };

            $scope.select = function (file) {
                ctrl.data = file;
            }

            $scope.refresh = function () {
                //$scope.infiniteItems.getItemAtIndex(20);
            }

            $scope.$on("start-app", function () {
                $scope.refresh();
            });

            $scope.$on("file-updated", function (event, fileU) {
                var index = -1;
                $scope.infiniteItems.list.filter(function (file, i) {
                    if (fileU.id === file.id) {
                        index = i;
                        return true;
                    }
                    return false;
                });
                $scope.infiniteItems.list[index].appProperties = fileU.appProperties;
                //ctrl.data = fileU;
            });

            $scope.$on("files-added", function (event, files) {
                $scope.resetInfiniteItems();
                $scope.loading = true;
                ctrl.counter.loaded = 0;
                ctrl.counter.hasMore = true;
                ctrl.counter.filtered = false;
                ctrl.data = null;
            });

            $scope.$on("file-removed", function (event, fileId) {
                $scope.actions.remove.action(fileId);
            });

            $scope.actions.visibility.icon = function (file) {
                if (!file) {
                    return;
                }
                if (file.appProperties && file.appProperties.status === 'invisible') {
                    return "visibility"
                }
                return "visibility_off";

            }

            $scope.actions.visibility.tooltip = function (file) {
                if (!file) {
                    return;
                }
                if (file.appProperties && file.appProperties.status === 'invisible') {
                    return "Make visible"
                }
                return "Make invisible";
            }

            $scope.actions.visibility.action = function (file, evt) {
                if (file.appProperties && file.appProperties.status === 'invisible') {
                    //hacerlo visible
                    GApi.executeAuth('drive', 'files.update', {
                        fileId: file.id,
                        appProperties: {
                            status: null
                        }
                    }).then(function (result) {
                        $scope.actions.remove.action(result.id);
                    }, function (err) {

                    });
                    return;
                }
                var confirm = $mdDialog.confirm({
                    controller: VisibilityController,
                    templateUrl: 'components/dialogs/visibility-off.tpl.html',
                    parent: angular.element(document.body)
                })

                $mdDialog.show(confirm).then(function (message) {
                    //si estoy mostrando el detalle lo cierro
                    $scope.detail = null;
                    GApi.executeAuth('drive', 'files.update', {
                        fileId: file.id,
                        appProperties: {
                            status: file && file.appProperties && file.appProperties.status === "invisible" ? null : "invisible"
                        }
                    }).then(function (result) {
                        $scope.list = $scope.list.filter(function (item) {
                            return item.id !== file.id;
                        });
                        ctrl.counter.loaded--;
                        ctrl.data = null;
                    }, function (err) {

                    });
                }, function () {
                    //$scope.status = 'You decided to keep your debt.';
                });
            };

            $scope.actions.delete.icon = function (file) {
                if (!file) {
                    return "";
                }
                if (file.trashed) {
                    return "delete_forever";
                }
                return "delete"
            }

            $scope.actions.delete.tooltip = function (file) {
                if (!file) {
                    return "";
                }
                if (file.trashed) {
                    return "Delete forever";
                }
                return "Move to trash can";
            }

            $scope.actions.delete.action = function (file, evt) {
                if (file.trashed) {
                    //borrar definitivamente
                    var confirm = $mdDialog.confirm({
                        controller: VisibilityController,
                        templateUrl: 'components/dialogs/delete-forever-dialog.tpl.html',
                        parent: angular.element(document.body)
                    })
                    $mdDialog.show(confirm).then(function (message) {
                        GApi.executeAuth('drive', 'files.delete', {
                            fileId: file.id
                        }).then(function (result) {
                            $scope.actions.remove.action(result.id);
                        }, function (err) {
                            console.log("Error :(");
                        });
                    }, function () {
                        //$scope.status = 'You decided to keep your debt.';
                    });
                    return;
                }

                var confirm = $mdDialog.confirm({
                    controller: VisibilityController,
                    templateUrl: 'components/dialogs/delete-dialog.tpl.html',
                    parent: angular.element(document.body)
                })

                $mdDialog.show(confirm).then(function (message) {
                    //$scope.status = 'You decided to get rid of your debt.';
                    //console.log(message);
                    GApi.executeAuth('drive', 'files.update', {
                        fileId: file.id,
                        trashed: true
                    }).then(function (result) {
                        $scope.actions.remove.action(result.id);
                    }, function (err) {
                        console.log("Error :(");
                    });
                }, function () {
                    //$scope.status = 'You decided to keep your debt.';
                });
            };

            $scope.actions.export.icon = function (file) {
                if (!file) {
                    return "";
                }
                return "file_download"
            }

            $scope.actions.export.tooltip = function (file) {
                if (!file) {
                    return "";
                }
                //El tooltip podría cambiar según por lo que esté agrupado
                return "Export year as zip";
            }

            $scope.actions.export.action = function (file, evt) {
                //para desarrollar
            };

            $scope.actions.infolder.icon = function (file) {
                if (!file) {
                    return "";
                }

                if (appConfigService.isInFolders(file.parents)) {
                    return "unarchived";
                }
                return "archived";
            }

            $scope.actions.infolder.tooltip = function (file) {
                if (!file) {
                    return "";
                }
                if (appConfigService.isInFolders(file.parents)) {
                    return "Unarchive";
                }
                if (!file.appProperties || !file.appProperties.expirationDate) {
                    return "Feed it with data first"
                }
                return "Archive";
            }

            $scope.actions.infolder.disabled = function (file) {
                if (!file) {
                    return true;
                }
                if (ctrl.type === "archived") {
                    return false;
                }
                if (file.appProperties && file.appProperties.expirationDate) {
                    return false;
                }
                return true;
            }

            /**
            Funcion que cambia el estado del archivo
            * Si está en el inbox lo archiva
            * Si está archivado, lo vuelve al inbox
            */
            $scope.actions.infolder.action = function (file, evt) {
                var params = {
                    fileId: file.id
                };

                if (ctrl.type === "archived") {
                    params.removeParents = appConfigService.folders.join(",");
                    params.addParents = appConfigService.folderId;
                    //params.removeParents += ",root";

                    params.appProperties = {
                        status: null
                    };
                    GApi.executeAuth('drive', 'files.update', params).then(function (result) {
                        $scope.actions.remove.action(result.id);
                    }, function (err) {
                        console.log("Error :(");
                    });
                } else {
                    //tengo que ver a que carpeta corresponde, si la default o una de archivados
                    appConfigService.folder(new Date(file.appProperties.expirationDate).getFullYear(), function (folderId) {
                        params.removeParents = appConfigService.folderId;
                        params.addParents = folderId;
                        params.appProperties = {
                            status: "archived"
                        }
                        GApi.executeAuth('drive', 'files.update', params).then(function (result) {
                            $scope.actions.remove.action(result.id);
                        }, function (err) {
                            console.log("Error :(");
                        });
                    });
                }
            };

            $scope.actions.starred.icon = function (file, evt) {
                if (!file) {
                    return "";
                }
                if (file.starred) {
                    return "favorite";
                }
                return "favorite_border"
            }

            $scope.actions.starred.tooltip = function (file, evt) {
                if (!file) {
                    return "";
                }
                if (file.starred) {
                    return "Unmark as favorite";
                }
                return "Mark as favorite"
            }

            $scope.actions.starred.action = function (file, evt) {
                GApi.executeAuth('drive', 'files.update', {
                    fileId: file.id,
                    starred: !file.starred
                }).then(function (result) {
                    file.starred = !file.starred;
                    //Si es la vista de starred, lo elimino de la lista
                    if (ctrl.type === "starred") {
                        $scope.actions.remove.action(result.id);
                    }
                }, function (err) {
                    console.log("Error :(");
                });
            };
            /**
            Este metodo remueve un item según el fileId y actualiza los items cargados 
            */
            $scope.actions.remove.action = function (fileId) {
                var index = -1;
                $scope.list.filter(function (item, i) {
                    if (item.id === fileId) {
                        index = i;
                        return false;
                    }
                    return true;
                });
                if (index > -1) {
                    $scope.list.splice(index, 1);
                    ctrl.counter.loaded--;
                    $scope.infiniteItems.numLoaded_--;
                }

                if ($scope.list.length > index) {
                    ctrl.data = $scope.list[index];
                } else if (index >= $scope.list.length && $scope.list.length > 0) {
                    ctrl.data = $scope.list[$scope.list.length - 1];
                } else {
                    ctrl.data = null;
                }
            };
        }
    });
