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

angular.module('ds.ygooglesignin', [])
    .provider('YGoogleSignin', [ function() {

        this.$get = ['$q', function($q) {
            
            var GoogleObject = function() {};
            var user;
            var url = 'https://apis.google.com/js/client:platform.js?onload=onLoad';

            function loadData (googleClientId) {
                var deferred = $q.defer();
                var meta = document.createElement('meta');
                meta.name = 'google-signin-scope';
                meta.content = 'profile email';
                document.getElementsByTagName('head')[0].appendChild(meta);

                meta.name = 'google-signin-client_id';
                meta.content = googleClientId;
                document.getElementsByTagName('head')[0].appendChild(meta);

                var s, r, t;
                r = false;
                s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = url;
                t = document.getElementsByTagName('script')[0];
                t.parentNode.insertBefore(s, t);
                s.onload /*= s.onreadystatechange*/ = function() {
                    if (!r && (!this.readyState || this.readyState === 'complete')) {
                        r = true;
                        window.gapi.load('auth2', function() {
                            window.gapi.auth2.init().then(function () {
                                deferred.resolve('This is response');
                            });
                        });
                    }
                };
                return deferred.promise;
            }

            GoogleObject.prototype.loadData = function (googleClientId) {
                loadData(googleClientId);
            };

            GoogleObject.prototype.getUser = function (googleClientId) {
                var deferred = $q.defer();
                loadData(googleClientId).then(function () {
                    var auth2 = window.gapi.auth2.getAuthInstance();
                    if (auth2.isSignedIn.get()) {
                        var profile = auth2.currentUser.get().getBasicProfile();
                        user = {
                            firstName: profile.Za,
                            lastName: profile.Na,
                            email: profile.hg,
                            image: profile.Ph,
                        };
                    } else {
                        user = {};
                    }
                    deferred.resolve(user);
                });
                return deferred.promise;
            };

            GoogleObject.prototype.login = function () {
                var deferred = $q.defer();
                window.gapi.load('auth2', function() {
                    var auth2 = window.gapi.auth2.getAuthInstance();
                    auth2.signIn().then(function (response) {
                        user = {
                            firstname: response.wc.Za,
                            lastname: response.wc.Na,
                            email: response.wc.hg,
                            image: response.wc.Ph,
                            token: response.hg.access_token
                        };
                        deferred.resolve(user);
                    });
                });
                return deferred.promise;
            };

            GoogleObject.prototype.logout = function () {
                var auth2 = window.gapi.auth2.getAuthInstance();
                auth2.signOut();
            };

            return new GoogleObject();

        } ];

    }]);