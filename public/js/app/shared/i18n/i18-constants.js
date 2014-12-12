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

angular.module('ds.i18n')
     /** Provides access to the dictionaries.*/
	.provider('i18nConstants', ['TranslationsEN', 'TranslationsDE',
		function i18nConstantsProvider(TranslationsEN, TranslationsDE) {
		
			this.languages = {
				en: {
					code: 'en',
					translations: TranslationsEN
				},
				de: {
					code: 'de',
					translations: TranslationsDE
				}
			};

			this.getLanguageCodes = function() {
				var langCodes = [];
				for(var lang in this.languages) {
					langCodes.push(this.languages[lang].code);
				}
				return langCodes;
			};

			this.$get = [function() {
				return this;
			}];

		}
	]);