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
 *	Localized Addresses: dynamic address forms based on user selection of localization.
 **/

angular.module('ds.addresses').
    directive('localizedAddresses', ['$compile', '$http', '$templateCache', '$rootScope',
		function($compile, $http, $templateCache, $rootScope) {

		var selectionArray = [
				{id: 'USA', name:'USA'},
				{id: 'CAN', name:'CANADA'},
				{id: 'UK',  name:'UK'},
				{id: 'GER', name:'GERMANY'},
				{id: 'CHI', name:'CHINA'},
				{id: 'JPN', name:'JAPAN'}];

		var initialize = function(scope, elem, viewType){
			// init with default template type
			loadTemplate(scope, elem, '', viewType);
		};

		var loadTemplate = function(scope, elem, locale, viewType){

			// load dynamic address template into scope
			var viewForm;
            var tempLoader = getTemplate(locale, viewType);

            // handle http request response, show, compile, init validation.
            tempLoader.success(function(template) {
				elem.html(template).show();
            }).then( function () {
                $compile(elem.contents())(scope);

                // viewForm = getViewForm(scope);
                // if(viewForm){
                //     // reinitialize form validation
                //     viewForm.$rollbackViewValue();
                //     // viewForm.$setUntouched();
                //     viewForm.$setPristine();
                // }

            });
		};

        var getTemplate = function(locale, viewType) {

            var templateLoader, templateUrl,
            baseUrl = 'js/app/addresses/templates/';

            // if view is not recognized set default template
			if( !_.contains(_.pluck(selectionArray, 'id'), locale) ){
				locale = 'USA';
			}

            // set dynamic template url and return promise
            templateUrl = baseUrl + viewType + locale + '.html';
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;
        };

		var getLocaleSelection = function(name) {
			var locale = {};
			angular.forEach(selectionArray, function(item){
				if (item.name === name){
					locale = item;
				}
			});
			return locale;
		};

        var getViewForm = function(scope){
			switch(scope.viewTarget){
				case 'addAddress':
					return scope.addressForm;
				case 'billing':
					return scope.billToForm;
				case 'shipping':
					return scope.shipToForm;
				default:
					return null;
			}
        };

        var templateLinker = function(scope, element, attrs) {

			scope.viewTarget = attrs.type;
			scope.localeSelections = selectionArray;

			// localization selection handler
			scope.initializeLocale = function(locale){
				loadTemplate(scope, element, locale.id, attrs.type);
			};

			// localization selection handler
			scope.changeLocale = function(locale){

				loadTemplate(scope, element, locale.id, attrs.type);

				// set dynamic datamodel
				switch(scope.viewTarget){
					case 'addAddress':
						scope.address.country = locale.name;
						break;
					case 'billing':
						scope.order.billTo.country = locale.name;
						break;
					case 'shipping':
						scope.order.shipTo.country = locale.name;
						break;
					default:
						break;
				}
			};

			// event for loading addressbook change request
			var unbind = $rootScope.$on('localizedAddress:updated', function (e, name, target) {
				var locale = getLocaleSelection(name);
				if( scope.viewTarget === target){
					scope.localeSelection = locale;
					scope.initializeLocale(locale);
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
