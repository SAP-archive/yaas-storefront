'use strict';

angular.module('hybris.bs&d.newborn.products.services.products', [])
    .service('Products', ['Resource', 'settings', 'GlobalData',
        function Products($resource, settings, GlobalData) {
            
            var defaultAttributes = {
                    id: null,
                    sku: null,
                    url: null,
                    name: null,
                    description: null,
                    published: null,
                    inStock: true,
                    price: null,
                    created: null,
                    images: []
                };


            var apiUrl = [settings.apis.products.baseUrl, settings.apis.products.uri].join(''),
                DEFAULT_HEADERS = {};
            
            DEFAULT_HEADERS[settings.apis.headers.tenant] = GlobalData.tenant.id;
            DEFAULT_HEADERS[settings.apis.headers.authorization] = GlobalData.authorization.id;
        
            this.API = $resource(apiUrl, { productSku: '@sku' }, null, DEFAULT_HEADERS);

            this.API.prototype.validate = function(attributes) {
                var errors = null;
                attributes = attributes || this;
                if (!attributes.name.trim().length) {
                    errors = { name: 'Name is required!' };
                    this.attributes.name = null;
                }
                return errors;
            };

            this.API.prototype.removeImage = function(imageIndex) {
                if (this.images.length >= imageIndex) {
                    this.images.splice(imageIndex, 1);
                }
            };

            this.API.prototype.addImage = function(imageData) {
                this.images = this.images || [];
                this.images.push(imageData || { url: null });
            };

            this.API.prototype.getImages = function() {
                return this.images || [];
            };

            this.API.prototype.clear = function() {
                for(var attr in defaultAttributes) {
                    this[attr] = defaultAttributes[attr];
                }
            };

    }]);
