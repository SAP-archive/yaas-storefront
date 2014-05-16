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

angular.module('ds.checkout')
/**
 * inline-error-input
 * "Required" errors are displayed within the input fields. Other errors are showed in the tooltip.
 * When user focuses input field
 * which contains the error the original input is shown.
 * @return {Object}
 */
    .directive('inlineErrorInput',[function(){
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                // element's (input's) clone -> error input
                var elementClone = element.clone(),
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
                    getErrorMessages = function() {
                        var errorMsgs = {
                                'inlineErrorMsgs': [],
                                'tooltipErrorMsg': []
                            },
                            errorsJSON = window._.keys(ngModel.$error);
                        for(var errorKey in errorsJSON) {
                            switch(errorsJSON[errorKey]) {
                                case 'required':
                                    if (ngModel.$error.required) {
                                        errorMsgs.inlineErrorMsgs.push(attrs.inlineErrorInputRequiredMessage || 'Field is required!');
                                    }
                                    break;
                                case 'pattern':
                                    errorMsgs.tooltipErrorMsg.push(attrs.inlineErrorInputPatternMessage || 'Field pattern mismatch!');
                                    break;
                                default:
                                    errorMsgs.tooltipErrorMsg.push('Field value invalid!');
                            }
                        }
                        return errorMsgs;
                    },
                    validate = function() {
                        if (ngModel.$invalid) {
                            var errorMsgs = getErrorMessages();
                            if (elementClone.is('select')) {
                                element.find('option[value=""]').text(errorMsgs.inlineErrorMsgs.join(', '));
                            } else {
                                if(errorMsgs.inlineErrorMsgs.length > 0) {
                                    elementClone.attr('value', errorMsgs.inlineErrorMsgs.join(', '));
                                }
                                if(errorMsgs.tooltipErrorMsg.length > 0) {
                                    elementClone.attr('title', errorMsgs.tooltipErrorMsg.join(', '));
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

                elementClone.addClass('error-input');
                elementClone.removeAttr('id');

                if (element.is('select')) {
                    // Requires emptyOption(errors placeholder) in the markup
                    var emptyOption = element.find('option[value=""]');
                    if (!emptyOption.length) {
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
                var sfh = scope.$on('submitting:form', function(e, formName) {
                    submitted = true;
                    if (element.parents('[name="'+formName+'"]').length) {
                        validate();
                    }
                });

                scope.$on('$destroy', function() {
                    elementClone.off('focus', onInputFocus);
                    element.off('blur', onInputBlur);
                    sfh();
                });
            }
        };
    }]);