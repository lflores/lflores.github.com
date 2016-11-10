angular.module('myApp.demo', ['ngRoute'])
    .controller('AlertDemoCtrl', function ($scope) {
        $scope.alerts = [
            {
                type: 'danger',
                msg: 'Oh snap! Change a few things up and try submitting again.'
        },
            {
                type: 'success',
                msg: 'Well done! You successfully read this important alert message.'
        }
  ];

        $scope.addAlert = function () {
            $scope.alerts.push({
                msg: 'Another alert!'
            });
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };
    })
    .controller('ButtonsCtrl', function ($scope) {
        $scope.singleModel = 1;

        $scope.radioModel = 'Middle';

        $scope.checkModel = {
            left: false,
            middle: true,
            right: false
        };

        $scope.checkResults = [];

        $scope.$watchCollection('checkModel', function () {
            $scope.checkResults = [];
            angular.forEach($scope.checkModel, function (value, key) {
                if (value) {
                    $scope.checkResults.push(key);
                }
            });
        })
    }).controller('TabsDemoCtrl', function ($scope, $window) {
        $scope.tabs = [
            {
                title: 'Archivos',
                content: 'Dynamic content 1',
                icon: "file",
                template: "<file-load></file-load>"
            },
            {
                title: 'Archivos sin clasificar',
                content: 'Dynamic content 2',
                icon: "tasks"
            },
            {
                title: 'Archivos clasificados',
                content: 'Dynamic content 3',
                icon: "tags"
            }, {
                title: 'Alertas',
                content: 'Dynamic content 4'
            }
  ];
        this.select = function (pane) {
            angular.forEach(panes, function (pane) {
                pane.selected = false;
                $window.alert("Hola Select");
            });
        }

        $scope.alertSelect = function ($event) {
            $window.alert(JSON.stringify($event));
        }

        $scope.model = {
            name: 'Tabs',
            vertical: false,
            select: function ($event) {
                $window.alert(JSON.stringify($event));
            }
        };
    });
