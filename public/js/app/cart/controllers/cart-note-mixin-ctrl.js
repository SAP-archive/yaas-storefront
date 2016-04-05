/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.cart')
    .controller('CartNoteMixinCtrl', ['$scope', '$state', 'CartSvc', 'CartNoteMixinSvc',
        function($scope, $state, CartSvc, CartNoteMixinSvc) {

            // NOTE mixin
            $scope.note = {
                noteCollapsed: true,
                saveFailed: false,
                removeNoteFailed: false,
                oldContent: '',
                content: '',

                collapseNote: function() {
                    // reset the variable, if user tries again
                    this.saveFailed = false;
                    this.noteCollapsed = true;
                },

                expandNote: function(comment) {
                    this.content = comment;
                    this.noteCollapsed = false;
                },

                removeNote: function(item) {
                    var self = this;
                    CartNoteMixinSvc.removeNote(item).then(function() {
                        self.content = '';
                    }, function() {
                        self.removeNoteFailed = true;
                    });
                },

                submit: function(item) {
                    var self = this;

                    // Saving a blank comment is equivalent to removing the comment
                    if (self.content === ''){
                        self.removeNote(item);
                    } else {
                        CartNoteMixinSvc.updateNote(item, self.content)
                        .then(function() {
                            self.collapseNote();
                        }, function() {
                            self.saveFailed = true;
                        });
                    }
                }
            };
        }
    ]);