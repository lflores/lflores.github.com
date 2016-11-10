'use strict';

angular
    .module('myApp')
    .component('googleLogin', {
        templateUrl: 'components/google-login/google-login.template.html',
        controller: function ($scope, GAuth, $element, $attrs) {

            $scope.signedIn = false;
            $scope.doSignup = function () {
                GAuth.login().then(function (user) {
                    console.log(user.name + ' is logged in');
                    //$state.go('webapp.home'); // action after the user have validated that
                    // your application can access their Google account
                    $scope.signedIn = true;
                    $scope.userInfo = user;
                    //$scope.userInfoCallback(user);
                }, function () {
                    //console.log('login failed');
                    $scope.signedIn = false;
                });
            };

            //            $scope.logged = false;
            //            this.googleLogin = function () {
            //                //alert("Login click! " + $scope.logged);
            //                $scope.logged = !$scope.logged;
            //            }

            // This flag we use to show or hide the button in our HTML.


            // Here we do the authentication processing and error handling.
            // Note that authResult is a JSON object.
            $scope.processAuth = function (authResult) {
                // Do a check if authentication has been successful.
                if (authResult['access_token']) {
                    // Successful sign in.
                    $scope.signedIn = true;
                    $scope.getUserInfo();
                } else if (authResult['error']) {
                    // Error while signing in.
                    $scope.signedIn = false;

                    // Report error.
                }
            };

            // When callback is received, we need to process authentication.
            $scope.signInCallback = function (authResult) {
                $scope.$apply(function () {
                    $scope.processAuth(authResult);
                });
            };

            // Render the sign in button.
            $scope.renderSignInButton = function () {
                gapi.signin.render('signInButton', {
                    'callback': $scope.signInCallback, // Function handling the callback.
                    'clientid': '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com', // CLIENT_ID from developer console which has been explained earlier.
                    'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                    // as their explanation is available in Google+ API Documentation.
                    'scope': 'email profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.install',
                    'cookiepolicy': 'single_host_origin'
                });
            }

            // Process user info.
            // userInfo is a JSON object.
            $scope.processUserInfo = function (userInfo) {
                // You can check user info for domain.
                if (userInfo['domain'] == 'mycompanydomain.com') {
                    // Hello colleague!
                }
                $scope.userInfo = userInfo;

                // Or use his email address to send e-mails to his primary e-mail address.
                //sendEMail(userInfo['emails'][0]['value']);
            }

            // When callback is received, process user info.
            $scope.userInfoCallback = function (userInfo) {
                $scope.$apply(function () {
                    $scope.processUserInfo(userInfo);
                });
            };

            // Request user info.
            $scope.getUserInfo = function () {
                gapi.client.request({
                    'path': '/plus/v1/people/me',
                    'method': 'GET',
                    'callback': $scope.userInfoCallback
                });
            };

            // Start function in this example only renders the sign in button.
            $scope.start = function () {
                //$scope.renderSignInButton();
            };

            // Call start function on load.
            $scope.start();
        }
    });
