'use strict';

angular
    .module('e-invoice')
    .component('classifiedFiles', {
        templateUrl: 'components/main-tabs/classified-files.tpl.html',
        controller: function ($scope, $element, $attrs) {

            $scope.showDetail = true;
        }
    })
