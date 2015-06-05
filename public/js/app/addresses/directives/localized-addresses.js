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
			//set default template type
			loadTemplate(scope, elem, '');
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

        var getTemplate = function(viewType) {
            var templateLoader, templateMap, templateUrl,
            baseUrl = 'js/app/addresses/templates/';

            templateMap = {
            	USA : 'address-USA.html',
            	CAN : 'address-CAN.html',
            	UK  : 'address-UK.html',
            	JPN : 'address-JPN.html',
            	CHI : 'address-CHI.html',
            	GER : 'address-GER.html',
            	def : 'address-default.html'
            };

            // if view is not recognized load default template
	        if( viewType!='USA' && viewType!='CAN' && viewType!='CHI' && viewType!='JPN' && viewType!='UK' && viewType!='GER'){
	            viewType = 'def'
	        }

            templateUrl = baseUrl + templateMap[viewType];
            templateLoader = $http.get(templateUrl, {cache: $templateCache});

            return templateLoader;
        }

        var templateLinker = function(scope, element, attrs) {
        	var currentElement = element;
			scope.localeSelection;
			scope.localeSelections = [
				{id: 'USA', name:'USA'},
				{id: 'CAN', name:'CANADA'},
				{id: 'CHI', name:'CHINA'},
				{id: 'JPN', name:'JAPAN'},
				{id: 'UK',  name:'UK'},
				{id: 'GER', name:'GERMANY'}];

			//localization selection handler
			scope.changeLocale = function(viewType){

				loadTemplate(scope, element, viewType.id);
			}

	        initialize(scope, element);
        }

        return {
            restrict: 'E',
            link: templateLinker
        };
    }]);
