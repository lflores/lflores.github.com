'use strict';
var app = angular.module('e-invoice.dashboard', ['ngRoute'])
    .component('classifiedFiles', {
        templateUrl: 'dashboard/dashboard.tpl.html',
        controller: function ($scope, $mdBottomSheet, $mdSidenav, $mdDialog, loginService) {
            $scope.$on("start-app", function (evt, value, $mdConstant) {
                //$scope.refresh();
                $scope.menu = [{
                        link: '',
                        title: 'Dashboard',
                        icon: 'dashboard'
                    },
                    {
                        link: '',
                        title: 'Friends',
                        icon: 'group'
                    },
                    {
                        link: '',
                        title: 'Messages',
                        icon: 'message'
                    }];
                $scope.admin = [
                    {
                        link: '',
                        title: 'Trash',
                        icon: 'delete'
                    },
                    {
                        link: 'showListBottomSheet($event)',
                        title: 'Settings',
                        icon: 'settings'
                    }];
                $scope.signedIn = true;
                $scope.userInfo = loginService.getUserInfo();
            });

            $scope.toggleSidenav = function (menuId) {
                $mdSidenav(menuId).toggle();
            };

            $scope.menu = [];
            $scope.admin = [];

            $scope.alert = '';
        }
    });

function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    $scope.answer = function (answer) {
        $mdDialog.hide(answer);
    };
};
