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

angular.module('ds.checkout')
/**
 * inline-error-input
 * "Required" errors are displayed within the input fields. Other errors are showed in the tooltip.
 * When user focuses input field
 * which contains the error the original input is shown.
 * @return {Object}
 */
    .directive('inlineErrorInput',['GlobalData', '$translate', function(GlobalData, $translate){
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                var fieldRequired = '';
                var fieldTooShort = '';
                var fieldsNotMatching = '';
                var detailChange = null;

                $translate('FIELD_REQUIRED').then(function (translatedValue) {
                    fieldRequired = translatedValue;
                });
                $translate('FIELD_TOO_SHORT').then(function (translatedValue) {
                    fieldTooShort = translatedValue;
                });
                $translate('FIELDS_NOT_MATCHING').then(function (translatedValue) {
                    fieldsNotMatching = translatedValue;
                });
                // element's (input's) clone -> error input
                // set type to text to allow displaying 'required' msg in numeric input fields
                var elementClone = element.clone().attr('type', 'text'),
                    submitted = false,
                    onInputFocus = function() {
                        elementClone.hide();
                        elementClone.attr('value', '');
                        element.show();
                        element.focus();
                    },
                    onInputBlur = function() {
                        if (!ngModel.$pristine || submitted) {
                            validate();
                        }
                    },
                    onInputChanged = function(){  // for select boxes
                        if (!ngModel.$pristine || submitted) {
                            validate();
                        }
                    },
                    getErrorMessages = function() {

                        var errorMsgs = {
                                'inlineErrorMsgs': []
                            },
                        errorsJSON = [];
                        // "required" errors don't show in conjunction with Stripe validation, so performing
                        //   separate check here:
                        if(attrs.required && !ngModel.value){
                            errorMsgs.inlineErrorMsgs.push(attrs.inlineErrorInputRequiredMessage || fieldRequired);
                        }
                        angular.forEach(ngModel.$error, function (value, key) {
                            errorsJSON.push(key);
                        });
                        for(var errorKey in errorsJSON) {
                            switch(errorsJSON[errorKey]) {

                                case 'minlength':
                                    if (ngModel.$error.minlength) {
                                        errorMsgs.inlineErrorMsgs.push(attrs.inlineErrorInputMinLengthMessage || fieldTooShort);
                                    }
                                    break;
                                case 'equal':
                                    if (ngModel.$error.equal) {
                                        errorMsgs.inlineErrorMsgs.push(attrs.inlineErrorInputEqualMessage || fieldsNotMatching);
                                    }
                                    break;
                            }
                        }
                        return errorMsgs;
                    },
                    validate = function() {
                        scope.message = '';

                        if (ngModel.$invalid) {
                            var errorMsgs = getErrorMessages();
                            if (elementClone.is('select')) {
                                element.find('option[value=""]').text(errorMsgs.inlineErrorMsgs.join(', '));
                            } else {
                                if(errorMsgs.inlineErrorMsgs.length > 0) {
                                    elementClone.attr('value', errorMsgs.inlineErrorMsgs.join(', '));
                                }

                                if (!elementClone[0].value) {
                                    elementClone.attr('value', element[0].value);
                                }

                                elementClone.attr('class', element.attr('class'));
                                element.hide();
                                elementClone.show();
                            }
                        }
                    };

                // equality check
                if (attrs.inlineErrorInputEqual) {
                    var otherInput = element.inheritedData('$formController')[attrs.inlineErrorInputEqual];

                    ngModel.$parsers.push(function(value) {
                        if(value === otherInput.$viewValue) {
                            ngModel.$setValidity('equal', true);
                            return value;
                        }
                        ngModel.$setValidity('equal', false);
                    });

                    otherInput.$parsers.push(function(value) {
                        ngModel.$setValidity('equal', value === ngModel.$viewValue);
                        return value;
                    });
                }

                elementClone.addClass('error-input');
                elementClone.removeAttr('id');

                if (element.is('select')) {
                    // Requires emptyOption(errors placeholder) in the markup
                    var emptyOption = element.find('option[value=""]');
                    // firstChildCheck is a quirky work around angular select element with n-options
                    // which DO NOT register as option children on the select node - if this is an ng-options select,
                    // then there will be an empty default option
                    if (!emptyOption.length && emptyOption.getFirstChild) {
                        element.prepend('<option value=""></option>');
                    } else {
                        emptyOption.data('original-label', emptyOption.html());
                    }
                    element.on('change', function() {
                        emptyOption.html( element.val() !== '' ? emptyOption.data('original-label') || '' : getErrorMessages().join(', ') );
                    });
                }


                element.after(elementClone);
                elementClone.hide();
                elementClone.on('focus', onInputFocus);
                element.on('blur', onInputBlur);
                element.on('change', onInputChanged);
                var sfh = scope.$on('submitting:form', function(e, formName) {
                    submitted = true;
                    if (element.parents('[name="'+formName+'"]').length) {
                        validate();
                    }
                });

                //when "my details" name changes, validate bill to contact name field
                if (ngModel.$name === 'contactName') {
                    detailChange = scope.$on('myDetails:change', function(){
                            elementClone.hide();
                            elementClone.attr('value', '');
                            element.show();
                    });
                }

                scope.$watch(function() { return GlobalData.getLanguageCode(); }, function (currentLang, previousLang) {
                    if (currentLang && previousLang && currentLang !== previousLang) {
                        onInputChanged();
                    }
                });

                scope.$on('$destroy', function() {
                    elementClone.off('focus', onInputFocus);
                    element.off('blur', onInputBlur);
                    sfh();
                    if(detailChange){
                        detailChange();
                    }
                });
            }
        };
    }]);