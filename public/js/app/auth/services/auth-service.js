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

/**
 *  Encapsulates access to the "authentication" service.
 */
angular.module('ds.auth')
    .factory('AuthSvc', ['AuthREST', '$rootScope', 'settings', 'TokenSvc', 'GlobalData', 'appConfig', '$state', '$q', 'SessionSvc', '$window', 'YGoogleSignin',
        function (AuthREST, $rootScope, settings, TokenSvc, GlobalData, appConfig, $state, $q, SessionSvc, $window, YGoogleSignin) {

            function loginAndSetToken(user) {
                return AuthREST.Customers.all('login').customPOST(user).then(function (response) {
                    return TokenSvc.setToken(response.accessToken, user ? user.email : null);
                });
            }

            /** Call this function once a Facebook OAuth token has been obtained.
             * This call with authenticate the user with yaas and will retrieve basic profile information from Facebook.
             * */
            function onFbLogIn(fbToken) {
                AuthenticationService.socialLogin('facebook', fbToken).then(function () {
                    $rootScope.$emit('user:socialLogIn', {loggedIn: true});
                    /* jshint ignore:start */
                    try {
                        FB.api('/me', {}, function (response) {
                            SessionSvc.afterSocialLogin({
                                email: response.email,
                                firstName: response.first_name,
                                lastName: response.last_name
                            });
                        });
                    } catch (error) {
                        console.error('Unable to load FB user profile');
                    }
                    /* jshint ignore:end */
                }, function () {
                    $rootScope.$emit('user:socialLogIn', {loggedIn: false});
                });

            }


            var AuthenticationService = {

                getFBAndGoogleLoginKeys: function () {
                    return AuthREST.Customers.all('loginconfig').get('');
                },

                /** Calls the Facebook API to validate that the user is logged into FB - if yes,
                 * the existing FB token will be used to log the user into the store.  Note that this
                 * function should only be called if the user is already logged into Facebook - if we
                 * invoke the FB.login API through code rather than the integrated FB button,
                 * the login dialog will be a pop-up rather than an iframe.
                 */
                faceBookLogin: function () {
                    FB.getLoginStatus(function (response) {
                        if (response.status === 'connected') {
                            onFbLogIn(response.authResponse.accessToken);
                        } else {
                            FB.login(function () {}, { scope: 'email' });
                        }
                    }, true);

                },

                /** Loads the Facebook SDK. */
                initFBAPI: function () {
                    try {
                        if (settings.facebookAppId) {

                            // load Facebook SDK
                            $window.fbAsyncInit = function () {
                                FB.init({
                                    appId: settings.facebookAppId,
                                    xfbml: false,
                                    version: 'v2.2'
                                });

                                // Catch "login" events as the user logs in through the FB login dialog which is shown by the FB SDK
                                FB.Event.subscribe('auth.statusChange', function (response) {
                                    if (response.status === 'connected') {
                                        onFbLogIn(response.authResponse.accessToken);
                                    }
                                });
                                FB.XFBML.parse();
                            };
                            (function (d, s, id) {
                                var js, fjs = d.getElementsByTagName(s)[0];
                                var fbElement = d.getElementById(id);
                                if (fbElement) {

                                    return;
                                }
                                js = d.createElement(s);
                                js.id = id;
                                js.src = '//connect.facebook.net/en_US/sdk.js';
                                fjs.parentNode.insertBefore(js, fjs);

                            }(document, 'script', 'facebook-jssdk'));

                        }
                    } catch (e) {
                        console.error('Unable to initialize Facebook API');
                        console.error(e);
                    }
                },


                onGoogleLogIn: function (user) {
                    AuthenticationService.socialLogin('google', user.token).then(function () {
                        $rootScope.$emit('user:socialLogIn', {loggedIn: true});
                        try {
                            if (user.image) {
                                GlobalData.user.image = user.image;
                            }
                            SessionSvc.afterSocialLogin({
                                email: user.email,
                                firstName: user.firstname,
                                lastName: user.lastname
                            });
                        } catch (error) {
                            console.error('Unable to load Google user profile');
                        }
                    }, function () {
                        $rootScope.$emit('user:socialLogIn', {loggedIn: false});
                    });

                },

                initGoogleAPI: function () {
                    YGoogleSignin.loadData(settings.googleClientId);
                },

                isGoogleLoggedIn: function (customer) {
                    if (customer && customer.accounts) {
                        for (var i = 0; i < customer.accounts.length; i++) {
                            if (customer.accounts[i].providerId === 'google') {
                                return true;
                            }
                            return false;
                        }
                    }
                    return false;
                },

                fbParse: function () {
                    if (typeof FB !== 'undefined') {
                        FB.XFBML.parse();
                    }
                },

                extractServerSideErrors: function (response) {
                    var errors = [];
                    if (response.status === 400 && response.data.details && response.data.details[0].field && response.data.details[0].field === 'password') {
                        errors.push({message: 'PASSWORD_INVALID'});
                    } else if (response.status === 401 || response.status === 404) {
                        errors.push({message: 'INVALID_CREDENTIALS'});
                    } else if (response.status === 409) {
                        errors.push({message: 'ACCOUNT_ALREADY_EXISTS'});
                    } else if (response.status === 403) {
                        errors.push({message: 'ACCOUNT_LOCKED'});
                    } else {
                        errors.push({ message: 'SERVER_UNAVAILABLE'});
                    }
                    return errors;
                },

                /**
                 * Performs login (customer specific or anonymous) and updates the current OAuth token in the local storage.
                 * Returns a promise with "success" = access token for when that action has been performed.
                 *
                 * @param user JSON object (with email, password properties), or null for anonymous user.
                 */
                signin: function (user) {
                    var def = $q.defer();
                    loginAndSetToken(user).then(function () {
                        settings.hybrisUser = user.email;
                        SessionSvc.afterLogIn().then(
                            function () {
                                def.resolve();
                            },
                            function () {
                                def.reject();
                            }
                        );
                    }, function (error) {
                        def.reject(error);
                    });
                    return def.promise;
                },

                signup: function (user, context) {
                    var def = $q.defer();
                    AuthREST.Customers.all('signup').customPOST(user).then(function () {
                        if ($window.navigator.cookieEnabled) {
                            loginAndSetToken(user).then(function () {
                                settings.hybrisUser = user.email;
                                SessionSvc.afterLoginFromSignUp(context).then(
                                    function () {
                                        def.resolve({});
                                    },
                                    function () {
                                        def.reject();
                                    }
                                );
                            }, function (error) {
                                def.reject(error);
                            });
                        } else {
                            def.resolve({cookiesDisabled: true});
                        }
                        
                    }, function (error) {
                        def.reject(error);
                    });
                    return def.promise;
                },

                /** Logs the customer out and removes the token cookie. */
                signOut: function () {
                    if (GlobalData.customerAccount.accounts[0].providerId === 'google') {
                        YGoogleSignin.logout().then(function () {
                            GlobalData.user.image = settings.avatarImagePlaceholder;
                        });
                    }
                    AuthREST.Customers.all('logout').customGET('', {accessToken: TokenSvc.getToken().getAccessToken()});
                    // unset token after logout - new anonymous token will be generated for next request automatically
                    TokenSvc.unsetToken(settings.accessCookie);
                    SessionSvc.afterLogOut();
                },

                /** Returns true if there is a user specific OAuth token cookie for the current tenant.*/
                isAuthenticated: function () {
                    var token = TokenSvc.getToken();
                    return !!token.getAccessToken() && !!token.getUsername() && token.getTenant() === appConfig.storeTenant();
                },

                /** Issues a 'reset password' request. Returns the promise of the completed action.*/
                requestPasswordReset: function (email) {
                    var user = {
                        email: email
                    };
                    return AuthREST.Customers.all('password').all('reset').customPOST(user);
                },

                /** Issues a 'change reset' request via email/link with token.  Returns the promise of the completed action.
                 * @param token that was obtained for password reset
                 * @param new password
                 */
                changePassword: function (token, newPassword) {
                    var user = {
                        token: token,
                        password: newPassword
                    };
                    return AuthREST.Customers.all('password').all('reset').all('update').customPOST(user);
                },

                /** Modifies the password for an authenticated user.*/
                updatePassword: function (oldPassword, newPassword, email) {
                    var payload = {
                        currentPassword: oldPassword,
                        newPassword: newPassword,
                        email: email
                    };
                    return AuthREST.Customers.all('password').all('change').customPOST(payload);
                },

                /** Performs login logic following login through social media login.*/
                socialLogin: function (providerId, token) {
                    var deferred = $q.defer();
                    AuthREST.Customers.one('login', providerId).customPOST({accessToken: token}).then(function (response) {
                        // passing static username to trigger 'is authenticated' validation of token
                        TokenSvc.setToken(response.accessToken, 'social');
                        SessionSvc.afterLogIn().then(function () {
                            deferred.resolve();
                        });
                    }, function () {
                        deferred.reject();
                    });
                    return deferred.promise;
                }

            };
            return AuthenticationService;

        }]);