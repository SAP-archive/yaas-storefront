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

/* jshint ignore:start */

angular.module('ds.ysearch', ['algoliasearch'])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('template/ysearch.html',
            '<div class="y-search">' +
                ' <div class="right-inner-addon"> ' +
                    '<i class="glyphicon glyphicon-search js-glyphicon"></i>' +
                    '<input autocomplete="off" placeholder="{{\'SEARCH\' | translate}}" type="text" ng-model="search.text" ng-change="doSearch(search.text, search.page)" ng-focus="showSearchResults()" class="y-input form-control input-md" />' +
                ' </div>' +

                '<div class="y-search-container" >' +
                    '<a class="form-control y-search-results" ng-click="hideSearchResults()" ui-sref="base.product.detail( {productId: result.objectID} )" ng-repeat="result in search.results">' +
                        '<div class="attribute">' +
                            '<span class="y-search-result-name text-left" ng-bind-html="result._highlightResult.name[0].value"></span>' +
                            //'<span class="y-search-result-description"  ng-bind-html="result._highlightResult.description[0].value"></span>' +
                        '</div>' +
                    '</a>' +
                    '<a class=" y-search-count text-center" ng-click="hideSearchResults()"  ui-sref="base.search({ searchString:search.text })" >{{\'SEE_ALL\' | translate}} {{search.numberOfHits}} {{\'RESULTS\' | translate}} <span class="glyphicon glyphicon-chevron-right pull-right"></span></a>' +
                '</div>' +
            '</div>'
        );
    }]);

/* jshint ignore:end */

angular.module('ds.ysearch')
    .directive('ysearch', ['ysearchSvc','$rootScope', function (ysearchSvc, $rootScope) {
        return {
            restrict: 'E',
            scope: {
                parametersToReturn: '=?returnParameters',
                page: '=?page',
                searchString: '=?searchString'
            },
            replace: true,
            templateUrl: 'template/ysearch.html',
            link: function (scope) {

                if(!scope.page){
                    scope.page = 0;
                }
                if(!scope.searchString){
                    scope.searchString = '';
                }

                //Init of algolia search service
                ysearchSvc.init();

                scope.search = {
                    text: scope.searchString,
                    results: [],
                    numberOfHits: 0
                };

                scope.showSearchResults = function () {
                    $('.js-glyphicon').addClass('active');
//                    $rootScope.showMobileNav = true;
                    if (scope.search.text !== '') {
                        if(scope.search.results.length === 0){
                            scope.doSearch(scope.search.text, 0);
                        }
                        else {
                            $('.y-search-container').show();
                            
                        }
                    }
                };

                scope.hideSearchResults = function () {
                    $rootScope.closeOffcanvas();
                    $('.y-search-container').hide();
                    $('.js-glyphicon').removeClass('active');
//                    $rootScope.showMobileNav = false;
                };

                //Used for checking if the user left te search field
                $(document).mouseup(function (e) {
                    var container = $('.y-search');
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        $('.y-search-container').hide();
                        $('.js-glyphicon').removeClass('active');
//                        $rootScope.showMobileNav = false;
                    }
                });

                scope.doSearch = function () {

                    $('.y-search-container').show();
                    $('.js-glyphicon').addClass('active');
//                    $rootScope.showMobileNav = true;
                    if (scope.search.text === '') {
                        $('.y-search-container').hide();
                        $('.js-glyphicon').removeClass('active');
//                        $rootScope.showMobileNav = false;
                        scope.search.results = [];
                        scope.search.numberOfHits = 0;
                    }
                    else {
                        ysearchSvc.getResults(scope.search.text, {hitsPerPage: 5, page: 0 })
                            .then(function (content) {
                                if (content.query !== scope.search.text) {
                                    // do not take out-dated answers into account
                                    return;
                                }
                                scope.search.numberOfHits = content.nbHits;
                                scope.search.results = content.hits;


                                console.log(content);
                            }, function (content) {
                                console.log('Error: ' + content.message);
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
            client = algolia.Client('MSSYUK0R36', GlobalData.search.algoliaKey, {method: 'https'});
            index = client.initIndex(GlobalData.store.tenant);
        };

        var getResults = function (searchString, parameters) {
            return index.search(searchString, parameters);
        };

        return {
            init: init,
            getResults: getResults
        };
    }]);
