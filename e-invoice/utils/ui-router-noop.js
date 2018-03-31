// uiRouterNoop.js helper module
mod = angular.module('uiRouterNoop', []);
mod.service('$state', function () {
    return {}
});
mod.service('$urlRouter', function () {
    return {}
});
mod.service('$httpBackend', function () {
    return function () {}
});
