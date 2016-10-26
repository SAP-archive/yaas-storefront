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

            function isScriptExist () {
                var scripts = document.getElementsByTagName('script');
                for (var i = 0; i < scripts.length; i++) {
                    if (scripts[i].src === url) {
                        return true;
                    }
                }
                return false;
            }

            GoogleObject.prototype.loadData = function (googleClientId) {
                var deferred = $q.defer();
                if (!isScriptExist()) {
                    var meta = document.createElement('meta');
                    meta.name = 'google-signin-scope';
                    meta.content = 'profile email';
                    document.getElementsByTagName('head')[0].appendChild(meta);

                    meta.name = 'google-signin-client_id';
                    meta.content = googleClientId;
                    document.getElementsByTagName('head')[0].appendChild(meta);

                    var params = {
                        /* jshint ignore:start */
                        client_id: googleClientId,
                        cookie_policy: 'single_host_origin'
                        /* jshint ignore:end */
                    };

                    var s, r, t;
                    r = false;
                    s = document.createElement('script');
                    s.type = 'text/javascript';
                    s.src = url;
                    t = document.getElementsByTagName('script')[0];
                    t.parentNode.insertBefore(s, t);
                    s.onload = s.onreadystatechange = function() {
                        if (!r && (!this.readyState || this.readyState === 'complete')) {
                            r = true;
                            window.gapi.load('auth2', function() {
                                window.gapi.auth2.init(params).then(function () {
                                    deferred.resolve();
                                });
                            });
                        }
                    };
                }

                return deferred.promise;
            };

            GoogleObject.prototype.getUser = function (googleClientId) {
                var deferred = $q.defer();
                this.loadData(googleClientId).then(function () {
                    var auth2 = window.gapi.auth2.getAuthInstance();
                    if (auth2.isSignedIn.get()) {
                        var profile = auth2.currentUser.get().getBasicProfile();
                        user = {
                            firstName: profile.pfa,
                            lastName: profile.xea,
                            email: profile.U3,
                            image: profile.Qaa,
                        };
                    } else {
                        user = {};
                    }
                    deferred.resolve(user);
                });
                return deferred.promise;
            };

            GoogleObject.prototype.login = function () {
                var params = {
                    scope: 'profile email'
                };
                var deferred = $q.defer();
                window.gapi.load('auth2', function() {
                    var auth2 = window.gapi.auth2.getAuthInstance();
                    auth2.signIn(params).then(function (response) {
                        user = {
                            firstname: response.w3.pfa,
                            lastname: response.w3.xea,
                            email: response.w3.U3,
                            image: response.w3.Qaa,
                            /* jshint ignore:start */
                            token: response.Zi.access_token
                            /* jshint ignore:end */
                        };
                        deferred.resolve(user);
                    });
                });
                return deferred.promise;
            };

            GoogleObject.prototype.logout = function () {
                var deferred = $q.defer();
                var auth2 = window.gapi.auth2.getAuthInstance();
                auth2.signOut().then(function () {
                    deferred.resolve();
                });
                return deferred.promise;
            };

            return new GoogleObject();

        } ];

    }]);