'use strict';
var invoiceApp = angular.module('e-invoice', ['ngRoute',
                                              'ngAnimate',
                                              //'ngMdIcons',
                                              'ngMaterial',
                                              'ngMessages',
                                              'angular-google-gapi',
                                              'e-invoice.components',
                                              'e-invoice.services',
                                             ])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function ($locationProvider, $routeProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/inbox'
        });

        $mdThemingProvider
            .theme('green')
            .primaryPalette('green')
            .accentPalette('blue-grey');
        //.accentPalette('blue-grey');

        $mdThemingProvider.setDefaultTheme('green');
    }]);

angular.module('e-invoice.services', ['ngRoute', 'angular-google-gapi']);
angular.module('e-invoice.components', ['ngRoute', 'angular-google-gapi', "e-invoice.services", "e-invoice.components"]);

invoiceApp.controller("AppController", ['$scope', "$mdSidenav", "$rootScope", 'loginService', 'appConfigService', function ($scope, $mdSidenav, $rootScope, loginService, appConfigService) {
    var ctrl = this;
    $scope.toggleLeft = function () {
        return $mdSidenav('left').toggle();
    }
    $scope.search = {};

    $scope.showDetail = true;

    $scope.toggleDetail = function (showDetail) {
        $rootScope.$broadcast('toggleDetail', showDetail);
    };

    $scope.toggleSidenav = function (menuId) {
        $mdSidenav(menuId).toggle();
    };

    $scope.refreshData = function () {
        $rootScope.$broadcast("refresh");
    }

    $scope.$on("app-login", function () {
        appConfigService.loadConfig();
    });

    //    $scope.$on("app-config", function () {
    //        //console.log("app-config completed");
    //        $scope.userInfo = loginService.getUserInfo();
    //    });
}]);

invoiceApp.controller("SideNavController", function ($scope, $location, $mdSidenav, $rootScope, $mdConstant, loginService) {
    $scope.link = "#!" + $location.path().replace("/", "");
    $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
    $scope.tags = [];
    var ctrl = this;

    $scope.onmenuclick = function (item) {
        $scope.link = item.link;
        $mdSidenav('left').toggle();
    }

    $scope.startSearch = function () {
        $scope.showSearch = !$scope.showSearch;
        //angular.element('#search-input').trigger('focus');
    }

    $scope.isActive = function (menuItem) {
        if (menuItem.link === $scope.link) {
            return "active";
        }
        return null;
    }

    $scope.searchText = function () {
        $rootScope.$broadcast('searchText', typeof $scope.search.who === 'undefined' ? null : $scope.search.who);
        if ($scope.search.who) {
            $scope.tags.push($scope.search.who);
        }
        $scope.showSearch = !$scope.showSearch;
    }

    $scope.cleanSearch = function () {
        $rootScope.$broadcast('searchText', null);
        $scope.tags = [];
        $scope.search.who = null;
    }

    $scope.$on("start-app", function () {
        $scope.userInfo = loginService.getUserInfo();

        $scope.menu = [{
                link: '#!inbox',
                title: 'Inbox',
                icon: 'inbox'
                    },
            {
                link: '#!archived',
                title: 'Archived',
                icon: 'archive'
                    },
            {
                link: '#!classified',
                title: 'Classified',
                icon: 'class'
            },
            {
                link: '#!starred',
                title: 'Favorite',
                icon: 'favorite'
                    },
            {
                link: '#!ignored',
                title: 'Ignored',
                icon: 'visibility_off'
                    }];
        $scope.admin = [
            {
                link: '#!trashed',
                title: 'Trashed',
                icon: 'delete'
                    },
            {
                link: '#!settings',
                title: 'Settings',
                icon: 'settings'
                    }];
    })
});
