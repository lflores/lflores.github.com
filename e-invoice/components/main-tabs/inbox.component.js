'use strict';
angular
    .module('e-invoice')
    .component('inbox', {
        templateUrl: 'components/main-tabs/inbox.tpl.html',
        controller: InboxController,
    });
//    .directive('mdCounter', function () {
//        function link(scope, element, attrs) {
//            return "lala";
//        }
//        return {
//            restrict: 'E',
//            _template: '<md-badge class="md-raised md-button md-primary">{{counter.loaded}}</md-badge>',
//            link: link
//        };
//    });

function InboxController($scope, $element, GAuth, GApi, $mdDialog, loginService) {
    //$scope.tags = [];
    $scope.keys = [186]
    $scope.showDetail = false;
    $scope.fileId = null;
    $scope.counter = {
        loaded: 0,
        hasMore: true
    };

    $scope.$on("toggleDetail", function (evt, show) {
        $scope.showDetail = show;
    });

    $scope.refresh = function () {

    }

    $scope.$on("refresh", function (evt) {
        $scope.refresh();
    });

    GAuth.checkAuth().then(function () {
        $scope.refresh();
    });
}


function VisibilityController($scope, $mdDialog) {
    $scope.yes = function (message) {
        $mdDialog.hide(message);
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
