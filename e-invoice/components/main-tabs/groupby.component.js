'use strict';
angular
    .module('e-invoice')
    .component('groupBy', {
        bindings: {
            grouping: '=',
        },
        templateUrl: 'components/main-tabs/groupby.tpl.html',
        controller: GroupByController
    })

function GroupByController($scope, $element, $attrs, GAuth, GApi) {
    $scope.list = [];
    $scope.tags = [];
    $scope.keys = [186]
    $scope.showDetail = false;
    $scope.fileId = null;

    this.grouping = "expirationDate";

    this.$onChanges = function (changesObj) {
        if (changesObj.grouping) {
            console.log("cambioooo en GroupByController!");
        }
    }
}
