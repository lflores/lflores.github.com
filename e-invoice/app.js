'use strict';
var invoiceApp = angular.module('e-invoice', ['ngRoute',
                                              'ngAnimate',
                                              'ngMaterial',
                                              'ngMessages',
                                              'ngFileUpload',
                                              'angular-google-gapi',

                                              'e-invoice.components',
                                              'e-invoice.services',
                                              'e-invoice.i18n'
                                             ])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider', '$mdDateLocaleProvider', function ($locationProvider, $routeProvider, $mdThemingProvider, $mdDateLocaleProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/inbox'
        });

        $mdThemingProvider
            .theme('green')
            .primaryPalette('green')
            .accentPalette('blue-grey');

        $mdThemingProvider.setDefaultTheme('green');

        $mdThemingProvider.alwaysWatchTheme(true);

        $mdDateLocaleProvider.formatDate = function (date) {
            return moment(date).format('DD/MM/YYYY');
        };
    }]);

angular.module('e-invoice.services', ['ngRoute', 'angular-google-gapi']);
angular.module('e-invoice.components', ['ngRoute', 'angular-google-gapi', "e-invoice.services", "e-invoice.components"]);
angular.module('e-invoice.i18n', ['pascalprecht.translate', 'tmh.dynamicLocale']);

/**
 */
angular.module('e-invoice.i18n')
    .config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useLoader('angularTranslateAsyncLoader');
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.preferredLanguage("es-ar");
}]);

angular.module('e-invoice.i18n').factory('angularTranslateAsyncLoader', function ($q, $http) {
    return function (options) {
        var deferred = $q.defer();
        $http
            .get("i18n/" + options.key + ".json")
            .success(function (result) {
                deferred.resolve(result);
            })
            .error(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    };
});

angular.module('e-invoice.i18n')
    .config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.defaultLocale("es-ar")
        tmhDynamicLocaleProvider.localeLocationPattern("i18n/angular-locale_{{locale}}.js");
    }]);

angular.module('e-invoice.i18n').run(['$window', "$translate", "tmhDynamicLocale", function ($window, $translate, tmhDynamicLocale) {
    var language = ($window.navigator.language || $window.navigator.userLanguage).indexOf("en") === 0 ? "en-us" : "es-ar";
    //var language = "en-us";
    $translate.use(language);
    tmhDynamicLocale.set(language);
}]);

invoiceApp.controller("AppController", ['$scope', "$mdSidenav", "$rootScope", 'loginService', 'appConfig', function ($scope, $mdSidenav, $rootScope, loginService, appConfig) {
    var ctrl = this;
    var appData;
    var userInfo;

    loginService.getUserInfo().then(function (userInfo) {
        appConfig.getAppConfig().then(function (data) {
            appData = data;
        }, function (err) {
            console.log(err);
        })
    }, function (err) {
        console.log(err);
    });

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
        appConfig.loadConfig();
    });

    //    $scope.$on("app-config", function () {
    //        //console.log("app-config completed");
    //        $scope.userInfo = loginService.getUserInfo();
    //    });
}]);

invoiceApp.controller("SideNavController", function ($scope, $location, $mdSidenav, $rootScope, $mdConstant, $translate, loginService) {
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
    loginService.getUserInfo().then(function (userInfo) {
        $scope.userInfo = userInfo;
    }, function (err) {
        console.log(err);
    });

    $scope.changeLanguage = function (key) {
        $translate.use(key);
    }

    $scope.menu = [
        {
            link: '#!inbox',
            key: 'menu.inbox',
            title: 'Inbox',
            icon: 'inbox'
        },
        {
            key: 'menu.archived',
            link: '#!archived',
            title: 'Archived',
            icon: 'archive'
        },
        {
            key: 'menu.classified',
            link: '#!classified',
            title: 'Classified',
            icon: 'class'
        },
        {
            key: 'menu.starred',
            link: '#!starred',
            title: 'Favorite',
            icon: 'favorite'
        },
        {
            key: 'menu.ignored',
            link: '#!ignored',
            title: 'Ignored',
            icon: 'visibility_off'
        }];

    $scope.admin = [
        {
            key: 'menu.trashed',
            link: '#!trashed',
            title: 'Trashed',
            icon: 'delete'
        },
        {
            key: 'menu.settings',
            link: '#!settings',
            title: 'Settings',
            icon: 'settings'
                    }];

    //$scope.changeLanguage("es-ar");

    $scope.$on("start-app", function () {
        //$scope.userInfo = loginService.getUserInfo();

        //        $scope.menu = [{
        //                link: '#!inbox',
        //                title: 'Inbox',
        //                icon: 'inbox'
        //                    },
        //            {
        //                link: '#!archived',
        //                title: 'Archived',
        //                icon: 'archive'
        //                    },
        //            {
        //                link: '#!classified',
        //                title: 'Classified',
        //                icon: 'class'
        //            },
        //            {
        //                link: '#!starred',
        //                title: 'Favorite',
        //                icon: 'favorite'
        //                    },
        //            {
        //                link: '#!ignored',
        //                title: 'Ignored',
        //                icon: 'visibility_off'
        //                    }];
        //        $scope.admin = [
        //            {
        //                link: '#!trashed',
        //                title: 'Trashed',
        //                icon: 'delete'
        //                    },
        //            {
        //                link: '#!settings',
        //                title: 'Settings',
        //                icon: 'settings'
        //                    }];
    })
});
