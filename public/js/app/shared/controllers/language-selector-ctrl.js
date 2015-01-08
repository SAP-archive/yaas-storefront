/**
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

angular.module('ds.shared')
    .controller('languageSelectorController',[ '$rootScope', '$scope', '$q', 'GlobalData', '$translate',
        function($rootScope, $scope, $q, GlobalData, $translate){

            $scope.language = { selected: { iso: GlobalData.getLanguageCode(), value: GlobalData.getLanguageCode() }};

            $scope.languages = [];
            var availableLanguages = GlobalData.getAvailableLanguages();
            // Language translations (if we don't have them for current locale use values form config service - english versions)
            var translationPromises = availableLanguages
                .map(function(lang) {
                    return $translate(lang.id).then(
                        (function(lang) {
                            return function(response) {
                                $scope.languages.push({ iso:  lang.id, value: response });
                            };
                        })(lang),
                        (function(lang) {
                            return function() {
                                $scope.languages.push({ iso:  lang.id, value: lang.label });
                            };
                        })(lang)
                    );
                });

            $q.all(translationPromises)
                .finally(function() {
                    var selectedLang;
                    if ($scope.language.selected.iso === $scope.language.selected.value) {
                        selectedLang = _.find($scope.languages, function(lang) { return $scope.language.selected.iso === lang.iso; });
                        if (selectedLang && selectedLang.value) {
                            $scope.language.selected.value = selectedLang.value;
                        }
                    }
                });

            $scope.$watch('language.selected', function(newValue, oldValue) {
                if (!angular.equals(newValue, oldValue) && newValue.iso) {
                    GlobalData.setLanguage(newValue.iso);
                }
            });

            $scope.updateLanguage = function (newLang){
                $scope.language.selected = newLang;
            };

            // handling language updates initiated from outside this controller
            var unbindLang = $rootScope.$on('language:updated', function (eve, eveObj) {
                if(eveObj.languageCode !== $scope.language.selected.iso){
                    $scope.language.selected =  { iso: eveObj.languageCode, value: eveObj.languageCode };
                }
            });

            $scope.$on('$destroy', unbindLang );

        }
    ]);
