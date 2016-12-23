describe('BrowseProductsCtrl', function () {

    var $scope, $rootScope, $controller, mockedGlobalData, $q, mockedCategory = {};
    var productResult, browseProdCtrl, mockedProductSvc, deferredProducts, mockedPriceSvc, defferedPrices, pricesResult;

    mockedGlobalData = {};
    mockedGlobalData.store = {};
    mockedGlobalData.products = {};
    mockedGlobalData.products.meta = {};
    mockedGlobalData.products.meta.total = 10;
    mockedGlobalData.getCurrencyId = jasmine.createSpy('getCurrencyId').andReturn('USD');
    mockedGlobalData.getCurrencySymbol = jasmine.createSpy('getCurrencySymbol').andReturn('$');
    mockedGlobalData.getProductRefinements = jasmine.createSpy('getProductRefinements').andReturn([{id: 'name', name: 'A-Z'}]);
    mockedGlobalData.getCurrency = jasmine.createSpy('getCurrency').andReturn('USD');
    mockedCategory.id = 123;
    mockedCategory.assignments = [
        {
            'id': 456,
            'ref': {
                'id': 'prod1',
                'type': 'product'
            }
        }
    ];
    
    mockedCategory.media = [
        {
          url: 'http://uncommited-1.link',
          uncommittedMedia: true
        },
        {
          url: 'http://commited.link',
        },
        {
          url: 'http://uncommited-2.link',
          uncommittedMedia: true
        }
    ];

    var mockedState = { transitionTo: jasmine.createSpy()};

    var mockedCategorySvc = {};
    var mockedSettings = {placeholderImage: 'image', headers: { paging: {total: 'x'}}, eventSource:{ languageUpdate: 'languageUpdate'}};

    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    //beforeEach(angular.mock.module('ds.shared'));
    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.products'));

    beforeEach(inject(function(_$rootScope_, _$controller_) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;

    }));


    beforeEach(inject(function (_$q_) {

        $q = _$q_;
        mockedProductSvc = {};
        productResult = [
            {
                "id": "prod1",
                "name": "prod1",
                "media": [
                    {"url": "http://myimageurl1"}, {"url": "http://myimageurl2"}
                ],
                "metadata": {
                    "variants": {
                        "options": {
                            "var-1": "https://api.yaas.io/hybris/schema/v1/tenant/var-1"
                        }
                    }
                }
            },
            {
                "id": "prod2",
                "name": "prod2",
                "media": [
                    {"url": "http://myimageurl2"}, {"url": "http://myimageurl1"}
                ],
                "metadata": {
                    "variants": {
                        "options": {
                            "var-1": "https://api.yaas.io/hybris/schema/v1/tenant/var-1"
                        }
                    }
                }
            }
        ];
        productResult.headers =  [];
        deferredProducts = $q.defer();
        deferredProducts.resolve(productResult);
        mockedProductSvc.query = jasmine.createSpy('query').andReturn(deferredProducts.promise);
        mockedProductSvc.queryProductList = jasmine.createSpy('queryProductList').andReturn(deferredProducts.promise);
        deferredVariants = $q.defer();
        deferredVariants.resolve(['foo']);
        mockedProductSvc.getProductVariants = jasmine.createSpy('getProductVariants').andReturn(deferredVariants.promise);

        mockedPriceSvc = {};
        pricesResult = [
        ];
        pricesResult.headers = [];
        defferedPrices = $q.defer();
        defferedPrices.resolve(pricesResult);
        mockedPriceSvc.getPrices = jasmine.createSpy('getPrices').andReturn(defferedPrices.promise);
        mockedPriceSvc.getPricesMapForProducts = jasmine.createSpy('getPricesMapForProducts').andReturn(defferedPrices.promise);
    }));

    describe('Initialization', function () {

        var selectedCat;



        beforeEach(function () {
            $rootScope.$on('category:selected', function(eve, obj){
                selectedCat = obj.category;
            });

            browseProdCtrl = $controller('BrowseProductsCtrl',
                {'$scope': $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, 'category': mockedCategory, '$state': mockedState, 'CategorySvc': mockedCategorySvc, 'PriceSvc': mockedPriceSvc});
        });

        it('should set image placeholder', function(){
            expect($scope.PLACEHOLDER_IMAGE).toBeTruthy();
        });

        it('should fire category:selected event', function(){
            expect(selectedCat).toEqualData(mockedCategory);
        });

        it('should query products', function () {
            $scope.products = [];

            // trigger promise resolution:
            $scope.$digest();
            expect(mockedProductSvc.queryProductList).toHaveBeenCalled();
            // indirect testing via resolved promise
            expect($scope.products).toEqualData(productResult);
        });

        it('should use first committed URL for main image', function(){
            $scope.$digest();
            expect($scope.products[0].mainImageURL).toEqualData('http://myimageurl1');
            expect($scope.products[1].mainImageURL).toEqualData('http://myimageurl2');
        });
        
        it('should use first committed media as a category main image', function(){
            $scope.$digest();
            expect($scope.mainCategoryImage.url).toEqualData('http://commited.link');
        });

    });

    describe('Initialize with category without assignments', function(){
        beforeEach(function () {
            browseProdCtrl = $controller('BrowseProductsCtrl',
                {'$scope': $scope, '$rootScope': $rootScope,  'ProductSvc': mockedProductSvc, 'GlobalData':mockedGlobalData,
                    'settings': mockedSettings, 'category': {assignments:[]}, '$state': mockedState, 'CategorySvc': mockedCategorySvc, 'PriceSvc': mockedPriceSvc});

        });

        it('should set count properties to zero', function(){
            expect($scope.products).toEqualData([]);
            expect($scope.pagination.productsFrom).toEqualData(0);
            expect($scope.pagination.productsTo).toEqualData(0);
            expect($scope.total).toEqualData(0);
        });

    });

    describe('function', function() {
        beforeEach(function () {
            browseProdCtrl = $controller('BrowseProductsCtrl',
                {$scope: $scope, '$rootScope': $rootScope, 'ProductSvc': mockedProductSvc, 'GlobalData': mockedGlobalData,
                    'settings': mockedSettings, 'category': mockedCategory, '$state': mockedState, 'CategorySvc': mockedCategorySvc, 'PriceSvc': mockedPriceSvc});
        });


        describe('addMore', function () {

            it(' should query products and add them to the scope if no sorting', function () {
                $scope.products = [];
                $scope.addMore();
                // validate that "add more" added products returned by query to the scope
                expect(mockedProductSvc.queryProductList).toHaveBeenCalled();
                // expect($scope.products).toEqualData(products);
            });

            it('should not query products if sorting enabled', function () {
                $scope.sort = 'price';
                mockedProductSvc.query.reset();
                $scope.addMore();
                expect(mockedProductSvc.query.callCount).toBe(0);
            });

        });

        describe('setSortedPage', function () {
            it('setSortedPage should update current page and query products', function () {

                $scope.setSortedPage();
                expect(mockedProductSvc.queryProductList).toHaveBeenCalled();
                expect($scope.setSortedPageNumber).toBe(1)
            });
        });

        describe('setSortedPage product Loading scenarios ', function(){
            beforeEach(function(){
                $scope.total = 36;
                $scope.pageSize = 8;
            });
            it('the current product page is 1 setSorted should load the first 8 products', function(){

                $scope.pageNumber = 1;
                $scope.setSortedPage();
                expect($scope.setSortedPageSize).toBe(8)

            });

            it('the current product page is 3 so setSorted should load the first 24 products', function(){

                $scope.pageNumber = 3;
                $scope.setSortedPage();
                expect($scope.setSortedPageSize).toBe(24)

            });

            it('the current product page is 5 so setSorted should return all of the products from the query', function(){
                $scope.pageNumber = 5;
                $scope.setSortedPage();
                expect($scope.setSortedPageSize).toBe($scope.total)
            });

        });

        describe('backToTop', function () {
            it('should scroll to 0, 0', function () {
                window.scrollTo(0, 5);
                $scope.backToTop();
                expect(window.pageYOffset).toEqualData(0);
            });
        });

        describe('showRefineContainer', function(){
           it('should toggle refineContainerShowing', function(){
              $scope.refineContainerShowing = false;
               $scope.showRefineContainer();
               expect($scope.refineContainerShowing).toBeTruthy();
               $scope.showRefineContainer();
               expect($scope.refineContainerShowing).toBeFalsy();
           });
        });

        describe('onCategory:Selected', function(){
            var catDef;

            beforeEach(function(){
                catDef = $q.defer();
                mockedCategorySvc.getCategoryById = jasmine.createSpy('getCategoryById').andCallFake(function(){
                   return catDef.promise;
                });
            });

           it('should retrieve new category and reload if language changed', function(){
               $rootScope.$emit('categories:updated', {categories: [], source: mockedSettings.eventSource.languageUpdate});
               var cat = {slug: 'slug'};
               catDef.resolve(cat);
               $scope.$apply();
               expect(mockedCategorySvc.getCategoryById).toHaveBeenCalledWith(mockedCategory.id);
               expect(mockedState.transitionTo).toHaveBeenCalledWith( 'base.category', { catName : 'slug' }, { reload : true, inherit : true, notify : true });
           });

            it('should not reload if no language change', function(){
                $rootScope.$emit('categories:updated', {categories: []});
                expect(mockedCategorySvc.getCategoryById).not.toHaveBeenCalled();
            });
        });

    });

});