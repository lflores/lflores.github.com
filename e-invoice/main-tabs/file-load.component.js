'use strict';

angular
    .module('myApp')
    .component('fileLoad', {
        templateUrl: 'views/main-tabs/file-load.template.html',
        controller: function ($scope, $element, $attrs, GAuth, GApi) {
            $scope.$on("evento", function (evt, value) {
                //console.log("Evento scope: " + value);
                $scope.refresh();
            });

            $scope.refresh = function () {
                $scope.list = [];
                var params = {
                    'pageSize': 30,
                    'fields': "nextPageToken, files(id,name,createdTime,iconLink,thumbnailLink)",
                    'q': "mimeType != 'application/vnd.google-apps.folder'"
                };
                GApi.execute('drive', 'files.list', params).then(function (resp) {
                    $scope.list = resp.files;
                    $scope.list.forEach(function (item, i) {

                    })
                }, function () {
                    console.log('error :(');
                });
            }
        }
    });
