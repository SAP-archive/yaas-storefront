angular.module('ds.cart')
    .factory('CartNoteMixinSvc', ['$rootScope', 'CartSvc', 'CartREST', 'ProductSvc', 'AccountSvc', '$q', 'GlobalData',
        function ($rootScope, CartSvc, CartREST, ProductSvc, AccountSvc, $q, GlobalData) {
            
            // To be added to cart item's Metadata property
            var noteMixinMetadata = {
                mixins: {
                    note: "https://api.yaas.io/hybris/schema/v1/kiwistest/example-schema.json"
                }
            };
            // The actual note
            var note = {
                code: ""
            };
            
            return {
                updateNote: function(cartItem, note){
                    alert("Update Note is called");
                    // Add Note mixin features to product item
                    if(item.hasOwnProperty("metadata")){
                        if (item.metadata.hasOwnProperty("mixins")){
                            item.metadata.mixins = noteMixinMetadata;
                        }
                    };
                    if(item.hasOwnProperty("mixins")){
                        item.mixins
                    }
                    note.code = note;
                    
                    
                    CartREST.Cart.one('carts', cart.id).all('items').post(cartItem).then(function () {
                            CartSvc.refreshCart(cart.id, cartUpdateMode, closeCartAfterTimeout);
                            updateDef.resolve();
                        }, function () {
                            angular.forEach(cart.items, function (it) {
                                if (item.id === it.id) {
                                    item.error = true;
                                }
                            });
                            updateDef.reject();
                        });
                }
            }
        }
    ]);