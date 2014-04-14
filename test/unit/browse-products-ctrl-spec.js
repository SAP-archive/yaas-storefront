/**
 *
 */

describe('BrowseProductsCtrl Test', function () {

    var $scope, q, mockedProductSvc, browseProdCtrl, deferredProducts;

    var $rootScope;


    beforeEach(module(function($provide) {
       /*
        mockedProductSvc = {
            query: function() {
                deferredProducts = q.defer();
                deferredProducts.resolve('someValue');

                deferredProducts.$promise = function() {
                    return deferredProducts.promise;
                }
                return deferredProducts.promise;
            }
        }; */
        mockedProductSvc = {
            query: jasmine.createSpy()
        };

        $provide.value('ProductSvc', mockedProductSvc);
        $provide.value('ProductSvc', mockedProductSvc);

    }));

    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, $controller, $q){
            $scope = _$rootScope_.$new();
            q = $q;
            deferredProducts = q.defer();
            deferredProducts.resolve('someValue');

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});
    }));

    describe('BrowseProductsCtrl', function() {

        it('constructor should query product service', function(){
            /*
            spyOn(mockedProductSvc, 'query').andReturn(deferredProducts.promise);
            $scope = _$rootScope_.$new();

            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});
            */
            expect(mockedProductSvc.query).toHaveBeenCalled();
            //$scope.addMore();
            //expect(mockedProductSvc.query).toHaveBeenCalled();
        })

        /*
        it('addMore should query product service', inject(function(_$rootScope_, $controller, $q){

            spyOn(mockedProductSvc, 'query');
            $scope = _$rootScope_.$new();
            q = $q;
            browseProdCtrl = $controller('BrowseProductsCtrl', {$scope: $scope, 'ProductSvc': mockedProductSvc});
            $scope.addMore();
            expect(mockedProductSvc.query).toHaveBeenCalled();
        })) */
    })




});
