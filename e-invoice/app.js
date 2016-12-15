'use strict';
var invoiceApp = angular.module('e-invoice', ['ngRoute', 'ngMdIcons', 'ngMaterial', 'ngMessages', 'angular-google-gapi',
                                              //'e-invoice.dashboard'
                                             ])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function ($locationProvider, $routeProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/inbox'
        });

        $mdThemingProvider
            .theme('default')
            .primaryPalette('green')
            .accentPalette('blue-grey');
        //.accentPalette('blue-grey');
    }]);

invoiceApp.factory("loginService", function (GAuth, $rootScope) {
    return {
        userInfo: null,
        getUserInfo: function () {
            return this.userInfo;
        },
        setUserInfo: function (user) {
            this.userInfo = user;
            this.loadFolder();
        },

        loadFolder: function () {
            $rootScope.$broadcast('start-app', this.userInfo);
        }
    };
});

invoiceApp.run(['GAuth', 'GApi', 'GData', '$rootScope', 'loginService',
    function (GAuth, GApi, GData, $rootScope, loginService) {

        var SCOPE = [
            //'email',
            'profile',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.appdata',
            'https://www.googleapis.com/auth/drive.metadata'
        ]

        $rootScope.gdata = GData;

        var CLIENT = '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com';
        //var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';

        //GApi.load('myApiName', 'v1', BASE);
        GApi.load('drive', 'v3'); // for google api (https://developers.google.com/apis-explorer/)

        GAuth.setClient(CLIENT)
            // default scope is only https://www.googleapis.com/auth/userinfo.email
        GAuth.setScope(SCOPE.join(" "));

        // load the auth api so that it doesn't have to be loaded asynchronously
        // when the user clicks the 'login' button.
        // That would lead to popup blockers blocking the auth window
        GAuth.load();

        // or just call checkAuth, which in turn does load the oauth api.
        // if you do that, GAuth.load(); is unnecessary
        GAuth.login().then(function (user) {
                //console.log(user.name + ' is logged in');
                loginService.setUserInfo(user);
            },
            function () {
                console.log('login failed');
            });
    }
]);
invoiceApp.controller("AppController", function ($scope, $mdSidenav, $rootScope, loginService) {
    $scope.toggleLeft = function () {
        return $mdSidenav('left').toggle();
    }

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

    $scope.$on("start-app", function () {
        $scope.userInfo = loginService.getUserInfo();
    });
});

invoiceApp.controller("SideNavController", function ($scope, $location, loginService, $mdSidenav) {
    $scope.link = "#!" + $location.path().replace("/", "");
    $scope.onmenuclick = function (item) {
        $scope.link = item.link;
        $mdSidenav('left').toggle();
    }

    $scope.$on("start-app", function () {
        $scope.menu = [{
                link: '#',
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
                link: 'showListBottomSheet($event)',
                title: 'Settings',
                icon: 'settings'
                    }];
    })
});
