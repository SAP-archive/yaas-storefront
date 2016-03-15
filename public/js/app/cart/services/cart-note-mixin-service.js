angular.module('ds.cart')
    .factory('CartNoteMixinSvc', ['$rootScope', 'CartSvc', 'CartREST', '$q', 'GlobalData',
        function ($rootScope, CartSvc, CartREST, $q, GlobalData) {
            
            // To be added to cart item's Metadata property
            var noteMixinMetadata = "https://api.yaas.io/hybris/schema/v1/kiwistest/example-schema.json";
            // The actual note
            var note = {
                code: ""
            };
            
            return {
                updateNote: function(cartItem, noteContent){
                    var updatePromise = $q.defer();
                    
                    var noteMixin = {
                        metadata: {
                            mixins: {
                                note: "https://api.yaas.io/hybris/schema/v1/kiwistest/example-schema.json"
                            }
                        },
                        mixins: {
                            note: {
                                code: noteContent
                            }
                        }
                    } 
                    
                    // Get cart info from CartSvc
                    var cart = CartSvc.getLocalCart();
                    var cartUpdateMode = 'auto';
                    var closeCartAfterTimeout = undefined;
                    
                    CartREST.Cart.one('carts', cart.id)
                    .all('items')
                    .customPUT(noteMixin, cartItem.id + '?partial=true')
                    .then(function () {
                            CartSvc.refreshCart(cart.id, 'auto', closeCartAfterTimeout);
                            updatePromise.resolve();
                        }, 
                        function () {
                            updatePromise.reject();
                        }
                    );
                    
                    return updatePromise.promise;
                }
            }
        }
    ]);