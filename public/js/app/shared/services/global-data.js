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

angular.module('ds.shared')
/** Acts as global data store for application settings. In contrast to the "settings" constant provider,
 * these settings may change over the life of the application.
 *
 * Also provides some logic around updating these settings.
 * */
    .factory('GlobalData', ['appConfig', '$translate', 'CookieSvc', '$rootScope', 'i18nConstants', 'translateSettings', 'settings',
        function (appConfig, $translate, CookieSvc, $rootScope, i18nConstants, translateSettings, settings) {


            var sites, currentSite;

            var languageCode;
            var defaultLang = 'en';
            var languageMap = {};
            var availableLanguages = {};
            // HTTP accept-languages header setting for service calls
            var acceptLanguages;

            var storeDefaultCurrency;
            var activeCurrencyId;
            var availableCurrency = {};


            // for label translation, we're limited to what we're providing in localization settings in i18
            function setTranslateLanguage(langCode) {
                if (settings.translateLanguages.indexOf(langCode) > -1) {
                    $translate.use(langCode);
                } else if (translateSettings.supportedLanguages.indexOf(defaultLang) > -1) {
                    $translate.use(defaultLang);
                } else {
                    $translate.use(translateSettings.defaultLanguageCode);
                }
            }

            /**
            * Used for getting the language object from language id.
            */
            function getLanguageById(id) {
                switch (id) {
                    case 'en':
                        return { id: id, label: 'English' };
                    case 'de':
                        return { id: id, label: 'German' };
                    default:
                        return { id: id, label: id };
                }
            }

            function setLanguageWithOptionalCookie(newLangCode, setCookie, updateSource) {
                if (!_.isEmpty(languageMap)) {
                    if (newLangCode && newLangCode in languageMap) {

                        if (setCookie) {
                            CookieSvc.setLanguageCookie(newLangCode);
                        }

                        if (languageCode !== newLangCode) {
                            languageCode = newLangCode;
                            acceptLanguages = (languageCode === defaultLang ? languageCode : languageCode + ';q=1,' + defaultLang + ';q=0.5');
                            if (updateSource !== settings.eventSource.initialization) { // don't event on initialization
                                $rootScope.$emit('language:updated', {
                                    languageCode: languageCode,
                                    source: updateSource
                                });
                            }
                        }
                        setTranslateLanguage(languageCode);
                    } else {
                        console.warn('Language not valid: ' + newLangCode);
                        if (defaultLang && defaultLang in languageMap) {
                            console.log('Using default language instead: ' + defaultLang);
                            setLanguageWithOptionalCookie(defaultLang, setCookie, updateSource);
                        } else {
                            console.error('No default language defined.');
                        }
                    }
                }
            }

            return {
                orders: {
                    meta: {
                        total: 0
                    }
                },
                products: {
                    meta: {
                        total: 0
                    },
                    pageSize: 8,
                    lastSort: '',
                    lastViewedProductId: ''
                },
                addresses: {
                    meta: {
                        total: 0
                    }
                },

                store: {
                    tenant: appConfig.storeTenant(),
                    clientId: appConfig.clientId(),
                    redirectURI: appConfig.redirectURI(),
                    name: '',
                    logo: null,
                    icon: null
                },

                user: {
                    isAuthenticated: false,
                    username: null
                },

                search: {
                    algoliaKey: '',
                    algoliaProject: 'MSSYUK0R36'
                },

                getAllCountries: function () {
                    return [{ name: 'Albania', id: 'AL' }, { name: 'Algeria', id: 'DZ' }, { name: 'American Samoa', id: 'AS' },
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
                },

                /** Returns the currency symbol of the active currency.*/
                getCurrencySymbol: function (optionalId) {
                    var id = optionalId || activeCurrencyId;
                    var symbol = '?';
                    if (id === 'USD' || id === 'CAD') {
                        symbol = '$';
                    }
                    else if (id === 'EUR') {
                        symbol = '\u20AC';
                    }
                    else if (id === 'GBP') {
                        symbol = '\u20A4';
                    }
                    else if (id === 'JPY' || id === 'CNY') {
                        symbol = '\u00A5';
                    }
                    else if (id === 'PLN') {
                        symbol = '\u007A' + '\u0142';
                    }
                    else if (id === 'CHF') {
                        symbol = 'CHF';
                    }

                    return symbol;
                },

                /** Sets the code of the language that's supposed to be active for the store.*/
                setLanguage: function (newLangCode, updateSource) {
                    setLanguageWithOptionalCookie(newLangCode, true, updateSource ? updateSource : settings.eventSource.unknown);
                },

                /** Returns the language code that's currently active for the store.*/
                getLanguageCode: function () {
                    return languageCode;
                },

                /** Returns the active language instance.*/
                getLanguage: function () {
                    return languageMap[languageCode];
                },

                /** Returns the 'accept-languages' header for the application.*/
                getAcceptLanguages: function () {
                    return acceptLanguages;
                },

                /** Determines the initial active language for the store, based on store configuration and
                 * any existing cookie settings. */
                loadInitialLanguage: function () {
                    var languageCookie = CookieSvc.getLanguageCookie();
                    if (languageCookie && languageCookie.languageCode) {
                        setLanguageWithOptionalCookie(languageCookie.languageCode, false, settings.eventSource.initialization);
                    } else {
                        setLanguageWithOptionalCookie(languageCode, true, settings.eventSource.initialization);
                    }
                },

                /** Sets the currency id that's supposed to be active for this store and stores it to a
                 * cookie.
                 * If the id is not part of the "available" currencies, the update will be silently rejected.
                 * @param object with property id === currency id; if property setCookie === true, setting will
                 * be written to cookie (if valid)*/
                setCurrency: function (currency) {
                    if (currency !== activeCurrencyId) {
                        activeCurrencyId = currency;
                    }
                },

                /** Determines the initial active site for the store, based on store configuration and
                * any existing cookie settings. */
                loadInitialSite: function () {
                    var siteCookie = CookieSvc.getSiteCookie();
                    return siteCookie;
                },

                /** Returns the id of the currency that's currently active for the store.*/
                getCurrencyId: function () {
                    return activeCurrencyId;
                },

                /** Returns the active currency instance.*/
                getCurrency: function () {
                    return activeCurrencyId;
                },

                /** Sets an array of currency instances from which a shopper should be able to choose.*/
                setAvailableCurrency: function (currency) {

                    if (currency) {
                        availableCurrency = currency;
                        storeDefaultCurrency = currency;
                    }
                    if (!storeDefaultCurrency) {
                        console.error('No default currency defined!');
                    }
                },

                /** Returns an array of currency instances supported by this project.*/
                getAvailableCurrency: function () {
                    return availableCurrency;
                },

                /** Sets an array of language instances from which a shopper should be able to choose.*/
                setAvailableLanguages: function (languages) {
                    if (languages) {
                        availableLanguages = [];

                        angular.forEach(languages, function (language) {
                            languageMap[language.id] = language;

                            availableLanguages.push(language);
                        });
                    }
                    if (!defaultLang) {
                        console.error('No default language has been defined!');
                    }
                },

                setDefaultLanguage: function (lang) {
                    defaultLang = lang.id;
                },

                /** Returns an array of language instances supported by this project.*/
                getAvailableLanguages: function () {
                    return availableLanguages;
                },

                setSiteCookie: function (site) {
                    var cookieSite = { code: site.code };
                    CookieSvc.setSiteCookie(cookieSite);
                },

                setSite: function (site, selectedLanguageCode) {
                    if (!currentSite || currentSite.code !== site.code) {

                        //Set current site
                        currentSite = site;

                        //Set name of store
                        this.store.name = site.name;
                        $rootScope.titleConfig = site.name;

                        //Set stripe key if defined
                        if (!!site.payment && site.payment.length > 0 && !!site.payment[0].configuration && !!site.payment[0].configuration.public && !!site.payment[0].configuration.public.publicKey) {
                            /* jshint ignore:start */
                            Stripe.setPublishableKey(site.payment[0].configuration.public.publicKey);
                            /* jshint ignore:end */
                        }

                        //Set main image
                        if (!!site.mixins && !!site.mixins.storeLogoImageKey &&
                            !!site.mixins.storeLogoImageKey.value) {
                            this.store.logo = site.mixins.storeLogoImageKey.value;
                        }
                        else {
                            //Delete this property and make store fallback to default
                            delete this.store.logo;
                        }

                        //Set site icon
                        if (!!site.mixins && !!site.mixins.storeIconImageKey &&
                            !!site.mixins.storeIconImageKey.value) {
                            this.store.icon = site.mixins.storeIconImageKey.value;
                        }
                        else {
                            //Delete this property and make store fallback to default
                            delete this.store.icon;
                        }

                        //Create array
                        if (site.currency) {
                            if (site.currency !== this.getCurrencyId()) {
                                this.setAvailableCurrency(site.currency);
                                this.setCurrency(site.currency);
                            }
                        }

                        //Set languages
                        var languages = [];
                        if (!!site.languages) {
                            for (var i = 0; i < site.languages.length; i++) {
                                languages.push(getLanguageById(site.languages[i]));
                            }
                        }
                        this.setAvailableLanguages(languages);

                        //Set default language
                        if (selectedLanguageCode) {
                            setLanguageWithOptionalCookie(selectedLanguageCode, true, settings.eventSource.siteUpdate);
                        }

                        //Emit site change for cart
                        $rootScope.$broadcast('site:updated');
                    }
                },

                setSites: function (Sites) {
                    var storefrontSites = [];
                    for (var i = 0; i < Sites.length; i++) {
                        storefrontSites.push(Sites[i]);
                    }
                    sites = storefrontSites;
                },

                getSite: function () {
                    if (!!currentSite) {
                        return currentSite;
                    }
                    else {
                        return CookieSvc.getSiteCookie();
                    }
                },

                getSiteCode: function () {
                    if (!!currentSite) {
                        return currentSite.code;
                    }
                    return 'default';
                },

                getSites: function () {
                    return sites;
                },

                getTaxType: function () {
                    if (!!currentSite && !!currentSite.tax && !!currentSite.tax[0]) {
                        return currentSite.tax[0].id;
                    }
                    return null;
                },

                getCurrentTaxConfiguration: function () {
                    if (!!currentSite && !!currentSite.tax && !!currentSite.tax[0] && currentSite.tax[0].id === 'FLATRATE' && !!currentSite.tax[0].configuration) {
                        return currentSite.tax[0].configuration.public;
                    }
                    else {
                        return null;
                    }
                },

                getSiteBanners: function () {
                    if (!!currentSite && !!currentSite.mixins) {
                        return currentSite.mixins.siteContentDetails;
                    }
                    return null;
                },

                getEmailRegEx: function () {
                    return (/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i);

                },

                getUserTitles: function () {
                    return ['', 'MR', 'MS', 'MRS', 'DR'];
                }

            };

        }]);
