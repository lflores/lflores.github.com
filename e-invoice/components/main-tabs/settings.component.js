'use strict';

angular
    .module('e-invoice.components')
    .component('settings', {
        templateUrl: 'components/main-tabs/settings.tpl.html',
        controller: function ($scope, GAuth, GApi, $mdDialog, appConfigService) {
            $scope.showHints = true;
            $scope.disabled = {
                language: true,
                dateFormat: true,
                folder: true,
                names: true
            }
            $scope.appConfig = appConfigService.getAppConfig();

            $scope.$on("start-app", function () {
                //$scope.appSettingsEnabled = true;
                $scope.appConfig = appConfigService.getAppConfig();
            });
        }
    });
