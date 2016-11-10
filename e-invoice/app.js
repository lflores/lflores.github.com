//'use strict';
//
//// Declare app level module which depends on views, and components
//angular.module('myApp', [
//  'ngRoute',
//    'ui.bootstrap',
//    'myApp.inbox',
//    'myApp.view1',
//    'myApp.view2',
//    'myApp.version',
//    'myApp.demo',
//    'myApp.dashboard',
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
var invoiceApp = angular.module('myApp', ['ngMaterial', 'ngMessages', 'angular-google-gapi', 'myApp.dashboard'])
    .config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function ($locationProvider, $routeProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.otherwise({
            redirectTo: '/dashboard'
        });

        // Extend the red theme with a different color and make the contrast color black instead of white.
        // For example: raised button text will be black instead of white.
        var neonRedMap = $mdThemingProvider.extendPalette('red', {
            '500': '#ff0000',
            'contrastDefaultColor': 'dark'
        });

        // Register the new color palette map with the name <code>neonRed</code>
        $mdThemingProvider.definePalette('neonRed', neonRedMap);

        // Use that theme for the primary intentions
        //        $mdThemingProvider.theme('default')
        //            .primaryPalette('neonRed');

    }]);

invoiceApp.run(['GAuth', 'GApi', 'GData', '$rootScope',
    function (GAuth, GApi, GData, $routeProvider, $rootScope) {

        //$rootScope.gdata = GData;

        var CLIENT = '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com';
        var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';

        //GApi.load('myApiName', 'v1', BASE);
        GApi.load('drive', 'v3'); // for google api (https://developers.google.com/apis-explorer/)

        GAuth.setClient(CLIENT)
            // default scope is only https://www.googleapis.com/auth/userinfo.email
        GAuth.setScope('email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.metadata');

        // load the auth api so that it doesn't have to be loaded asynchronously
        // when the user clicks the 'login' button.
        // That would lead to popup blockers blocking the auth window
        GAuth.load();

        // or just call checkAuth, which in turn does load the oauth api.
        // if you do that, GAuth.load(); is unnecessary
        GAuth.checkAuth().then(
            function (user) {
                console.log(user.name + ' is logged in');
            },
            function () {
                console.log('user is logged out');
            }
        );
    }
]);
invoiceApp.controller("AppController", function ($scope, $mdSidenav) {
    $scope.toggleLeft = function () {
        return $mdSidenav('left').toggle();
    }
});

invoiceApp.controller("GoogleLoginController", function ($scope, $mdSidenav) {
    //alert("Hola!");
    $scope.logged = false;
    this.googleLogin = function () {
        //alert("Login click!");
        $scope.logged = !$scope.logged;
    }
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
