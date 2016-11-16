'use strict';
angular.module('e-invoice.dashboard', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/dashboard', {
            templateUrl: 'dashboard/dashboard.html',
            controller: 'DashboardCtrl'
        });
}])
    .controller('DashboardCtrl', [function () {

}]);
