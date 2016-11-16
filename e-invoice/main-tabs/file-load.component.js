'use strict';

angular
    .module('e-invoice')
    .component('fileLoad', {
        templateUrl: 'views/main-tabs/file-load.template.html',
        controller: function ($scope, $element, $attrs, GAuth, GApi, $rootScope) {

            $scope.tags = [];
            $scope.keys = [186]
            $scope.showDetail = true;

            $scope.$on("toggleDetail", function (evt, show) {
                $scope.showDetail = show;
            });

            $scope.refresh = function () {
                $scope.list = [];
                var _query = "mimeType != 'application/vnd.google-apps.folder'";

                //var _query = "appProperties has { key='tags' and value contains 'Pago'}";


                var params = {
                    'pageSize': 10,
                    'orderBy': "createdTime desc",
                    'fields': "nextPageToken, files(id,name,createdTime,iconLink,thumbnailLink,properties,appProperties)",
                    'q': _query
                };
                GApi.execute('drive', 'files.list', params).then(function (resp) {
                    $scope.list = resp.files;
                    $scope.list.forEach(function (item, i) {
                        var image = "resources/images/filetype/" + item.iconLink.substring(item.iconLink.lastIndexOf('/') + 1);
                        item.iconLink = image;
                    })
                }, function () {
                    console.log('error :(');
                });
            }


            $scope.getDetail = function (id) {
                GApi.execute('drive', 'files.get', {
                    fileId: id,
                    'fields': "appProperties,iconLink,id,modifiedTime,name,parents,properties,spaces,thumbnailLink,webContentLink,iconLink"
                }).then(function (resp) {
                    $scope.detail = resp.result;
                    $scope.detail.tags = $scope.detail.appProperties && $scope.detail.appProperties.tags ? $scope.detail.appProperties.tags.split(";") : [];
                    $scope.tags = $scope.detail.tags;
                    $scope.detail.iconLink = "resources/images/filetype/" + $scope.detail.iconLink.substring($scope.detail.iconLink.lastIndexOf('/') + 1);
                    var _thumbnailLink = $scope.detail.thumbnailLink.substring(0, $scope.detail.thumbnailLink.lastIndexOf('=')) + "=s650";
                    $scope.detail.thumbnailLink = _thumbnailLink;
                });
            }

            $scope.saveDetail = function () {
                //var tags = $scope.detail.tags;
                //                var last = tags.length;
                //                while (tags.indexOf(("label-" + last)) > 0) {
                //                    last++
                //                }
                //                tags.push(("label-" + last));

                GApi.execute('drive', 'files.update', {
                    fileId: $scope.detail.id,
                    appProperties: {
                        tags: $scope.tags.join(";")
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
                $scope.refresh();
            });
        }
    });
