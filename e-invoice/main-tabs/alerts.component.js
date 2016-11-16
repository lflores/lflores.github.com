'use strict';

angular
    .module('e-invoice').component('alerts', {
        templateUrl: 'views/main-tabs/alerts.template.html',
        controller: function ($scope, $element, $attrs) {
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
        }
    })
