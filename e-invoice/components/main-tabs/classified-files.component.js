'use strict';

angular
    .module('e-invoice')
    .component('classifiedFiles', {
        templateUrl: 'components/main-tabs/classified-files.tpl.html',
        controller: ClassifiedFilesController
    });

function ClassifiedFilesController($scope, $element, $attrs) {
    $scope.counter = {
        loaded: 0,
        hasMore: true
    };

    //$scope.showDetail = true;
}
