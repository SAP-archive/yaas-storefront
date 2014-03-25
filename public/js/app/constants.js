'use strict';

angular.module('rice.constants',[])
    .constant('Constants', {

        baseUrl: 'http://responsive.hybris.com:9001',
        apiUri: '/rest/v1/apparel-uk',
        apiBaseUrl: function(url) {
            return this.baseUrl + this.apiUri + (url || '');
        }

    });

