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
    .directive('ysearch', ['ysearchSvc','$rootScope', function (ysearchSvc, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                parametersToReturn: '=?returnParameters',
                page: '=?page',
                searchString: '=?searchString'
            },
            replace: true,
            templateUrl: 'js/app/shared/templates/ysearch.html',
            link: function (scope) {

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
                    searchAvailable: true
                };

                scope.yglyphiconVisible = false;

                //Init of algolia search service
                scope.search.searchAvailable = ysearchSvc.init();


                scope.showSearchResults = function () {

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
                $(document).mouseup(function (e) {
                    var container = $('.y-search');
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
                        ysearchSvc.getResults(scope.search.text, {hitsPerPage: 5, page: 0})
                            .then(function (content) {
                                if (content.query !== scope.search.text) {
                                    // do not take out-dated answers into account
                                    return;
                                }
                                scope.search.numberOfHits = content.nbHits;
                                scope.search.results = content.hits;
                                console.log(content.hits);
                            }, function () {
                            });
                    }
                };
            }
        };
    }]);

angular.module('ds.ysearch')
    .filter('highlight', function ($sce) {
        return function (text, phrase) {
            if (phrase && phrase.length > 1) {
                text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<em>$1</em>');
            }

            return $sce.trustAsHtml(text);
        };
    });

angular.module('ds.ysearch')
    .factory('ysearchSvc', ['ConfigurationREST','algolia', 'SiteConfigSvc', 'GlobalData', function (ConfigurationREST, algolia, siteConfig, GlobalData) {

        var client, index;

        var init = function () {
            if(GlobalData.search.algoliaKey !== '') {
                //Search available for this project
                client = algolia.Client(GlobalData.search.algoliaProject, GlobalData.search.algoliaKey, {method: 'https'});
                index = client.initIndex(GlobalData.store.tenant);
                return true;
            }
            else{
                return false;
            }
        };

        var getResults = function (searchString, parameters) {
            return index.search(searchString, parameters);
        };

        return {
            init: init,
            getResults: getResults
        };
    }]);
