//'use strict';
//
//// Declare app level module which depends on views, and components
//angular.module('e-invoice', [
//  'ngRoute',
//    'ui.bootstrap',
//    'e-invoice.inbox',
//    'e-invoice.view1',
//    'e-invoice.view2',
//    'e-invoice.version',
//    'e-invoice.demo',
//    'e-invoice.dashboard',
//]).
//config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
//    $locationProvider.hashPrefix('!');
//
//    $routeProvider.otherwise({
//        redirectTo: '/dashboard'
//    });
//}]).controller("GoogleLoginController", function ($scope) {
//    //alert("Hola!");
//    $scope.logged = false;
//    this.googleLogin = function () {
//        //alert("Login click!");
//        $scope.logged = !$scope.logged;
//    }
//});

'use strict';
var invoiceApp = angular.module('e-invoice', ['ngMaterial', 'ngMessages', 'angular-google-gapi', 'e-invoice.dashboard'])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function ($locationProvider, $routeProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/dashboard'
        });

        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('blue-grey');

        // Extend the red theme with a different color and make the contrast color black instead of white.
        // For example: raised button text will be black instead of white.
        //        var neonRedMap = $mdThemingProvider.extendPalette('red', {
        //            '500': '#ff0000',
        //            'contrastDefaultColor': 'dark'
        //        });

        // Register the new color palette map with the name <code>neonRed</code>
        //$mdThemingProvider.definePalette('neonRed', neonRedMap);

        // Use that theme for the primary intentions
        //        $mdThemingProvider.theme('default')
        //            .primaryPalette('neonRed');

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
                console.log(user.name + ' is logged in');
                loginService.setUserInfo(user);
            },
            function () {
                console.log('login failed');
            });

        //        GAuth.checkAuth().then(
        //            function (user) {
        //                console.log(user.name + ' is logged in');
        //            },
        //            function () {
        //                //console.log('user is logged out');
        //                GAuth.login().then(function (user) {
        //                    console.log(user.name + ' is logged in');
        //                    loginService.setUserInfo(user);
        //                    //$state.go('webapp.home'); // action after the user have validated that
        //                    // your application can access their Google account
        //                }, function () {
        //                    console.log('login failed');
        //                });
        //            }
        //        );
    }
]);
invoiceApp.controller("AppController", function ($scope, $mdSidenav, $rootScope) {
    $scope.toggleLeft = function () {
        return $mdSidenav('left').toggle();
    }
    $scope.showDetail = true;
    $scope.toggleDetail = function () {
        $scope.showDetail = !$scope.showDetail;
        $rootScope.$broadcast('toggleDetail', $scope.showDetail);
    };
    $rootScope.$broadcast('toggleDetail', $scope.showDetail);
});

invoiceApp.controller("SideNavController", function ($scope, $mdSidenav) {
    //        $scope.toggleLeft = function () {
    //            return $mdSidenav('left').toggle();
    //        }
});

invoiceApp.controller('ListCtrl', function ($scope, $mdDialog) {
    $scope.toppings = [
        {
            name: 'Pepperoni',
            wanted: true
            },
        {
            name: 'Sausage',
            wanted: false
            },
        {
            name: 'Black Olives',
            wanted: true
            },
        {
            name: 'Green Peppers',
            wanted: false
            }
  ];

    $scope.settings = [
        {
            name: 'Wi-Fi',
            extraScreen: 'Wi-fi menu',
            icon: 'signal_wifi_4_bar',
            enabled: true
            },
        {
            name: 'Bluetooth',
            extraScreen: 'Bluetooth menu',
            icon: 'bluetooth',
            enabled: false
            },
        {
            name: 'Android',
            extraScreen: 'Android menu',
            icon: 'android',
            enabled: false
            },
        {
            name: 'Balance',
            extraScreen: 'Balance menu',
            icon: 'account_balance',
            enabled: false
            }
  ];

    $scope.messages = [
        {
            id: 1,
            title: "Message A",
            selected: false
            },
        {
            id: 2,
            title: "Message B",
            selected: true
            },
        {
            id: 3,
            title: "Message C",
            selected: true
            },
  ];

    $scope.people = [
        {
            name: 'Janet Perkins',
            img: 'img/100-0.jpeg',
            newMessage: true
            },
        {
            name: 'Mary Johnson',
            img: 'img/100-1.jpeg',
            newMessage: false
            },
        {
            name: 'Peter Carlsson',
            img: 'img/100-2.jpeg',
            newMessage: false
            }
  ];

    $scope.goToPerson = function (person, event) {
        $mdDialog.show(
            $mdDialog.alert()
            .title('Navigating')
            .textContent('Inspect ' + person)
            .ariaLabel('Person inspect demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };

    $scope.navigateTo = function (to, event) {
        $mdDialog.show(
            $mdDialog.alert()
            .title('Navigating')
            .textContent('Imagine being taken to ' + to + ' captured')
            .ariaLabel('Navigation demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };

    $scope.doPrimaryAction = function (event) {
        $mdDialog.show(
            $mdDialog.alert()
            .title('Primary Action')
            .textContent('Primary actions can be used for one click actions')
            .ariaLabel('Primary click demo')
            .ok('Awesome!')
            .targetEvent(event)
        );
    };

    $scope.doSecondaryAction = function (event) {
        $mdDialog.show(
            $mdDialog.alert()
            .title('Secondary Action')
            .textContent('Secondary actions can be used for one click actions')
            .ariaLabel('Secondary click demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    };

});
