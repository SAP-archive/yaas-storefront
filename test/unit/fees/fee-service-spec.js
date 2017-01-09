/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('Fee Service Test:', function () {

    var $scope, $rootScope, $q;

    var FeeREST;
    var FeeSvc;
    var GlobalData;

    var storeTenant = '121212';
    var eng = 'English';

    var mockedGlobalData = {
        store: { tenant: storeTenant },
        setLanguage: jasmine.createSpy('setLanguage'),
        setCurrency: jasmine.createSpy('setCurrency'),
        getLanguageCode: function () { return 'en' },
        getCurrencySymbol: function () { return '$' },
        getAvailableLanguages: function () { return [{ id: 'en', label: eng }] },
        getAvailableCurrency: function () { return 'USD' },
        getCurrency: function () { return null },
        getCurrencyId: function () { return 'USD'; },
        getSiteCode: function () { return 'US'; },
        getSiteMixins: jasmine.createSpy('getSiteMixins')
    };

    var mockedAppConfig = {
        storeTenant: function () {
            return '121212/';
        },
        dynamicDomain: function () {
            return 'api.yaas.io';
        }
    };

    // Load shared Jasmine custom matchers
    beforeEach(jasmineCustomMatchers);

    beforeEach(module('ds.fees', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
    }));

    beforeEach(function() {
        module('ds.shared', function ($provide) {
            $provide.constant('appConfig', {});
            $provide.value('GlobalData', mockedGlobalData);
            $provide.constant('appConfig', mockedAppConfig);
        });
    });

    beforeEach(function () {
        module('restangular');
    });

    beforeEach(function () {
        module('ds.i18n');
    });

    beforeEach(inject(function (_FeeREST_, _FeeSvc_, _GlobalData_, _$rootScope_, _$q_) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = _$q_;
        FeeREST = _FeeREST_;
        FeeSvc = _FeeSvc_;
        GlobalData = _GlobalData_;
    }));

    describe('FeeREST Service - ', function() {

        it('GIVEN a feeService mixin is defined in the site mixins WHEN the FeeREST Service is initialized THEN a Restangular configuration should be exposed on the Fee', function() {
            // Set site mixins with a feeService mixin
            setFeeServiceInSiteMixins();
            // Initialize the FeeREST factory
            FeeREST.init();
            expect(FeeREST.Fee).toBeDefined();
            expect(FeeREST.Fee.configuration.baseUrl).toBe("http://my-fee-service.url/121212");
        });

        it('GIVEN a feeService mixin is not defined in the site mixins WHEN the FeeREST Service is initialized THEN a Restangular configuration should not be exposed on the Fee', function() {
            // Set site mixins WITHOUT a feeService mixin
            setNoFeeServiceInSiteMixins();
            // Initialize the FeeREST factory
            FeeREST.init();
            expect(FeeREST.Fee).toBe(null);
        });

    });

    describe('Fee Service - ', function() {

        beforeEach(function() {
            spyOn(FeeREST, 'init');
        });

        it('should expose correct method', function() {
            expect(FeeSvc.getFeesForItemYrn).toBeDefined();
            expect(FeeSvc.getFeesForItemYrnList).toBeDefined();
        });

        it('GIVEN FeeREST.Fee is a Restangular configuration WHEN I request the list of fees for a itemYrn THEN it should initialize the service and return a promise resolving to a list of fees for the first itemYrn match', function() {
            // Set the FeeREST Service as available
            setAvailableFeeRESTService();
            var servicePromise = FeeSvc.getFeesForItemYrn('dummyProductYrn');
            expect(FeeREST.init).toHaveBeenCalled();
            expect(FeeREST.Fee.all).toHaveBeenCalledWith('itemFees/search');
            expect(FeeREST.Fee.post).toHaveBeenCalled();
            expect(FeeREST.Fee.one).toHaveBeenCalledWith('fees');
            expect(FeeREST.Fee.get).toHaveBeenCalled();
            expect(servicePromise).toBeResolvedWithData(
                [
                    {
                        "id": "dummyFeeID",
                        "yrn": "dummyFeeYrn",
                        "name":"dummyFee title",
                        "code": "dummyFeeCode",
                        "feeType": "dummyFeeType",
                        "siteCode": "dummyFeeSiteCode",
                        "feeAbsolute": {
                            "amount": 3.5,
                            "currency": "dummyFeeCurrency"
                        },
                        "active": true,
                        "taxable": false
                    }
                ]
            );
        });

        it('GIVEN FeeREST.Fee is not a Restangular configuration WHEN I request the list of fees for a itemYrn THEN it should initialize the service and return a rejected promise', function() {
            // Set the FeeREST Service as unavailable
            setUnavailableFeeRESTService();
            var promise = FeeSvc.getFeesForItemYrn('dummyProductYrn');
            expect(FeeREST.init).toHaveBeenCalled();
            expect(promise).toBeRejected();
        });

        it('GIVEN FeeREST.Fee is a Restangular configuration WHEN I request the list of fees for a list of itemYrns THEN it should initialize the service and return a promise resolving to a map of fees for the matching itemYrns', function() {
            setAvailableFeeRESTService();
            var servicePromise = FeeSvc.getFeesForItemYrnList(['dummyProductYrn', 'anotherDummyProductYrn']);
            expect(FeeREST.init).toHaveBeenCalled();
            expect(FeeREST.Fee.all).toHaveBeenCalledWith('itemFees/search');
            expect(FeeREST.Fee.post).toHaveBeenCalled();
            expect(FeeREST.Fee.one).toHaveBeenCalledWith('fees');
            expect(FeeREST.Fee.get).toHaveBeenCalled();
            expect(servicePromise).toBeResolvedWithData(
                {
                    dummyProductYrn : [
                        {
                            id : 'dummyFeeID',
                            yrn : 'dummyFeeYrn',
                            name : 'dummyFee title',
                            code : 'dummyFeeCode',
                            feeType : 'dummyFeeType',
                            siteCode : 'dummyFeeSiteCode',
                            feeAbsolute : { amount : 3.5, currency : 'dummyFeeCurrency' },
                            active : true, taxable : false
                        }
                    ],
                    anotherDummyProductYrn : [
                        {
                            id : 'dummyFeeID3',
                            yrn : 'dummyFeeYrn3',
                            name : 'dummyFee title',
                            code : 'dummyFeeCode3',
                            feeType : 'dummyFeeType',
                            siteCode : 'dummyFeeSiteCode',
                            feeAbsolute : { amount : 20, currency : 'dummyFeeCurrency' },
                            active : true, taxable : false
                        }
                    ]
                }
            );
        });

        it('GIVEN FeeREST.Fee is not a Restangular configuration WHEN I request the list of fees for a list of itemYrns THEN it should initialize the service and return a rejected promise', function() {
            // Set the FeeREST Service as unavailable
            setUnavailableFeeRESTService();
            var promise = FeeSvc.getFeesForItemYrnList(['dummyProductYrn', 'anotherDummyProductYrn']);
            expect(FeeREST.init).toHaveBeenCalled();
            expect(promise).toBeRejected();
        });
    });


    /******************
     * Helper functions
     *******************/

    function setFeeServiceInSiteMixins() {
        GlobalData.getSiteMixins.andReturn({
            feeService: {
                active: true,
                serviceUrl: "http://my-fee-service.url/"
            },
            otherMixin: {
                property1: true,
                property2: "Dummy String"
            }
        });
    }

    function setNoFeeServiceInSiteMixins() {
        GlobalData.getSiteMixins.andReturn({
            otherMixin: {
                property1: true,
                property2: "Dummy String"
            }
        });
    }

    function setAvailableFeeRESTService() {
        // Create a mocked search response data object
        var searchResponseData = {
            plain: function() {
                return [
                    {
                        "itemYrn": "dummyProductYrn",
                        "fees": [
                            {
                                "id": "dummyFeeID",
                                "yrn": "dummyFeeYrn",
                                "name": {
                                    "en": "dummyFee English title",
                                    "de": "dummyFee German title"
                                },
                                "code": "dummyFeeCode",
                                "feeType": "dummyFeeType",
                                "siteCode": "dummyFeeSiteCode",
                                "feeAbsolute": {
                                    "amount": 3.5,
                                    "currency": "dummyFeeCurrency"
                                },
                                "active": true,
                                "taxable": false
                            }
                        ]
                    },
                    {
                        "itemYrn": "dummyProductYrnContainingSearchedProductYrn",
                        "fees": [
                            {
                                "id": "dummyFeeID2",
                                "yrn": "dummyFeeYrn2",
                                "name": {
                                    "en": "dummyFee English title",
                                    "de": "dummyFee German title"
                                },
                                "code": "dummyFeeCode2",
                                "feeType": "dummyFeeType",
                                "siteCode": "dummyFeeSiteCode",
                                "feeAbsolute": {
                                    "amount": 5.5,
                                    "currency": "dummyFeeCurrency"
                                },
                                "active": true,
                                "taxable": false
                            }
                        ]
                    },
                    {
                        "itemYrn": "anotherDummyProductYrn",
                        "fees": [
                            {
                                "id": "dummyFeeID3",
                                "yrn": "dummyFeeYrn3",
                                "name": {
                                    "en": "dummyFee English title",
                                    "de": "dummyFee German title"
                                },
                                "code": "dummyFeeCode3",
                                "feeType": "dummyFeeType",
                                "siteCode": "dummyFeeSiteCode",
                                "feeAbsolute": {
                                    "amount": 20,
                                    "currency": "dummyFeeCurrency"
                                },
                                "active": true,
                                "taxable": false
                            }
                        ]
                    }
                ];
            }
        };

        // Define a simple RestAngular Mock
        var restangularMock = {
            all: function() { return this; },
            post: function() {
                return {
                    then: function(callback) {
                        return callback(searchResponseData);
                    }
                }
            },
            one: function() { return this; },
            get: function() {}
        };

        // Assign the mock to the Fee property
        FeeREST.Fee = restangularMock;

        // Define spies
        spyOn(FeeREST.Fee, 'all').andCallThrough();
        spyOn(FeeREST.Fee, 'post').andCallThrough();
        spyOn(FeeREST.Fee, 'one').andCallThrough();

        var dummyFeeData = {
            plain: function(){
                return [
                    {
                        "id": "dummyFeeID",
                        "yrn": "dummyFeeYrn",
                        "name": "dummyFee title",
                        "code": "dummyFeeCode",
                        "feeType": "dummyFeeType",
                        "siteCode": "dummyFeeSiteCode",
                        "feeAbsolute": {
                            "amount": 3.5,
                            "currency": "dummyFeeCurrency"
                        },
                        "active": true,
                        "taxable": false
                    },
                    {
                        "id": "dummyFeeID3",
                        "yrn": "dummyFeeYrn3",
                        "name": "dummyFee title",
                        "code": "dummyFeeCode3",
                        "feeType": "dummyFeeType",
                        "siteCode": "dummyFeeSiteCode",
                        "feeAbsolute": {
                            "amount": 20,
                            "currency": "dummyFeeCurrency"
                        },
                        "active": true,
                        "taxable": false
                    }
                ]
            }
        };

        spyOn(FeeREST.Fee, 'get').andCallFake(function() {
            return $q.when(dummyFeeData);
        });
    }

    function setUnavailableFeeRESTService() {
        // Set a null Fee property (service unavailable)
        FeeREST.Fee = null;
    }

});
