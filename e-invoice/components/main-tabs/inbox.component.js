'use strict';
angular
    .module('e-invoice')
    .component('inbox', {
        templateUrl: 'components/main-tabs/inbox.tpl.html',
        controller: InboxController,
    });

function InboxController($scope, $rootScope, $element, GAuth, GApi, $mdDialog, appConfig, Upload) {
    //$scope.tags = [];
    var ctrl = this;
    $scope.keys = [186]
    $scope.showDetail = false;
    $scope.fileId = null;
    $scope.files = [];
    $scope.counter = {
        loaded: 0,
        hasMore: true
    };

    $scope.$on("toggleDetail", function (evt, show) {
        $scope.showDetail = show;
    });

    $scope.refresh = function () {

    }

    $scope.$on("refresh", function () {
        $scope.refresh();
    });
    
    //appConfig.getAppConfig().then(function(config){
    //    $scope.config = config;
    //},function(){
    //    console.log("Ocurrió un erro cargando la configuracion");
    //});

    $rootScope.$on("start-app", function () {
        appConfig.getAppConfig().then(function(config){
            $scope.config = config;
        },function(){
            console.log("Ocurrió un error obteniendo la configuración")
        });
    });

    $scope.$watch('files', function () {
        if(!$scope.files || $scope.files.length === 0){
            return;
        }
        if($scope.config == null){
            
        }else{
            $scope.upload($scope.files, $scope.config.folderId);
        }
    });

    $scope.upload = function (files, folderId) {
        if (files.length === 0) {
            return;
        }
        var created = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.$error) {
                insertFile(file, folderId, function (resp) {
                    $rootScope.$broadcast("files-add", resp);
                    created.push(resp);
                    if (created.length === files.length) {
                        $rootScope.$broadcast("files-added", created);
                    }
                });
            }
        }
    }

    $scope.uploadFile = function (file, folderId) {
        if (!file.$error) {
            insertFile(file, folderId, function (resp) {
                files.splice(0, 1);
            });
        }
    }

    GAuth.checkAuth().then(function () {
        $scope.refresh();
    });
}

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, parent, callback) {
    var boundary = '-------314159265358979323846';
    var delimiter = "\r\n--" + boundary + "\r\n";
    var close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function (e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'name': fileData.name,
            'mimeType': contentType,
            'parents': [parent]
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v3/files',
            'method': 'POST',
            'params': {
                'uploadType': 'multipart'
            },
            'name': fileData.name,
            'parents': [{'id':parent}],
            'originalFileName': fileData.name,
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });
        if (!callback) {
            callback = function (file) {
                console.log(file)
            };
        }
        request.execute(callback);
    }
}


function VisibilityController($scope, $mdDialog) {
    $scope.yes = function (message) {
        $mdDialog.hide(message);
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
