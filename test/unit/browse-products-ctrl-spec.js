describe('BrowseProductsCtrl Test', function () {

    var $scope, mockedProductSvc, browseProdCtrl;

    beforeEach(module(function($provide) {
        mockedProductSvc = {
            query: jasmine.createSpy()
        };

        $provide.value('ProductSvc', mockedProductSvc);

    }));

    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, $controller) {
        $scope = _$rootScope_.$new();
        browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});

    }));


    describe('BrowseProductsCtrl', function () {
        it('should query products on initialization', function () {
            expect(mockedProductSvc.query).toHaveBeenCalled();
        })
    })


});
