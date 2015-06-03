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
    directive('localizedAddresses', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

    	var initialize = function(scope, elem){
			//set template type
			var locale = 'def'; //TODO
			loadTemplate(scope, elem, locale);
		}

		var loadTemplate = function(scope, elem, locale){
			//load dynamic address template into scope
            var tempLoader = getTemplate(locale);
            var promise = tempLoader.success(function(template) {
            	elem.html(template).show();
            }).then(function (response) {
                $compile(elem.contents())(scope);
            });
    	}

        var getTemplate = function(contentType) {
            var templateLoader,
            baseUrl = 'js/app/addresses/templates/',
            templateMap = {
            	USA : 'address-USA.html',
            	CAN : 'address-CAN.html',
            	UK  : 'address-UK.html',
            	JPN : 'address-JPN.html',
            	CHI : 'address-CHI.html',
            	GER : 'address-GER.html',
            	def : 'address-default.html'
            },
            templateUrl = baseUrl + templateMap[contentType];
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;
        }

        var templateLinker = function(scope, element, attrs) {
        	var currentElement = element;
			scope.localeSelection;
			scope.localeSelections = [{name:'USA'}, {name:'CAN'}, {name:'CHI'}, {name:'JPN'}, {name:'UK'}, {name:'GER'}]; //TODO

			//localization selection handler
			scope.changeLocale = function(viewType){
				var locale;
		        switch(viewType) {
		            case 'USA':
		                locale = 'USA';
		                break;
		            case 'CAN':
		                locale = 'CAN';
		                break;
		            case 'CHI':
		                locale = 'CHI';
		                break;
		            case 'JPN':
		                locale = 'JPN';
		                break;
		            case 'UK':
		                locale = 'UK';
		                break;
		            case 'GER':
		                locale = 'GER';
		                break;
		            default:
		            	locale = 'def'

		        }
				loadTemplate(scope, element, locale);
			}

	        initialize(scope, element);
        }

        return {
            restrict: 'E',
            link: templateLinker
        };
    }]);
