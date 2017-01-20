angular.module('e-invoice.services')
    .service("loginService", ['GAuth', 'GApi', 'appConfigService', '$rootScope', function (GAuth, GApi, appConfigService, $rootScope) {
        return {
            userInfo: null,
            folders: [],
            getUserInfo: function () {
                return this.userInfo;
            },

            setUserInfo: function (user) {
                this.userInfo = user;
                $rootScope.$broadcast('app-login');
                //this.loadFolder();
            },

            loadFolder: function () {
                var _this = this;
                var _q = "mimeType = 'application/vnd.google-apps.folder'";
                _q += " and name = 'Pagos'";

                var params = {
                    q: _q
                }
                GApi.execute('drive', 'files.list', params).then(function (resp) {
                    if (resp.files.length === 1) {
                        _this.folderId = resp.files[0].id;
                        //tengo que ver dentro de pagos las carpetas que hay
                        var _subf = "mimeType = 'application/vnd.google-apps.folder'";
                        _subf += " and '" + resp.files[0].id + "' in parents and trashed=false";
                        GApi.execute('drive', 'files.list', {
                            q: _subf
                        }).then(function (resp) {
                            for (var i = 0; i < resp.files.length; i++) {
                                _this.folders.push(resp.files[i].id);
                            }
                            _this.folders.push(_this.folderId);

                        }, function () {
                            console.log('error :(');
                        });
                        //$rootScope.$broadcast('start-app');
                    }
                }, function () {
                    console.log('error :(');
                });
            },

            isInFolders: function (parents) {
                if (!parents || parents.length == 0) {
                    return false;
                }
                var foldersId = this.folders.join(" ");
                for (var i = 0; i < parents.length; i++) {
                    if (foldersId.indexOf(parents[i]) > -1) {
                        return true;
                    }
                }
                return false;
            },

            folder: function (folderName, then) {
                var _this = this;
                var params = {
                    q: "mimeType = 'application/vnd.google-apps.folder' and name='" + folderName + "' and '" + _this.folderId + "' in parents and trashed=false"
                }
                GApi.execute('drive', 'files.list', params).then(function (resp) {
                    if (resp.files.length === 1 && then) {
                        then.apply(_this, [resp.files[0].id]);
                        return;
                    }

                    GApi.execute('drive', 'files.generateIds', {
                        count: 1
                    }).then(function (resp) {
                        GApi.execute('drive', 'files.create', {
                            mimeType: "application/vnd.google-apps.folder",
                            parents: [_this.folderId],
                            name: folderName,
                            id: resp.ids[0]
                        }).then(function (resp) {
                            //Tengo que agregarla a la lista de carpetas
                            _this.folders.push(resp.id);
                            then.apply(_this, [resp.id]);
                        });
                    });

                }, function () {
                    console.log('error :(');
                });
            }
        };
}]);

angular.module('e-invoice.services')
    .run(['GAuth', 'GApi', 'GData', '$rootScope', 'loginService', function (GAuth, GApi, GData, $rootScope, loginService) {

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
        //var BASE = 'https://myGoogleAppEngine.appspot.com/_ah/api';

        //GApi.load('myApiName', 'v1', BASE);
        GApi.load('drive', 'v3'); // for google api (https://developers.google.com/apis-explorer/)

        GAuth.setClient(CLIENT)
            // default scope is only https://www.googleapis.com/auth/userinfo.email
        GAuth.setScope(SCOPE.join(" "));

        // load the auth api so that it doesn't have to be loaded asynchronously
        // when the user clicks the 'login' button.
        // That would lead to popup blockers blocking the auth window
        GAuth.load();

        // or just call checkAuth, which in turn does load the oauth api.
        // if you do that, GAuth.load(); is unnecessary
        GAuth.checkAuth().then(
            function (user) {
                loginService.setUserInfo(user);
            },
            function () {
                GAuth.login().then(function (user) {
                    //console.log(user.name + ' is logged in');
                    loginService.setUserInfo(user);
                }, function () {
                    console.log('login failed');
                });
            });

        //            GAuth.login().then(function (user) {
        //                    //console.log(user.name + ' is logged in');
        //                    loginService.setUserInfo(user);
        //                },
        //                function () {
        //                    console.log('login failed');
        //                });
    }]);
