'use strict';

angular
    .module('e-invoice')
    .component('sideMenu', {
        templateUrl: 'components/side-menu/side-menu.html',
        controller: function ($scope, $element, $attrs) {
            $scope.collapseVar = 1;
            $scope.check = function (x) {

                if (x == $scope.collapseVar)
                    $scope.collapseVar = 0;
                else
                    $scope.collapseVar = x;
            };
        }
    });
