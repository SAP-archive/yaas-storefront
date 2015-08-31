/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.ybreadcrumb', [])
    .run(['$templateCache', function($templateCache) {
        $templateCache.put('template/y-breadcrumb.html',
            '<div class="breadcrumb-container" ng-show=\"items.path && items.path.length > 1\">' +
                '<div ng-show=\"size !== \'small\'\" class=\"row productListingBreadCrumb\" ng-cloak>' +
                    '<div ng-if=\"items.name\" class=\"col-xs-12 col-sm-6  title breadCrumbText\">' +
                        '<a ng-repeat=\"item in items.path\" ng-if=\"!$last\" ui-sref=\"base.category({catName: item.slug})\" id=\"bc{{item.id}}\">' +
                            '<span ng-if=\"!$first\"> / </span> {{item.name}}' +
                        '</a>' +
                        '<span ng-if=\"items.path && items.path.length > 1\"> / </span>' +
                        '<span class="last">{{items.path[items.path.length -1].name}}</span>' +
                    '</div>' +
                '</div>' +
                '<small  ng-show=\"size === \'small\'\"><a ng-repeat=\"item in items.path\" ui-sref=\"base.category({catName: item.slug})\" id=\"bc{{item.id}}\">' +
                    '<span ng-if=\"!$first\">/</span> {{item.name}}' +
                '</a></small>' +
            '</div>'
        );
    }]);

angular.module('ds.ybreadcrumb')
    .directive('ybreadcrumb',function() {
        return {
            restrict: 'E',
            scope: {
                items: '=yitem',
                size: '=size'
            },
            templateUrl: 'template/y-breadcrumb.html',
            replace: true
        };
    });