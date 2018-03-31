angular.module('e-invoice.services')
    .service("loginService", ['GAuth', 'GApi', '$rootScope', '$q', function (GAuth, GApi, $rootScope, $q) {
        return {
            _userInfo: null,
            folders: [],
            getUserInfo: getUserInfo
        }

        function getUserInfo() {
            var _this = this;
            if (_this.userInfo) {
                return _this.userInfo;
            }
            var defered = $q.defer();
            GAuth.login().then(function (info) {
                _this.userInfo = info;
                defered.resolve(info);
            }, function (err) {
                defered.reject(err);
            });
            return defered.promise;
        }
    }]);

angular.module('e-invoice.services')
    .run(['GAuth', 'GApi', 'GData', '$rootScope', 'loginService', '$q', function (GAuth, GApi, GData, $rootScope, loginService, $q) {

        var SCOPE = [
            //'email',
            'profile',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.appdata',
            'https://www.googleapis.com/auth/drive.metadata'
        ]

        $rootScope.gdata = GData;

        var CLIENT = '825440913711-gjoh3rbtrsnt5mapedf9dn2kumv247m7.apps.googleusercontent.com';
        GApi.load('drive', 'v3');
        GAuth.setClient(CLIENT)

        GAuth.setScope(SCOPE.join(" "));

        GAuth.load();
    }]);
