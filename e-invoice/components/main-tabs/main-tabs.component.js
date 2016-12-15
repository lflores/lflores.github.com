'use strict';
invoiceApp.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.
    when('/inbox', {
        template: '<inbox></inbox>'
    }).
    when('/starred', {
        template: '<starred-files></starred-files>'
    }).
    when('/archived', {
        template: '<archived-files></archived-files>'
    }).
    when('/classified', {
        template: '<classified-files></classified-files>'
    }).
    when('/ignored', {
        template: '<ignored-files></ignored-files>'
    }).
    when('/trashed', {
        template: '<trashed-files></trashed-files>'
    }).
    when('/files/:fileId', {
        template: '<file-detail></file-detail>'
    }).
    otherwise('/inbox');
}])
