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
		 * Errors are displayed within the input fields. When user focuses input field
		 * which contians the error the original input is shown.
		 * 
		 * @return {Object}
		 */
    .directive('inlineErrorInput',[function(){
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          // element's (input's) clone -> error input
          var elementClone = element.clone(),
            onInputFocus = function() {
              elementClone.hide();
              element.show();
              element.focus();
            },
            onInputBlur = function() {
              if (!ngModel.$pristine) {
                validate();
              }
            },
            validate = function() {
              if (ngModel.$invalid) {
                // errors loop
                var errorMsgs = [];
                var errorsJSON = window._.keys(ngModel.$error);
                for(var errorKey in errorsJSON) {
                  switch(errorsJSON[errorKey]) {
                    case 'required':
                      if (ngModel.$error.required) {
                        errorMsgs.push(attrs.inlineErrorInputRequiredMessage || 'Field is required!');
                      }
                      break;
                    case 'pattern':
                        errorMsgs.push(attrs.inlineErrorInputPatternMessage || 'Field pattern mismatch!');
                      break;
                    default:
                      errorMsgs.push('Field value invalid!');
                  }
                }
                elementClone.attr('value', errorMsgs.join(', '));
                element.hide();
                elementClone.show();
              }
            };

          elementClone.addClass('error-input');
          element.after(elementClone);
          elementClone.hide();
          elementClone.on('focus', onInputFocus);
          element.on('blur', onInputBlur);
          
          scope.$on('$destroy', function() {
            elementClone.off('focus', onInputFocus);
            element.off('blur', onInputBlur);
          });
        }
      };
    }]);
