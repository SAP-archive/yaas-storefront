/**
 *
 */

describe('BrowseProductsCtrl Test', function () {

    var $scope, mockedProductSvc, browseProdCtrl;

    beforeEach(module('ds.products'));

    beforeEach(module(function($provide) {
        mockedProductSvc = {
            query: jasmine.createSpy()
        };

        $provide.value('ProductSvc', mockedProductSvc);

    }));

    beforeEach(module('ds.products.ctrl'));

    //beforeEach(module('ds.products'));

    beforeEach(inject(function(_$rootScope_, $controller) {
        $scope = _$rootScope_.$new();
        browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});

    }));

    /*     NOT WORKING YET
    describe('BrowseProductsCtrl', function() {
        it('addMore should query product service', function(){
            $scope.addMore();
            expect(mockedProductSvc.query).toHaveBeenCalled();
        })
    }) */



});
