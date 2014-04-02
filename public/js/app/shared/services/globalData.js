'use strict';

angular.module('hybris.bs&d.newborn.shared')
    .service('GlobalData', ['settings', '$rootScope',
        function (settings, $rootScope) {

            var onSignin = function(e, user) {
                this.buyer.id = user.username;
            };

            this.languageCode = settings.languageCode;

            this.tenant = {
                id: settings.tenantId
            };

            this.buyer = {
                id: settings.buyerId
            };

            this.authorization = {
                id: settings.authorizationId
            };

            // EVENTS
            var onSigninHandler = $rootScope.$on('signin:success', onSignin.bind(this));
            $rootScope.$on('$destroy', function() {
                onSigninHandler();
            });

        }
    ]);
