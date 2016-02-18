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

'use strict';

angular.module('ds.ysearch', ['algoliasearch'])
    .directive('ysearch', function () {
        return {
            controller: 'ysearchController',
            restrict: 'E',
            scope: {
                parametersToReturn: '=?returnParameters',
                page: '=?page',
                searchString: '=?searchString'
            },
            replace: true,
            templateUrl: 'js/app/shared/templates/ysearch.html'
        };
    });

angular.module('ds.ysearch')
    .controller('ysearchController', ['$scope', '$rootScope', '$state', 'ysearchSvc', 'GlobalData', function (scope, $rootScope, $state, ysearchSvc, GlobalData) {

        if (!scope.page) {
            scope.page = 0;
        }
        if (!scope.searchString) {
            scope.searchString = '';
        }
        scope.search = {
            text: scope.searchString,
            results: [],
            numberOfHits: 0,
            showSearchResults: false,
            searchAvailable: false,
            searchError: false,
            zeroResults: false
        };

        scope.yglyphiconVisible = false;

        //Init of algolia search service
        ysearchSvc.init().then(function () {
            scope.search.searchAvailable = ysearchSvc.getActiveStatus();
        });

        scope.showSearchResults = function () {
            // load the currency before displaying the search results
            // to ensure we get the current site's one
            scope.currency = GlobalData.getCurrency();
            scope.currencySymbol = GlobalData.getCurrencySymbol();

            scope.search.showSearchResults = true;
            if (scope.search.text !== '') {
                if (scope.search.results.length === 0) {
                    scope.doSearch(scope.search.text, 0);
                }
            }
        };

        scope.hideSearchResults = function () {
            $rootScope.closeOffcanvas();
            scope.search.showSearchResults = false;
        };

        //Used for checking if the user left te search field
        angular.element(document)
            .bind('mouseup', function (e) {
                var container = angular.element('.y-search');
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    scope.search.showSearchResults = false;
                    //Used to apply changes for showSearchResults
                    scope.$digest();
                }
            });

        scope.doSearch = function () {
            scope.search.showSearchResults = true;
            if (scope.search.text === '') {
                scope.search.showSearchResults = false;
                scope.search.results = [];
                scope.search.numberOfHits = 0;
            }
            else {
                ysearchSvc.getResults(scope.search.text, { hitsPerPage: 5, page: 0 })
                    .then(function (content) {
                        if (content.query !== scope.search.text) {
                            // do not take out-dated answers into account
                            return;
                        }
                        //Hide error only when search was ok
                        scope.search.searchError = false;
                        scope.search.numberOfHits = content.nbHits;
                        scope.search.results = content.hits;
                        scope.search.searchError = false;

                        if (content.hits.length === 0) {
                            scope.search.zeroResults = true;
                        }
                        else {
                            scope.search.zeroResults = false;
                        }
                    }, function () {
                        //Show error that search didn't perform correctly.
                        scope.search.searchError = true;
                    });
            }
        };

        scope.goToResultsPage = function () {
            if (scope.search && scope.search.text && scope.search.text.length) {
                scope.hideSearchResults();
                $state.go('base.search', { searchString: scope.search.text });
            }
        };
    }]);


angular.module('ds.ysearch')
    .factory('ysearchSvc', ['algolia', 'ysearchREST', '$q', function (algolia, ysearchREST, $q) {
        var client, index, algoliaConfiguration;
        var active = false;

        var init = function () {
            var promise = $q.when(getAlgoliaConfiguration());
            promise.then(function (config) {
                if (!config.algoliaCredentials) {
                    config.algoliaCredentials = {
                        applicationId: '',
                        searchKey: '',
                        indexName: ''
                    };
                }
                if (!!config.activation) {
                    active = config.activation;
                }
                client = algolia.Client(config.algoliaCredentials.applicationId, config.algoliaCredentials.searchKey, { method: 'https' });
                index = client.initIndex(config.algoliaCredentials.indexName);
            });
            return promise;
        };

        var getActiveStatus = function () {
            return active;
        };

        var getAlgoliaConfiguration = function () {
            if (!!algoliaConfiguration) {
                return algoliaConfiguration;
            }
            else {
                algoliaConfiguration = ysearchREST.AlgoliaSettings.all('project').get('configuration');
            }
            return algoliaConfiguration;
        };

        var getResults = function (searchString, parameters) {
            if (index) {
                return index.search(searchString, parameters);
            }
            else {
                return init()
                        .then(function () {
                            return index.search(searchString, parameters);
                        });
            }
        };

        return {
            init: init,
            getActiveStatus: getActiveStatus,
            getResults: getResults
        };
    }]);

angular.module('ds.ysearch')
    .factory('ysearchREST', ['SiteConfigSvc', 'Restangular', function (siteConfig, Restangular) {
        return {
            AlgoliaSettings: Restangular.withConfig(function (RestangularConfigurer) {
                RestangularConfigurer.setBaseUrl(siteConfig.apis.indexing.baseUrl);
            })
        };
    }]);
