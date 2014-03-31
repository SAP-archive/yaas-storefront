'use strict';

angular.module('hybris.bs&d.newborn.orders.services.orders', [])
    .service('Orders', ['$rootScope', 'Resource', 'settings', 'GlobalData', '$q',
        function Orders($rootScope, $resource, settings, GlobalData, $q) {
            
            var apiUrl = [settings.apis.orders.baseUrl, settings.apis.orders.uri].join(''),
                DEFAULT_HEADERS = {};
            
            DEFAULT_HEADERS[settings.apis.headers.tenant] = GlobalData.tenant.id;
            DEFAULT_HEADERS[settings.apis.headers.buyer] = GlobalData.buyer.id;
            
            this.API = $resource(apiUrl, {orderId: '@id'}, null, DEFAULT_HEADERS);

            this.createOrder = function(orderItems) {
                var deferred = $q.defer();
                var handlers = {
                        success: function() {
                            console.log('Order Saved successfully! ', arguments);
                            deferred.resolve();
                        },
                        error: function() {
                            console.log('Order NOT Saved! ', arguments);
                            deferred.reject();
                        }
                    },
                    order = {
                        buyerId: GlobalData.buyer.id,
                        entries: orderItems
                    },
                    newOrder = new this.API(order);

                newOrder.$save(handlers.success, handlers.error);
                return deferred.promise;
            };

    }]);
