'use strict';

angular.module('ds.i18n')

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