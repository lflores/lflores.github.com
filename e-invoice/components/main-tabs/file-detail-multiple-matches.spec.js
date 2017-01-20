describe('Unit: mdDialog', function () {

    var $mdDialog;

    beforeEach(function () {
        angular.mock.module('e-invoice');

        angular.mock.inject(function ($controller, $rootScope, $injector, $compile, $mdDialog, $scope) {
            controller = $controller;
            $mdDialog = $injector.get('$mdDialog');

            ctrl = controller("MultipleMatchesController", ['$scope']);
        });
    });
    //    it(': Opened', function () {
    //
    //        var $mdDialogOpened = false;
    //        $mdDialog.show = jasmine.createSpy().and.callFake(function () {
    //            $mdDialogOpened = true;
    //        });
    //
    //        ctrl.openModal({
    //            dates: [],
    //            amounts: []
    //        });
    //        //scope.$digest();
    //
    //        //expect($mdDialog.show).to.have.been.calledOnce;
    //        //expect($mdDialogOpened).to.be.true;
    //    });
});
