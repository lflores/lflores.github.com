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

            $scope.refresh = function () {}

            $scope.$on("start-app", function () {
                $scope.refresh();
            })

            GAuth.checkAuth().then(function () {
                $scope.refresh();
            });
        }
    })
