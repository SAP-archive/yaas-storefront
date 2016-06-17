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

/**
 * Localized Addresses: dynamic address forms based on user selection of localization.
 **/

angular.module('ds.addresses')
    .directive('localizedAddresses', ['$compile', '$http', '$templateCache', '$rootScope', 'ShippingSvc', 'Countries',
        function($compile, $http, $templateCache, $rootScope, ShippingSvc, Countries) {

            var selectionArray = [
                {id: 'US', name:'USA'},
                {id: 'CA', name:'CANADA'},
                {id: 'GB', name:'GREAT BRITAIN'}, // feature toggle extra countries.
                {id: 'DE', name:'GERMANY'}];
                // {id: 'CN', name:'CHINA'},
                // {id: 'JP', name:'JAPAN'}];

            var allCountries = Countries.world.countries;

            var initialize = function(scope, elem, viewType){
                // init with default template type
                loadTemplate(scope, elem, '', viewType);
                selectDefaultLocale(scope, viewType);
            };

            var selectDefaultLocale = function (scope, viewType) {

                if (!scope.localeSelection) {
                    scope.localeSelection = {selected: {id: '', name: ''}};
                }
                switch(viewType){
                    case 'addAddress':
                        if (scope.address) {
                            scope.address.country = scope.localeSelection ? scope.localeSelection.id : '';
                        }
                        break;
                    case 'billing':
                        if (scope.order.billTo) {
                            scope.order.billTo.country = scope.localeSelection ? scope.localeSelection.id : '';
                        }
                        break;
                    case 'shipping':
                        if (scope.order.shipTo) {
                            scope.order.shipTo.country = scope.localeSelection ? scope.localeSelection.id : '';
                        }
                        break;
                    default:
                        break;
                }
            };

            // load dynamic address template into scope
            var loadTemplate = function(scope, elem, locale, viewType){
                var tempLoader = getTemplate(scope, locale, viewType);
                // handle http request response, show, compile, init validation.
                tempLoader.success(function(template) {
                    elem.html(template).show();
                }).then( function () {
                    $compile(elem.contents())(scope);
                });
            };

            var getTemplate = function(scope, locale, viewType) {
                var templateLoader, templateUrl,
                baseUrl = 'js/app/addresses/templates/';

                // when locale is not recognized set default template
                if( !_.contains(_.pluck(selectionArray, 'id'), locale)){
                    locale = 'Default';
                    scope.isDefaultForm = true;
                } else {
                    scope.isDefaultForm = false;
                }

                // set dynamic template url and return promise
                templateUrl = baseUrl + viewType + locale + '.html';
                templateLoader = $http.get(templateUrl, {cache: $templateCache});

                return templateLoader;
            };

            var getLocaleSelection = function(id) {
                var locale = {};
                angular.forEach(allCountries, function(item){
                    if (item.id === id){
                        locale = item;
                    }
                });
                return locale;
            };

            var getShipToCountries = function (array) {
                var shipToCountries = [];
                for (var i = 0; i < allCountries.length; i++) {
                    for (var j = 0; j < array.length; j++) {
                        if (allCountries[i].id === array[j]) {
                            shipToCountries.push(allCountries[i]);
                        }
                    }
                }
                return shipToCountries;
            };

            var templateLinker = function(scope, element, attrs) {

                scope.viewTarget = attrs.type;
                scope.usStates = Countries.us.states;
                scope.caProvinces = Countries.canada.provinces;
                
                if (scope.viewTarget === 'shipping' && scope.shippingCountries.length) {
                    scope.localeSelections = getShipToCountries(scope.shippingCountries);
                } else {
                    scope.localeSelections = allCountries;
                }

                // localization selection handler
                scope.initializeLocale = function(locale){
                    loadTemplate(scope, element, locale.id, attrs.type);
                };

                scope.setLocale = function (item) {
                    scope.localeSelection.selected = item;
                    scope.changeLocale(item);
                };

                // localization selection handler
                scope.changeLocale = function(locale){
                    loadTemplate(scope, element, locale.id, attrs.type);
                    //set dynamic datamodel
                    switch(scope.viewTarget){
                        case 'addAddress':
                            scope.address.country = locale.id;
                            scope.address.companyName = '';
                            scope.address.street = '';
                            scope.address.streetAppendix = '';
                            scope.address.city = '';
                            scope.address.state = '';
                            scope.address.zipCode = '';
                            scope.address.contactPhone = '';
                            break;
                        case 'billing':
                            scope.order.billTo.country = locale.id;
                            scope.order.billTo.companyName = '';
                            scope.order.billTo.address1 = '';
                            scope.order.billTo.address2 = '';
                            scope.order.billTo.city = '';
                            scope.order.billTo.state = '';
                            scope.order.billTo.zipCode = '';
                            scope.order.billTo.contactPhone = '';
                            break;
                        case 'shipping':
                            scope.order.shipTo.country = locale.id;
                            scope.order.shipTo.companyName = '';
                            scope.order.shipTo.address1 = '';
                            scope.order.shipTo.address2 = '';
                            scope.order.shipTo.city = '';
                            scope.order.shipTo.state = '';
                            scope.order.shipTo.zipCode = '';
                            scope.order.shipTo.contactPhone = '';
                            break;
                        default:
                            break;
                    }
                    //Here should be implmented logic for shipping address when is active
                    if (scope.viewTarget === 'shipping') {
                        $rootScope.$broadcast('event:shipping-cost-updated', {shipToAddress: scope.order.shipTo});
                    }
                    if (scope.viewTarget !== 'addAddress') {
                        $rootScope.closeCartOnCheckout();
                    }
                };

                $rootScope.$on('noShippingCosts', function (){
                    scope.localeSelection = {selected: {id: '', name: ''}};
                });

                // event for loading addressbook change request
                var unbind = $rootScope.$on('localizedAddress:updated', function (e, name, target) {
                    var locale = getLocaleSelection(name);
                    if( scope.viewTarget === target){
                        scope.localeSelection = {
                            selected: locale
                        };
                        scope.initializeLocale(locale);
                    }
                    if (target === 'addAddress') {
                        scope.address.country = locale.id;
                    }
                });
                scope.$on('$destroy', unbind);


                initialize(scope, element, scope.viewTarget);
            };

            return {
                scope: true,
                restrict: 'E',
                link: templateLinker
            };
    }]);
