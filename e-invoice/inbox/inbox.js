'use strict';
angular.module('e-invoice.inbox', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/inbox', {
            templateUrl: 'inbox/inbox.html',
            controller: 'InboxCtrl'
        });
}])
    .controller('InboxCtrl', [function () {

}]);
