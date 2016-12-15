'use strict';

angular
    .module('e-invoice')
    .component('trashedFiles', {
        templateUrl: 'components/main-tabs/trashed-files.tpl.html',
        controller: function ($scope, $element, $attrs, GAuth, GApi, $mdDialog) {
            $scope.list = [];
            $scope.tags = [];
            $scope.keys = [186]
            $scope.showDetail = false;
            $scope.fileId = null;

            $scope.refresh = function () {
                $scope.list = [];
                var _query = "mimeType != 'application/vnd.google-apps.folder'";
                _query += " and trashed = true";
                _query += " and not appProperties has {key='status' and value=''}"
                _query += " and not appProperties has {key='status' and value='ignored'}"
                _query += " and not appProperties has {key='status' and value='archived'}"

                var params = {
                    'pageSize': 30,
                    'orderBy': "createdTime desc",
                    'fields': "nextPageToken, files(id,name,createdTime,iconLink,thumbnailLink,properties,appProperties,trashed)",
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

            $scope.restoreFile = function (file, evt) {
                GApi.execute('drive', 'files.update', {
                    fileId: file.id,
                    trashed: false
                }).then(function (result) {
                    $scope.list = $scope.list.filter(function (item) {
                        return item.id !== file.id;
                    });
                }, function (err) {
                    console.log("Error :(");
                });
            };

            $scope.deleteFile = function (file, evt) {
                var confirm = $mdDialog.confirm({
                    controller: VisibilityController,
                    templateUrl: 'components/main-tabs/delete-forever-dialog.tpl.html',
                    parent: angular.element(document.body)
                })

                $mdDialog.show(confirm).then(function (message) {
                    //$scope.status = 'You decided to get rid of your debt.';
                    //console.log(message);
                    GApi.execute('drive', 'files.delete', {
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
        }
    })
