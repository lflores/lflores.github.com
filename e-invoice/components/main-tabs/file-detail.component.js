'use strict';
angular
    .module('e-invoice')
    .component('fileDetail', {
        bindings: {
            file: '<',
            //onUpdate: '&'
        },
        templateUrl: 'components/main-tabs/file-detail.tpl.html',
        controller: function ($scope, $element, $mdToast, $mdDialog, GApi, textDiscovery, appConfigService) {
            var ctrl = this;
            var fileId = null;
            var element = $element;
            var myInput = angular.element($element[0].querySelector('#origin-autocomplete'));
            var unavailableImg = "resources/images/unavailable-200x200.png";
            $scope.size = 650;

            this.$onChanges = function (changesObj) {
                if (ctrl.file && ctrl.file.id) {
                    fileId = ctrl.file.id;
                    $scope.refresh();
                } else {
                    fileId = null;
                    $scope.detail = null;
                    $scope.reset();
                }
            }

            $scope.actions = {
                archive: {},
                save: {},
                lucky: {},
                zoom: {},
                tags: {}
            };

            $scope.loading = function (enable) {
                if (typeof enable === 'undefined') {
                    return this._loading;
                }
                this._loading = enable;
                if (!this._loading) {
                    $element.find("md-progress-circular").addClass("ng-hide");
                }
            };

            $scope.reset = function () {
                ctrl.selectedOrigin = null;
                ctrl.expirationDate = null;
                ctrl.type = null;
                ctrl.amount = null;
            }

            $scope.actions.zoom.action = function ($event) {
                this.loading(true);
                if ($event.ctrlKey) {
                    $scope.size -= 50;
                } else {
                    $scope.size += 50;
                }
                $mdToast.show(
                    $mdToast.simple()
                    .textContent('Zoom: ' + $scope.size)
                    .position("bottom right")
                    .hideDelay(3000)
                );
                $scope.refreshThumb();
            }

            $scope.actions.zoom.icon = function ($event) {}


            $scope.refreshThumb = function () {
                if (this.detail) {
                    var _thumbnailLink = $scope.detail.thumbnailLink;
                    if (_thumbnailLink) {
                        _thumbnailLink = _thumbnailLink.substring(0, $scope.detail.thumbnailLink.lastIndexOf('=')) + "=s" + $scope.size;
                    } else {
                        _thumbnailLink = unavailableImg;
                    }
                    var downloadingImage = new Image();
                    downloadingImage.onload = function () {
                        //image.src = this.src;
                        $element.find('img').eq(1).attr("src", this.src);
                        $scope.loading(false);
                    };
                    downloadingImage.src = _thumbnailLink;
                }
            }

            $scope.refresh = function () {
                $scope.reset();
                $scope.loading(true);
                GApi.executeAuth('drive', 'files.get', {
                    fileId: fileId,
                    fields: "appProperties,iconLink,id,modifiedTime,name,parents,properties,spaces,thumbnailLink,webContentLink"
                }).then(function (resp) {
                    $scope.detail = resp.result;
                    ctrl.selectedOrigin = $scope.detail.appProperties && $scope.detail.appProperties.origin ? $scope.detail.appProperties.origin : null;
                    ctrl.type = $scope.detail.appProperties && $scope.detail.appProperties.type ? $scope.detail.appProperties.type : "receipt";
                    ctrl.expirationDate = $scope.detail.appProperties && $scope.detail.appProperties.expirationDate ? new Date($scope.detail.appProperties.expirationDate) : null;
                    ctrl.amount = $scope.detail.appProperties && $scope.detail.appProperties.amount ? parseFloat($scope.detail.appProperties.amount) : null;

                    $scope.detail.iconLink = "resources/images/filetype/" + $scope.detail.iconLink.substring($scope.detail.iconLink.lastIndexOf('/') + 1);
                    $scope.refreshThumb();
                });
            }

            $scope.getIconLink = function () {
                if ($scope.detail) {
                    return $scope.detail.iconLink;
                }
                return "/resources/images/filetype/icon_11_collection_list_1.png";
            }


            $scope.actions.lucky.action = function ($event) {
                $scope.loading(true);
                textDiscovery.fileMatches($scope.detail.id, function (result) {
                    var matches = result;
                    if (matches.dates.length > 1 || matches.amounts.length > 1) {
                        $scope.multipleMatchesSelection(matches, function (result) {
                            console.log("Multiple matches ended!");
                            matches.dates = [result.expirationDate];
                            matches.amounts = [result.amount];
                            $scope.setResult(matches);
                        });
                    } else {
                        $scope.setResult(matches);
                    }
                    $scope.loading(false);
                })
            }

            $scope.actions.lucky.disabled = function () {
                if (!$scope.detail) {
                    return true;
                }
                return false;
            }

            $scope.actions.lucky.visibility = function () {
                return true;
            }

            $scope.setResult = function (result) {
                if ($scope.detail && result.name) {
                    //$scope.detail.origin = result.name;
                    ctrl.selectedOrigin = result.name;
                }
                if ($scope.detail && result.dates.length === 1) {
                    ctrl.expirationDate = result.dates[0].date;
                }
                if ($scope.detail && result.amounts.length === 1) {
                    ctrl.amount = result.amounts[0].amount;
                }
                if ($scope.detail && result.types && result.types.length === 1) {
                    ctrl.type = result.types[0].type;
                }

                if (result.dates.length == 1 && result.amounts.length === 1) {
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent('All data has been loaded and copied to item!')
                        .position("bottom right")
                        .hideDelay(3000)
                    );
                }

            }

            $scope.multipleMatchesSelection = function (result, then) {
                var confirm = $mdDialog.confirm({
                    controller: MultipleMatchesController,
                    templateUrl: 'components/main-tabs/file-detail-multiple-matches.tpl.html',
                    parent: angular.element(document.body),
                    resolve: {
                        dates: function () {
                            return result.dates;
                        },
                        amounts: function () {
                            return result.amounts;
                        }
                    }
                });

                $mdDialog.show(confirm).then(function (result) {
                    if (then) {
                        then.apply(ctrl, [result]);
                    }
                }, function () {
                    console.log("error :(");
                });
            }

            this.querySearch = function (query) {
                return textDiscovery.origins(query);
            }

            this.newOrigin = function (newOrigin) {
                textDiscovery.createOrigin(newOrigin, function (origin) {
                    ctrl.selectedOrigin = origin;
                    $element[0].querySelector('#origin-autocomplete').blur();
                });
            }

            this.selectedItemChange = function (origin) {
                ctrl.selectedItem = origin;
            }

            $scope.submit = function () {
                console.log("submit");
            }

            $scope.actions.save.action = function ($event) {
                appConfigService.folder(new Date(ctrl.expirationDate).getFullYear(), function (folderId) {
                    var params = {
                        fileId: $scope.detail.id,
                        appProperties: {
                            origin: ctrl.selectedOrigin,
                            expirationDate: new Date(ctrl.expirationDate),
                            type: ctrl.type,
                            amount: ctrl.amount
                        }
                    };

                    GApi.execute('drive', 'files.update', params).then(function (resp) {
                        $scope.detail = null;
                    }, function () {
                        //ha ocurrido un error
                    });
                });
            }

            $scope.actions.save.disabled = function ($event) {
                if (!$scope.detail) {
                    return true;
                }
                return false;
            }

            $scope.actions.save.visibility = function ($event) {
                return true;
            }

            $scope.actions.archive.action = function ($event) {
                appConfigService.folder(new Date(ctrl.expirationDate).getFullYear(), function (folderId) {
                    var params = {
                        fileId: $scope.detail.id,
                        appProperties: {
                            origin: ctrl.selectedOrigin,
                            expirationDate: new Date(ctrl.expirationDate),
                            type: ctrl.type,
                            amount: ctrl.amount,
                            status: "archived",

                        },
                        removeParents: appConfigService.folderId,
                        addParents: folderId
                    };

                    GApi.execute('drive', 'files.update', params).then(function (resp) {
                        $scope.detail = null;

                    }, function () {
                        //ha ocurrido un error
                    });
                });
            }

            $scope.actions.archive.visibility = function ($event) {
                if (!$scope.detail) {
                    return false;
                }
                if ($scope.detail && ctrl.expirationDate && $scope.detail.appProperties && !$scope.detail.appProperties.status) {
                    return true;
                }
                return false;
            }

            $scope.actions.tags.action = function ($event) {
                GApi.execute('drive', 'files.update', {
                    fileId: $scope.detail.id,
                }).then(function (resp) {
                    $scope.detail = null;
                }, function () {
                    //ha ocurrido un error
                });
            }

            $scope.reset();
        }
    });

angular
    .module('e-invoice.components', [])
    .controller("MultipleMatchesController", ['$scope', '$mdDialog', function ($scope, $mdDialog) {
        console.log("Pude cargar el MultipleMatchesController");


    }]);

function MultipleMatchesController($scope, $mdDialog, dates, amounts) {
    $scope.dates = dates;
    $scope.amounts = amounts;
    $scope.result = {};
    $scope.formatedDate = function (date) {
        return moment(date).format("DD/MM/YYYY");
    }

    $scope.formatedAmount = function (amount) {
        return numeral(amount).format('0,0');
    }

    $scope.selectDate = function (date) {
        $scope.result.expirationDate = date;
    }

    $scope.selectAmount = function (amount) {
        $scope.result.amount = amount;
    }

    $scope.yes = function (message) {
        $mdDialog.hide(this.result);
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
