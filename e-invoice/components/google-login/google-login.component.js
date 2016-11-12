'use strict';

angular
    .module('myApp')
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

            //            $scope.signedIn = function () {
            //                return loginService.getUserInfo() != null;
            //            }
            //            $scope.userInfo = function () {
            //                return loginService.getUserInfo();
            //            }

            //            $scope.$watch(loginService.userInfo, function (userInfo) {
            //                if (typeof userInfo != 'undefined') {
            //                    $scope.signedIn = true;
            //                    $scope.userInfo = userInfo;
            //                }
            //            });

            // Start function in this example only renders the sign in button.
            $scope.start = function () {
                //$scope.renderSignInButton();
            };

            // Call start function on load.
            $scope.start();
        }
    });
