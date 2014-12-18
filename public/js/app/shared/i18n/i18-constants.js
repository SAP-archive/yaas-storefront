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
    // default and supported languages for static information only - service language preferences are set in "GlobalData" via config service
    .constant('translateSettings', {
        defaultLanguageCode: 'en',
        supportedLanguages: ['en', 'de']
    })
/** Provides access to the dictionaries.*/
    .provider('i18nConstants', ['TranslationsEN', 'TranslationsDE',
        function i18nConstantsProvider(TranslationsEN, TranslationsDE) {

            this.$get = [function () {
                return this;
            }];

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
        }
    ]);