'use strict';

angular.module('hybris.bs&d.newborn.auth.services', [])
    .factory('SigninModel', [
        function() {

            var SigninModel = function(username, password) {
                this.username = username || null;
                this.password = password || null;
            };

            return SigninModel;
        }
    ]);
