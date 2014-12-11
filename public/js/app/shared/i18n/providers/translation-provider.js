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
     /** Acts as dictionary provider for localization. */
	.provider('Translation', ['$translateProvider', 'i18nConstantsProvider',
		function TranslationProvider($translateProvider, i18nConstantsProvider) {
			var defaultLang = i18nConstantsProvider.languages.en.code;

			$translateProvider.translations('en', i18nConstantsProvider.languages.en.translations);
			$translateProvider.translations('de', i18nConstantsProvider.languages.de.translations);
			$translateProvider.preferredLanguage(defaultLang);

			this.getDefaultLanguage = function() {
				return defaultLang;
			};

			this.setPreferredLanguage = function(langCode) {
				$translateProvider.preferredLanguage(langCode || defaultLang);
			};

			this.switchLanguage = function(langCode) {
				$translateProvider.use(langCode || defaultLang);
			};

			this.$get = ['$translateProvider', 'i18nConstantsProvider',
				function($translateProvider, i18nConstantsProvider) {
					return new TranslationProvider($translateProvider, i18nConstantsProvider);
				}
			];

		}
	]);