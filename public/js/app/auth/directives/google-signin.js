'use strict';

angular.module('ds.checkout', [])
    .directive('googleSignInButton', ['settings', function (settings) {

        return {
            scope: {
                buttonId: '@',
                options: '&'
            },
            template: '<div></div>',
            link: function(scope, element, attrs) {
                var meta = document.createElement('meta');
                meta.name = 'google-signin-scope';
                meta.content = 'profile email';
                document.getElementsByTagName('head')[0].appendChild(meta);

                meta.name = 'google-signin-client_id';
                meta.content = settings.googleClientId;
                document.getElementsByTagName('head')[0].appendChild(meta);


                var div = element.find('div')[0];
                div.id = attrs.buttonId;
                div.class = 'googleSigninButton';
                var s, r, t;
                r = false;
                s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://apis.google.com/js/platform.js';
                s.onload = s.onreadystatechange = function() {
                    if ( !r && (!this.readyState || this.readyState === 'complete')) {
                        r = true;
                        window.gapi.signin2.render(div.id, scope.options());

                        window.gapi.load('auth2', function() {
                            var GoogleAuth  = window.gapi.auth2.getAuthInstance();//get's a GoogleAuth instance with your client-id, needs to be called after gapi.auth2.init
                            console.log(GoogleAuth);
                        });
                        
                    }
                };
                t = document.getElementsByTagName('script')[0];
                t.parentNode.insertBefore(s, t);
            }
        };
    }]);
