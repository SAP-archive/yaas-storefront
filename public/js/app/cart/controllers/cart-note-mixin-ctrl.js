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
    .controller('CartNoteMixinCtrl', ['$scope', '$state', '$q', '$rootScope', 'CartSvc', 'CartNoteMixinSvc', 'GlobalData', 'settings', 'AuthSvc', 'AuthDialogManager',
        function($scope, $state, $q, $rootScope, CartSvc, CartNoteMixinSvc, GlobalData, settings, AuthSvc, AuthDialogManager) {

            // Add NOTE mixin
            $scope.note = {
                noteCollapsed: true,
                oldContent: "",
                content: "",
                onBlur: function(item) {
                    if (this.content == "")
                        this.collapseNote();
                    /*
                    if (this.content == this.oldContent) {
                        this.collapseNote();
                    }
                    else {
                        // If note changed, submit it
                        var submitPromise = this.submit(item);
                        if (submitPromise) {
                            submitPromise
                            .then(function() {
                                alert("Saved success!");
                            },
                            function() {
                                alert("Fail");
                            })
                            .finally(function(){
                                this.collapseNote();
                            });
                        }
                        else {
                            this.collapseNote();
                        }

                    }
                    */
                },
                collapseNote: function() {
                    //this.content = "";
                    this.noteCollapsed = true;
                },
                expandNote: function(savedNote) {
                    //this.oldContent = savedNote || "";
                    //this.content = this.oldContent;
                    this.noteCollapsed = false;
                },
                submit: function(item) {
                    var self = this;
                    console.log("note.submit");
                   // if (!(this.oldContent == this.content)) {
                        CartNoteMixinSvc.updateNote(item, this.content)
                            .then(function() {
                                alert("Saved success!");
                            },
                            function() {
                                alert("Fail");
                            })
                            .finally(function() {
                                self.collapseNote();
                            });
                    //}

                }
            }
        }
    ]);