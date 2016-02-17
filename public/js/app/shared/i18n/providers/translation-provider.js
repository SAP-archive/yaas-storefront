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
	.provider('Translation', ['$translateProvider', 'translateSettings',
		function TranslationProvider($translateProvider, translateSettings) {

		    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

			$translateProvider.useStaticFilesLoader({
			    prefix: 'js/app/shared/i18n/lang/lang_',
			    suffix: '.json'
			});

			$translateProvider.preferredLanguage(translateSettings.defaultLanguageCode);

			this.setPreferredLanguage = function(langCode) {
			    $translateProvider.preferredLanguage(langCode || translateSettings.defaultLanguageCode);
			};

			this.$get = ['$translateProvider',
				function($translateProvider) {
					return new TranslationProvider($translateProvider);
				}
			];

		}
	]);