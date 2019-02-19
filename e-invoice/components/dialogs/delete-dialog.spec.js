function FakeModal() {
    this.resultDeferred = $q.defer();
    this.result = this.resultDeferred.promise;
}
FakeModal.prototype.open = function (options) {
    return this;
};
FakeModal.prototype.close = function (item) {
    this.resultDeferred.resolve(item);
    $rootScope.$apply(); // Propagate promise resolution to 'then' functions using $apply().
};
FakeModal.prototype.dismiss = function (item) {
    this.resultDeferred.reject(item);
    $rootScope.$apply(); // Propagate promise resolution to 'then' functions using $apply().
};

describe('delete-dialog-component', function () {
    beforeEach(module('e-invoice'));

    // Test the controller
    describe('Test Regex in text', function () {
//        var $httpBackend;
//
//        // Initialize the controller and a mock scope
//        beforeEach(inject(function ($controller, $rootScope) {
//            scope = $rootScope.$new();
//            fakeModal = new FakeModal();
//            MainCtrl = $controller('MainCtrl', {
//                $scope: scope,
//                $modal: fakeModal
//            });
//        }));
//
//
//
//        it("should cancel the dialog when dismiss is called, and  $scope.canceled should be true", function () {
//            expect(scope.canceled).toBeUndefined();
//
//            fakeModal.dismiss("cancel"); //Call dismiss (simulating clicking the cancel button on the modal)
//            expect(scope.canceled).toBe(true);
//        });
    });
});
