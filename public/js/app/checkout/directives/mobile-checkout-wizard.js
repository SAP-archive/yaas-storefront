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
 * mobile-checkout-wizard
 *
 * This directive includes a checkout wizard for the mobile checkout process, which requires that information
 * is filled out in segments ("steps"), and all subsequent steps are blocked from input until the required
 * information has been provided for previous steps. If the user edits a previously completed step, all subsequent steps
 * are marked "undone" again, and the user has to tab through the remaining steps to advance.  Validation of
 * required fields comes into play as the user attempts to advance to the next.  If there are missing fields,
 * the missing fields will be highlighted as errors, and the user cannot advance until the necessary information
 * has been provided.
 */
    .directive('mobileCheckoutWizard',['$location', '$anchorScroll', '$rootScope', function($location, $anchorScroll, $rootScope){
        return {
            restrict: 'A',
            link: function(scope) {
                var Wiz = function () {
                    this.step1Done = false;
                    this.step2Done = false;
                    this.step3Done = false;
                    // credit card expiration year drop-down - go 10 years out
                    this.years = [];
                    for (var year = new Date().getFullYear(), i = year, stop = year + 10; i < stop; i++) {
                        this.years.push(i);
                    }
                    this.months = ['01','02','03','04','05','06','07','08','09','10','11','12'];

                };

                scope.wiz = new Wiz();

                /** Mark mobile wizard step 1 "done" - bill-to address information has been entered.*/
                scope.shipToDone = function (shipToFormValid, form, shipToCountry) {
                    scope.$broadcast('submitting:form', form);
                    if (shipToFormValid && shipToCountry) {
                        scope.wiz.step1Done = true;
                        scope.showPristineErrors = false;
                        // guarantee correct scrolling for mobile
                        $location.hash('step2');
                        $anchorScroll();
                    } else {
                        scope.showPristineErrors = true;
                    }
                };

                /** Mark mobile wizard step 2 "done" - the ship-to address has been entered.*/
                scope.billToDone = function (billToFormValid, form) {
                    scope.$broadcast('submitting:form', form);
                    // if the ship to form fields are hidden, angular considers them empty - work around that:
                    if (billToFormValid || scope.shipToSameAsBillTo) {
                        scope.wiz.step2Done = true;
                        scope.showPristineErrors = false;
                        // guarantee correct scrolling for mobile
                        $location.hash('step3');
                        $anchorScroll();
                    } else {
                        scope.showPristineErrors = true;
                    }
                };

                /** Mark mobile wizard step 3 "done" - the payment information has been entered.*/
                scope.paymentDone = function (paymentFormValid, form) {
                    scope.$broadcast('submitting:form', form);
                    if (paymentFormValid) {
                        scope.wiz.step3Done = true;
                        // guarantee correct scrolling for mobile
                        $rootScope.$emit('preview:order', {shipToDone: scope.wiz.step2Done, billToDone: scope.wiz.step1Done});
                        $location.hash('step4');
                        $anchorScroll();
                    } else {
                        scope.showPristineErrors = true;
                    }

                };

                /** Mobile wizard - edit bill-do and mark subsequent steps as undone.*/
                scope.editBillTo = function () {
                    scope.wiz.step1Done = false;
                    scope.wiz.step2Done = false;
                    scope.wiz.step3Done = false;
                };

                /** Mobile wizard - edit ship-to and mark subsequent steps as undone.*/
                scope.editShipTo = function () {
                    scope.wiz.step2Done = false;
                    scope.wiz.step3Done = false;
                };

                /** Mobile wizard - edit payment information.*/
                scope.editPayment = function () {
                    scope.wiz.step3Done = false;
                };
            }
        };
    }]);