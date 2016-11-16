'use strict';

angular
    .module('e-invoice')
    .component('googleLogin', {
        templateUrl: 'components/google-login/google-login.template.html',
        controller: function ($scope, GAuth, $element, $attrs, loginService) {
            $scope.signedIn = false;
            $scope.doSignup = function () {
                GAuth.login().then(function (user) {
                    $scope.signIn(user);
                    loginService.setUserInfo(user);
                }, function () {
                    $scope.signIn(null);
                    loginService.setUserInfo(null);
                });
            };
            $scope.signIn = function (user) {
                $scope.signedIn = user != null;
                $scope.userInfo = user;
            }

            // Start function in this example only renders the sign in button.
            $scope.start = function () {
                //$scope.renderSignInButton();
            };

            // Call start function on load.
            $scope.start();

            $scope.$on("start-app", function () {
                $scope.signIn(loginService.getUserInfo());
            });
        }
    });
