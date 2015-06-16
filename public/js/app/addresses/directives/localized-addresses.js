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
			// set default template type
			loadTemplate(scope, elem, '', viewType);
		};

		var loadTemplate = function(scope, elem, locale, viewType){

			//load dynamic address template into scope
            var tempLoader = getTemplate(locale, viewType);
            tempLoader.success(function(template) {
				elem.html(template).show();
            }).then( function () {
                $compile(elem.contents())(scope);
            });
		};

        var getTemplate = function(locale, viewType) {

            var templateLoader,/*templateMap,*/ templateUrl,
            baseUrl = 'js/app/addresses/templates/';

            // if view is not recognized set default template
			if( locale!=='USA' && locale!=='CAN' && locale!=='CHI' && locale!=='JPN' && locale!=='UK' && locale!=='GER'){
				locale = 'USA';
			}

            // set dynamic template url
            templateUrl = baseUrl + viewType + locale + '.html';
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;
        };

        var getLocaleSelection = function(name) {
        	var locale = {};
        	angular.forEach(selectionArray, function(item){
        		debugger;
        		if (item.name === name){
        			locale = item;
        			return false;
        		}
        	});
        	return locale;

        };

        var templateLinker = function(scope, element, attrs) {

			var currentType = attrs.type;
			scope.localeSelections = selectionArray;
			// scope.localeSelections = [
			// 	{id: 'USA', name:'USA'},
			// 	{id: 'CAN', name:'CANADA'},
			// 	{id: 'UK',  name:'UK'},
			// 	{id: 'GER', name:'GERMANY'},
			// 	{id: 'CHI', name:'CHINA'},
			// 	{id: 'JPN', name:'JAPAN'}];

			// localization selection handler
			scope.changeLocale = function(locale){

				loadTemplate(scope, element, locale.id, attrs.type);

				debugger;
				// set dynamic datamodel
				switch(currentType){
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

            var unbind = $rootScope.$on('localizedAddress:updated', function (e, name) {
            	debugger;
            	var locale = getLocaleSelection(name);
            	scope.localeSelection = locale;
                scope.changeLocale(locale);
            });

			initialize(scope, element, currentType);
        };

        return {
			scope: true,
            restrict: 'E',
            link: templateLinker
        };
    }]);
