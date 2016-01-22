angular.module('ds.ygooglesignin', []).provider('YGoogleSignin', [ function() {

    'use strict';

    this.$get = ['AuthSvc', 'settings', '$q', function(AuthSvc, settings, $q) {
        
        var GoogleObject = function() {};
        var user;
        var url = 'https://apis.google.com/js/client:platform.js?onload=onLoad';

        function loadData () {
            var deferred = $q.defer();
            var meta = document.createElement('meta');
            meta.name = 'google-signin-scope';
            meta.content = 'profile email';
            document.getElementsByTagName('head')[0].appendChild(meta);

            meta.name = 'google-signin-client_id';
            meta.content = settings.googleClientId;
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

        GoogleObject.prototype.loadData = function () {
            loadData();
        };

        GoogleObject.prototype.getUser = function () {
            var deferred = $q.defer();
            loadData().then(function () {
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
            window.gapi.load('auth2', function() {
                var auth2 = window.gapi.auth2.getAuthInstance();
                auth2.signIn().then(function (response) {
                    user = {
                        firstname: response.wc.Za,
                        lastname: response.wc.Na,
                        email: response.wc.hg,
                        image: response.wc.Ph
                    };
                    AuthSvc.onGoogleLogIn(response.hg.access_token, user);
                });
            });
        };

        GoogleObject.prototype.logout = function () {
            var auth2 = window.gapi.auth2.getAuthInstance();
            auth2.signOut();
        };

        return new GoogleObject();

    } ];

}]);