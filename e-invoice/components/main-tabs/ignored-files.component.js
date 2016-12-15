'use strict';

angular
    .module('e-invoice')
    .component('ignoredFiles', {
        templateUrl: 'components/main-tabs/ignored-files.tpl.html',
        controller: function ($scope, $element, $attrs, GAuth, GApi) {
            $scope.list = [];
            $scope.tags = [];
            $scope.keys = [186]
            $scope.showDetail = false;
            $scope.fileId = null;

            $scope.refresh = function () {
                $scope.list = [];
                var _query = "mimeType != 'application/vnd.google-apps.folder'";
                _query += " and trashed = false";
                //_query += " and mimeType != 'application/vnd.google-apps.document'";
                //_query += " and '" + $scope.fileId + "' in parents";
                _query += " and appProperties has {key='status' and value='ignored'}"

                //_query += " and appProperties has { key='visibility' }";
                //_query += " and appProperties has { key='visibility' and value='invisible' }";
                var params = {
                    'pageSize': 30,
                    'orderBy': "createdTime desc",
                    'fields': "nextPageToken, files(id,name,createdTime,iconLink,thumbnailLink,properties,appProperties)",
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

            $scope.$on("start-app", function () {
                $scope.refresh();
            })

            GAuth.checkAuth().then(function () {
                $scope.refresh();
            });
        }
    })
