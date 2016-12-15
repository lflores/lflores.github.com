'use strict';

angular
    .module('e-invoice')
    .component('inbox', {
        templateUrl: 'components/main-tabs/inbox.tpl.html',
        controller: function ($scope, $element, GAuth, GApi, $mdDialog) {
            $scope.tags = [];
            $scope.keys = [186]
            $scope.showDetail = false;
            $scope.fileId = null;

            $scope.$on("toggleDetail", function (evt, show) {
                $scope.showDetail = show;
            });

            $scope.refresh = function () {
                $scope.list = [];
                var _query = "mimeType != 'application/vnd.google-apps.folder'";
                _query += " and trashed = false";
                _query += " and 'me' in owners";
                _query += " and not appProperties has { key='status' and value='ignored' }";
                _query += " and not appProperties has { key='status' and value='archived' }";

                var params = {
                    //'pageSize': 80,
                    'orderBy': "createdTime desc",
                    'fields': "nextPageToken, files(id,name,createdTime,iconLink,thumbnailLink,properties,appProperties,starred,owners)",
                    'q': _query
                };
                GApi.execute('drive', 'files.list', params)
                    .then(function (resp) {
                        $scope.list = resp.files;
                        $scope.list.forEach(function (item, i) {
                            var image = "resources/images/filetype/" + item.iconLink.substring(item.iconLink.lastIndexOf('/') + 1);
                            item.iconLink = image;
                        })
                    }, function () {
                        console.log('error :(');
                    });
            }

            $scope.loadFolder = function () {
                var _q = "mimeType = 'application/vnd.google-apps.folder'";
                _q += " and name = 'Pagos'";

                var params = {
                    q: _q
                }
                GApi.execute('drive', 'files.list', params).then(function (resp) {
                    if (resp.files.length === 1) {
                        $scope.fileId = resp.files[0].id;
                        $scope.refresh();
                    }
                }, function () {
                    console.log('error :(');
                });
            }

            $scope.getDetail = function (id) {
                $scope.detail = null;

                GApi.execute('drive', 'files.get', {
                    fileId: id,
                    'fields': "appProperties,iconLink,id,modifiedTime,name,parents,properties,spaces,thumbnailLink,webContentLink"
                }).then(function (resp) {
                    $scope.detail = resp.result;
                    $scope.detail.origin = $scope.detail.appProperties && $scope.detail.appProperties.origin ? $scope.detail.appProperties.origin : null;
                    $scope.detail.type = $scope.detail.appProperties && $scope.detail.appProperties.type ? $scope.detail.appProperties.type : "receipt";
                    $scope.detail.expirationDate = $scope.detail.appProperties && $scope.detail.appProperties.expirationDate ? new Date($scope.detail.appProperties.expirationDate) : null;

                    $scope.detail.iconLink = "resources/images/filetype/" + $scope.detail.iconLink.substring($scope.detail.iconLink.lastIndexOf('/') + 1);
                    var _thumbnailLink = $scope.detail.thumbnailLink.substring(0, $scope.detail.thumbnailLink.lastIndexOf('=')) + "=s650";
                    $scope.detail.thumbnailLink = _thumbnailLink;
                });
            }

            $scope.saveDetail = function () {
                GApi.execute('drive', 'files.update', {
                    fileId: $scope.detail.id,
                    appProperties: {
                        origin: $scope.detail.origin,
                        expirationDate: new Date($scope.detail.expirationDate),
                        type: $scope.detail.type
                    }
                }).then(function (resp) {
                    $scope.detail = null;
                    $scope.tags = [];
                }, function () {
                    //ha ocurrido un error
                });
            }
            $scope.closeDetail = function () {
                $scope.detail = null;
                $scope.tags = [];
            }

            $scope.removeTags = function () {
                GApi.execute('drive', 'files.update', {
                    fileId: $scope.detail.id,
                    appProperties: {
                        tags: ""
                    }
                }).then(function (resp) {
                    $scope.detail = null;
                }, function () {
                    //ha ocurrido un error
                });
            }

            $scope.$on("start-app", function (evt, value, $mdConstant) {
                //$scope.refresh();
                $scope.loadFolder();
            });

            $scope.$on("refresh", function (evt) {
                $scope.refresh();
            });

            $scope.getIconLink = function () {
                if ($scope.detail) {
                    return $scope.detail.iconLink;
                }
                return "/resources/images/filetype/icon_11_collection_list_1.png";
            }

            //var dest = fs.createWriteStream('/tmp/resume.pdf');
            $scope.getText = function () {
                GApi.execute('drive', 'files.copy', {
                    fileId: $scope.detail.id,
                    mimeType: 'application/vnd.google-apps.document',
                    ocrLanguage: 'es'
                }).then(function (result) {
                    $scope._getText(result.id);
                }, function (err) {
                    console.log('Error during copy', err);
                });
            }

            $scope._getText = function (fileId) {
                gapi.client.drive.files.export({
                    'fileId': fileId,
                    'mimeType': 'text/plain'
                }).then(function (success) {
                    console.log(success);
                    $scope.parseText(success.body);
                }, function (fail) {
                    console.log(fail);
                    console.log('Error ' + fail.result.error.message);
                })
            }

            $scope.parseText = function (text) {
                var rules = [
                    {
                        name: "fibertel",
                        expression: /(\d*[\.\,]\d*[^\n])\n(\d{2}\-\d{2}-\d{4}[^\n])\n(\d*[^\n])\nCablevision S\.A\./g,
                        extra: ["Factura", "Fibertel"]
                    }, {
                        name: "pagomiscuentas",
                        expression: /\n/g,
                        extra: ["PMC"]
                    }
                ];

                rules.forEach(function (rule) {
                    var match = rule.expression.exec(text);
                    if (match && match.length > 1) {
                        $scope.tags = $scope.tags.concat(rule.extra);
                        var importe = match[1];
                        var vencimiento = match[2].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3");
                        var clientId = match[3];
                        $scope.tags.push(moment(vencimiento).format("MMM YYYY"));
                        $scope.tags.push("Client:" + clientId);

                    }
                });
            }

            $scope.ignoreFile = function (file, evt) {
                var confirm = $mdDialog.confirm({
                    controller: VisibilityController,
                    templateUrl: 'components/main-tabs/visibility-off-dialog.tpl.html',
                    parent: angular.element(document.body)
                })

                $mdDialog.show(confirm).then(function (message) {
                    //si estoy mostrando el detalle lo cierro
                    $scope.detail = null;
                    GApi.execute('drive', 'files.update', {
                        fileId: file.id,
                        appProperties: {
                            status: "ignored"
                        }
                    }).then(function (result) {
                        $scope.list = $scope.list.filter(function (item) {
                            return item.id !== file.id;
                        });
                    }, function (err) {

                    });
                }, function () {
                    //$scope.status = 'You decided to keep your debt.';
                });
            };

            $scope.deleteFile = function (file, evt) {
                var confirm = $mdDialog.confirm({
                    controller: VisibilityController,
                    templateUrl: 'components/main-tabs/delete-dialog.tpl.html',
                    parent: angular.element(document.body)
                })

                $mdDialog.show(confirm).then(function (message) {
                    //$scope.status = 'You decided to get rid of your debt.';
                    //console.log(message);
                    GApi.execute('drive', 'files.update', {
                        fileId: file.id,
                        trashed: true
                    }).then(function (result) {
                        $scope.list = $scope.list.filter(function (item) {
                            return item.id !== file.id;
                        });
                    }, function (err) {
                        console.log("Error :(");
                    });
                }, function () {
                    //$scope.status = 'You decided to keep your debt.';
                });
            };

            $scope.archiveFile = function (file, evt) {
                var props = typeof file.appProperties === 'undefined' ? {} : file.appProperties;
                props.status = "archived";

                GApi.execute('drive', 'files.update', {
                    fileId: file.id,
                    appProperties: props
                }).then(function (result) {
                    $scope.list = $scope.list.filter(function (item) {
                        return item.id !== file.id;
                    });
                }, function (err) {
                    console.log("Error :(");
                });
            };

            $scope.toggleStarred = function (file, evt) {
                GApi.execute('drive', 'files.update', {
                    fileId: file.id,
                    starred: !file.starred
                }).then(function (result) {
                    file.starred = !file.starred;
                }, function (err) {
                    console.log("Error :(");
                });
            };

            GAuth.checkAuth().then(function () {
                $scope.refresh();
            });
        }
    });

function VisibilityController($scope, $mdDialog) {
    $scope.yes = function (message) {
        $mdDialog.hide(message);
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
