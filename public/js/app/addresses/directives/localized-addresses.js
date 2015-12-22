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
	directive('localizedAddresses', ['$compile', '$http', '$templateCache', '$rootScope', 'GlobalData', 'ShippingSvc',
		function($compile, $http, $templateCache, $rootScope, GlobalData, ShippingSvc) {

		var selectionArray = [
				{id: 'US', name:'USA'},
				{id: 'CA', name:'CANADA'},
				{id: 'GB', name:'GREAT BRITAIN'}, // feature toggle extra countries.
				{id: 'DE', name:'GERMANY'}];
				// {id: 'CN', name:'CHINA'},
				// {id: 'JP', name:'JAPAN'}];

		var allCountries = [{ name: 'Albania', id: 'AL' }, { name: 'Algeria', id: 'DZ' }, { name: 'American Samoa', id: 'AS' },
            { name: 'Andorra', id: 'AD' }, { name: 'Angola', id: 'AO' }, { name: 'Anguilla', id: 'AI' },
            { name: 'Antarctica', id: 'AQ' }, { name: 'Antigua and Barbuda', id: 'AG' }, { name: 'Argentina', id: 'AR' },
            { name: 'Armenia', id: 'AM' }, { name: 'Aruba', id: 'AW' }, { name: 'Australia', id: 'AU' }, { name: 'Austria', id: 'AT' },
            { name: 'Azerbaijan', id: 'AZ' }, { name: 'Bahamas', id: 'BS' }, { name: 'Bahrain', id: 'BH' },
            { name: 'Bangladesh', id: 'BD' }, { name: 'Barbados', id: 'BB' }, { name: 'Belarus', id: 'BY' },
            { name: 'Belgium', id: 'BE' }, { name: 'Belize', id: 'BZ' }, { name: 'Benin', id: 'BJ' }, { name: 'Bermuda', id: 'BM' },
            { name: 'Bhutan', id: 'BT' }, { name: 'Bolivia, Plurinational State of', id: 'BO' }, { name: 'Bonaire, Sint Eustatius and Saba', id: 'BQ' },
            { name: 'Bosnia and Herzegovina', id: 'BA' }, { name: 'Botswana', id: 'BW' }, { name: 'Bouvet Island', id: 'BV' },
            { name: 'Brazil', id: 'BR' }, { name: 'British Indian Ocean Territory', id: 'IO' }, { name: 'Brunei Darussalam', id: 'BN' },
            { name: 'Bulgaria', id: 'BG' }, { name: 'Burkina Faso', id: 'BF' }, { name: 'Burundi', id: 'BI' }, { name: 'Cambodia', id: 'KH' },
            { name: 'Cameroon', id: 'CM' }, { name: 'Canada', id: 'CA' }, { name: 'Cape Verde', id: 'CV' }, { name: 'Cayman Islands', id: 'KY' },
            { name: 'Central African Republic', id: 'CF' }, { name: 'Chad', id: 'TD' }, { name: 'Chile', id: 'CL' }, { name: 'China', id: 'CN' },
            { name: 'Christmas Island', id: 'CX' }, { name: 'Cocos (Keeling) Islands', id: 'CC' }, { name: 'Colombia', id: 'CO' },
            { name: 'Comoros', id: 'KM' }, { name: 'Congo', id: 'CG' }, { name: 'Congo, the Democratic Republic of the', id: 'CD' },
            { name: 'Cook Islands', id: 'CK' }, { name: 'Costa Rica', id: 'CR' }, { name: 'Cote d\'Ivoire', id: 'CI' }, { name: 'Croatia', id: 'HR' },
            { name: 'Cuba', id: 'CU' }, { name: 'Curacao', id: 'CW' }, { name: 'Cyprus', id: 'CY' }, { name: 'Czech Republic', id: 'CZ' },
            { name: 'Denmark', id: 'DK' }, { name: 'Djibouti', id: 'DJ' }, { name: 'Dominica', id: 'DM' }, { name: 'Dominican Republic', id: 'DO' },
            { name: 'Ecuador', id: 'EC' }, { name: 'Egypt', id: 'EG' }, { name: 'El Salvador', id: 'SV' }, { name: 'Equatorial Guinea', id: 'GQ' },
            { name: 'Eritrea', id: 'ER' }, { name: 'Estonia', id: 'EE' }, { name: 'Ethiopia', id: 'ET' }, { name: 'Falkland Islands (Malvinas)', id: 'FK' },
            { name: 'Faroe Islands', id: 'FO' }, { name: 'Fiji', id: 'FJ' }, { name: 'Finland', id: 'FI' }, { name: 'France', id: 'FR' },
            { name: 'French Guiana', id: 'GF' }, { name: 'French Polynesia', id: 'PF' }, { name: 'French Southern Territories', id: 'TF' },
            { name: 'Gabon', id: 'GA' }, { name: 'Gambia', id: 'GM' }, { name: 'Georgia', id: 'GE' }, { name: 'Germany', id: 'DE' },
            { name: 'Ghana', id: 'GH' }, { name: 'Gibraltar', id: 'GI' }, { name: 'Greece', id: 'GR' }, { name: 'Greenland', id: 'GL' },
            { name: 'Grenada', id: 'GD' }, { name: 'Guadeloupe', id: 'GP' }, { name: 'Guam', id: 'GU' }, { name: 'Guatemala', id: 'GT' },
            { name: 'Guernsey', id: 'GG' }, { name: 'Guinea', id: 'GN' }, { name: 'Guinea-Bissau', id: 'GW' }, { name: 'Guyana', id: 'GY' },
            { name: 'Haiti', id: 'HT' }, { name: 'Heard Island and McDonald Mcdonald Islands', id: 'HM' }, { name: 'Holy See (Vatican City State)', id: 'VA' },
            { name: 'Honduras', id: 'HN' }, { name: 'Hong Kong', id: 'HK' }, { name: 'Hungary', id: 'HU' }, { name: 'Iceland', id: 'IS' },
            { name: 'India', id: 'IN' }, { name: 'Indonesia', id: 'ID' }, { name: 'Iran, Islamic Republic of', id: 'IR' }, { name: 'Iraq', id: 'IQ' },
            { name: 'Ireland', id: 'IE' }, { name: 'Isle of Man', id: 'IM' }, { name: 'Israel', id: 'IL' }, { name: 'Italy', id: 'IT' },
            { name: 'Jamaica', id: 'JM' }, { name: 'Japan', id: 'JP' }, { name: 'Jersey', id: 'JE' }, { name: 'Jordan', id: 'JO' },
            { name: 'Kazakhstan', id: 'KZ' }, { name: 'Kenya', id: 'KE' }, { name: 'Kiribati', id: 'KI' },
            { name: 'Korea, Democratic People\'s Republic of', id: 'KP' }, { name: 'Korea, Republic of', id: 'KR' },
            { name: 'Kuwait', id: 'KW' }, { name: 'Kyrgyzstan', id: 'KG' }, { name: 'Lao People\'s Democratic Republic', id: 'LA' },
            { name: 'Latvia', id: 'LV' }, { name: 'Lebanon', id: 'LB' }, { name: 'Lesotho', id: 'LS' }, { name: 'Liberia', id: 'LR' },
            { name: 'Libya', id: 'LY' }, { name: 'Liechtenstein', id: 'LI' }, { name: 'Lithuania', id: 'LT' }, { name: 'Luxembourg', id: 'LU' },
            { name: 'Macao', id: 'MO' }, { name: 'Macedonia, the Former Yugoslav Republic of', id: 'MK' }, { name: 'Madagascar', id: 'MG' },
            { name: 'Malawi', id: 'MW' }, { name: 'Malaysia', id: 'MY' }, { name: 'Maldives', id: 'MV' }, { name: 'Mali', id: 'ML' },
            { name: 'Malta', id: 'MT' }, { name: 'Marshall Islands', id: 'MH' }, { name: 'Martinique', id: 'MQ' }, { name: 'Mauritania', id: 'MR' },
            { name: 'Mauritius', id: 'MU' }, { name: 'Mayotte', id: 'YT' }, { name: 'Mexico', id: 'MX' }, { name: 'Micronesia, Federated States of', id: 'FM' },
            { name: 'Moldova, Republic of', id: 'MD' }, { name: 'Monaco', id: 'MC' }, { name: 'Mongolia', id: 'MN' }, { name: 'Montenegro', id: 'ME' },
            { name: 'Montserrat', id: 'MS' }, { name: 'Morocco', id: 'MA' }, { name: 'Mozambique', id: 'MZ' }, { name: 'Myanmar', id: 'MM' },
            { name: 'Namibia', id: 'NA' }, { name: 'Nauru', id: 'NR' }, { name: 'Nepal', id: 'NP' }, { name: 'Netherlands', id: 'NL' },
            { name: 'New Caledonia', id: 'NC' }, { name: 'New Zealand', id: 'NZ' }, { name: 'Nicaragua', id: 'NI' }, { name: 'Niger', id: 'NE' },
            { name: 'Nigeria', id: 'NG' }, { name: 'Niue', id: 'NU' }, { name: 'Norfolk Island', id: 'NF' }, { name: 'Northern Mariana Islands', id: 'MP' },
            { name: 'Norway', id: 'NO' }, { name: 'Oman', id: 'OM' }, { name: 'Pakistan', id: 'PK' }, { name: 'Palau', id: 'PW' },
            { name: 'Palestine, State of', id: 'PS' }, { name: 'Panama', id: 'PA' }, { name: 'Papua New Guinea', id: 'PG' }, { name: 'Paraguay', id: 'PY' },
            { name: 'Peru', id: 'PE' }, { name: 'Philippines', id: 'PH' }, { name: 'Pitcairn', id: 'PN' }, { name: 'Poland', id: 'PL' },
            { name: 'Portugal', id: 'PT' }, { name: 'Puerto Rico', id: 'PR' }, { name: 'Qatar', id: 'QA' }, { name: 'Reunion', id: 'RE' },
            { name: 'Romania', id: 'RO' }, { name: 'Russian Federation', id: 'RU' }, { name: 'Rwanda', id: 'RW' }, { name: 'Saint Barthelemy', id: 'BL' },
            { name: 'Saint Helena, Ascension and Tristan da Cunha', id: 'SH' }, { name: 'Saint Kitts and Nevis', id: 'KN' }, { name: 'Saint Lucia', id: 'LC' },
            { name: 'Saint Martin (French part)', id: 'MF' }, { name: 'Saint Pierre and Miquelon', id: 'PM' }, { name: 'Saint Vincent and the Grenadines', id: 'VC' },
            { name: 'Samoa', id: 'WS' }, { name: 'San Marino', id: 'SM' }, { name: 'Sao Tome and Principe', id: 'ST' }, { name: 'Saudi Arabia', id: 'SA' },
            { name: 'Senegal', id: 'SN' }, { name: 'Serbia', id: 'RS' }, { name: 'Seychelles', id: 'SC' }, { name: 'Sierra Leone', id: 'SL' },
            { name: 'Singapore', id: 'SG' }, { name: 'Sint Maarten (Dutch part)', id: 'SX' }, { name: 'Slovakia', id: 'SK' }, { name: 'Slovenia', id: 'SI' },
            { name: 'Solomon Islands', id: 'SB' }, { name: 'Somalia', id: 'SO' }, { name: 'South Africa', id: 'ZA' },
            { name: 'South Georgia and the South Sandwich Islands', id: 'GS' }, { name: 'South Sudan', id: 'SS' }, { name: 'Spain', id: 'ES' },
            { name: 'Sri Lanka', id: 'LK' }, { name: 'Sudan', id: 'SD' }, { name: 'Suriname', id: 'SR' }, { name: 'Svalbard and Jan Mayen', id: 'SJ' },
            { name: 'Swaziland', id: 'SZ' }, { name: 'Sweden', id: 'SE' }, { name: 'Switzerland', id: 'CH' }, { name: 'Syrian Arab Republic', id: 'SY' },
            { name: 'Taiwan, Province of China', id: 'TW' }, { name: 'Tajikistan', id: 'TJ' }, { name: 'Tanzania, United Republic of', id: 'TZ' },
            { name: 'Thailand', id: 'TH' }, { name: 'Timor-Leste', id: 'TL' }, { name: 'Togo', id: 'TG' }, { name: 'Tokelau', id: 'TK' },
            { name: 'Tonga', id: 'TO' }, { name: 'Trinidad and Tobago', id: 'TT' }, { name: 'Tunisia', id: 'TN' }, { name: 'Turkey', id: 'TR' },
            { name: 'Turkmenistan', id: 'TM' }, { name: 'Turks and Caicos Islands', id: 'TC' }, { name: 'Tuvalu', id: 'TV' },
            { name: 'Uganda', id: 'UG' }, { name: 'Ukraine', id: 'UA' }, { name: 'United Arab Emirates', id: 'AE' }, { name: 'United Kingdom', id: 'GB' },
            { name: 'United States', id: 'US' }, { name: 'United States Minor Outlying Islands', id: 'UM' }, { name: 'Uruguay', id: 'UY' },
            { name: 'Uzbekistan', id: 'UZ' }, { name: 'Vanuatu', id: 'VU' }, { name: 'Venezuela, Bolivarian Republic of', id: 'VE' },
            { name: 'Viet Nam', id: 'VN' }, { name: 'Virgin Islands, British', id: 'VG' }, { name: 'Virgin Islands, U.S.', id: 'VI' },
            { name: 'Wallis and Futuna', id: 'WF' }, { name: 'Western Sahara', id: 'EH' }, { name: 'Yemen', id: 'YE' }, { name: 'Zambia', id: 'ZM' },
            { name: 'Zimbabwe', id: 'ZW' }];

		var initialize = function(scope, elem, viewType){
			// init with default template type
			loadTemplate(scope, elem, '', viewType);
            selectDefaultLocale(scope, viewType);
		};

        var selectDefaultLocale = function (scope, viewType) {

            if (!scope.localeSelection) {
                scope.localeSelection = selectionArray[0];
                if (viewType !== 'addAddress') {
					scope.localeSelection = {id: '', name: ''};
                }
            }
            switch(viewType){
                case 'addAddress':
                    if (scope.address) {
                        scope.address.country = scope.localeSelection.id;
                    }
                    break;
                case 'billing':
                    if (scope.order.billTo) {
                        scope.order.billTo.country = scope.localeSelection.id;
                    }
                    break;
                case 'shipping':
                    if (scope.order.shipTo) {
                        scope.order.shipTo.country = scope.localeSelection.id;
                    }
                    break;
                default:
                    break;
            }
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

			// when locale is not recognized set default template
			if( !_.contains(_.pluck(selectionArray, 'id'), locale) ){
				if (viewType === 'addAddress') {
					locale = 'US';
                } else {
					locale = 'Default';
				}
			}

			// set dynamic template url and return promise
			templateUrl = baseUrl + viewType + locale + '.html';
			templateLoader = $http.get(templateUrl, {cache: $templateCache});

			return templateLoader;
		};

		var getLocaleSelection = function(id, target) {
			var locale = {};
			var selectionCountries;
			if (target === 'billing' || target === 'shipping') {
				selectionCountries = allCountries;
			} else {
				selectionCountries = selectionArray;
			}
			angular.forEach(selectionCountries, function(item){
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

			if (scope.viewTarget === 'billing' || scope.viewTarget === 'shipping') {
				ShippingSvc.getShipToCountries().then(
					function (response) {
						scope.localeSelections = getShipToCountries(response);
					}
				);
			} else {
				scope.localeSelections = selectionArray;
			}
			
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
				if (scope.viewTarget !== 'addAddress') {
					var addressToShip = $rootScope.shipActive ? scope.order.shipTo : scope.order.billTo;
					$rootScope.closeCartOnCheckout();
					$rootScope.$emit('updateShippingCost', {shipToAddress: addressToShip});
				}
			};

			$rootScope.$on('noShippingCosts', function (){
				scope.localeSelection = {id: '', name: ''};
			});

			// event for loading addressbook change request
			var unbind = $rootScope.$on('localizedAddress:updated', function (e, name, target) {
				var locale = getLocaleSelection(name, target);
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
