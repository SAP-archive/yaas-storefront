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

angular.module('ds.addresses').
	directive('localizedAddresses', ['$compile', '$http', '$templateCache', '$rootScope',
		function($compile, $http, $templateCache, $rootScope) {

		var selectionArray = [
				{id: 'US', name:'USA'},
				{id: 'CA', name:'CANADA'},
				{id: 'GB', name:'GREAT BRITAIN'},
				{id: 'DE', name:'GERMANY'}];
				// TODO: add these back once backing data is available. 
				// Templates contain data schema: region, postal code, address3, address4.
				// {id: 'CN', name:'CHINA'},
				// {id: 'JP', name:'JAPAN'}];

		var initialize = function(scope, elem, viewType){
			// init with default template type
			loadTemplate(scope, elem, '', viewType);
		};

		// load dynamic address template into scope
		var loadTemplate = function(scope, elem, locale, viewType){
			var tempLoader = getTemplate(locale, viewType);
			// handle http request response, show, compile, init validation.
			tempLoader.success(function(template) {
				elem.html(template).show();
			}).then( function () {
				$compile(elem.contents())(scope);
			});
		};

		var getTemplate = function(locale, viewType) {

			var templateLoader, templateUrl,
			baseUrl = 'js/app/addresses/templates/';

			// if view is not recognized set default template
			if( !_.contains(_.pluck(selectionArray, 'id'), locale) ){
				locale = 'US';
			}

			// set dynamic template url and return promise
			templateUrl = baseUrl + viewType + locale + '.html';
			templateLoader = $http.get(templateUrl, {cache: $templateCache});

			return templateLoader;
		};

		var getLocaleSelection = function(id) {
			var locale = {};
			angular.forEach(selectionArray, function(item){
				if (item.id === id){
					locale = item;
				}
			});
			return locale;
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
						scope.address.country = locale.id;
						break;
					case 'billing':
						scope.order.billTo.country = locale.id;
						break;
					case 'shipping':
						scope.order.shipTo.country = locale.id;
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
