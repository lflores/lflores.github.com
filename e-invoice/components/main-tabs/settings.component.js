'use strict';

angular
    .module('e-invoice.components')
    .component('settings', {
        templateUrl: 'components/main-tabs/settings.tpl.html',
        controller: function ($scope, GAuth, GApi, $mdDialog, appConfig) {
            $scope.showHints = true;
            $scope.disabled = {
                language: true,
                dateFormat: true,
                folder: true,
                names: true
            }
            $scope.themes = [
                {
                    label: "Default",
                    value: ""
                },
                {
                    label: "Green",
                    value: "green"
                }
            ];

            $scope.languages = [
                {
                    key: "settings.language.spanish",
                    value: "es-ar"
                },
                {
                    key: "settings.language.english",
                    value: "en-us"
                },
            ];

            $scope.language = "es-ar";

            $scope.names = [];


            $scope.appConfig = appConfig.getAppConfig().then(function (config) {
                $scope.appConfig = config;
                $scope.names = config.names;
            }, function (err) {
                console.log(err);
            });
            $scope.theme = "green";

            $scope.changeTheme = function (value) {
                console.log(value);
            }

            $scope.changeLanguage = function (key) {
                $translate.use(key);
            }

            $scope.$on("start-app", function () {
                //$scope.appSettingsEnabled = true;

            });
        }
    });
