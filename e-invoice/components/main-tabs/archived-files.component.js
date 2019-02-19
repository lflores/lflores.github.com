'use strict';
angular
    .module('e-invoice')
    .component('archivedFiles', {
        templateUrl: 'components/main-tabs/archived-files.tpl.html',
        controller: ArchivedFiles
    })

function ArchivedFiles($scope, $element, $attrs, GAuth, GApi) {
    $scope.list = [];
    $scope.tags = [];
    $scope.keys = [186]
    $scope.showDetail = false;
    $scope.fileId = null;

    $scope.$on("start-app", function () {
        //$scope.refresh();
    });
}
