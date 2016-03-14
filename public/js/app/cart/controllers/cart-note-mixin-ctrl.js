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

angular.module('ds.cart')
    /** This controller manages the interactions of the cart view. The controller is listening to the 'cart:udpated' event
     * and will refresh the scope's cart instance when the event is received. */
    .controller('CartNoteMixinCtrl', ['$scope', '$q', '$rootScope', 'CartSvc', 'CartNoteMixinSvc',
        function($scope, $q, $rootScope, CartSvc, CartNoteMixinSv) {

            // NOTE mixin
            $scope.note = {
                noteCollapsed: true,
                oldContent: "",
                content: "",
                collapseNote: function() {
                    this.noteCollapsed = true;
                },
                expandNote: function(savedNote) {
                    this.noteCollapsed = false;
                },
                submit: function(item) {
                    var self = this;
                    CartNoteMixinSvc.updateNote(item, this.content)
                        .then(function() {
                        },
                        function() {
                            alert("Note save failed");
                        })
                        .finally(function() {
                            self.collapseNote();
                        });
                }
            }
        }
    ]);