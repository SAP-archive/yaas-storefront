(function () {
    'use strict';
    var data = {};

    function contains(xx, it) {
        return xx !== undefined && xx.indexOf(it) !== -1;
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        };
    }

    var _tenantId,
        _clientId,
        _redirectUrl,
        _autoLoad,
        _consentReference,
        _token,
        _siteConfig,
        _pagesFiltered,
        _pageResolver,
        _configUrl,
        _customFunctionResolver,
        tracker,
        getValuesPending = false;
    //var basePiwikUrl = 'https://api.yaas.io/hybris/profile-piwik/v1/';
    var basePiwikUrl = 'https://api.yaas.io/hybris/profile-edge/v1/';
    var optInUrl = 'https://api.yaas.io/hybris/profile-consent/v1/';
    var isJqueryLoaded = function (callback) {
        if (typeof window.jQuery === 'undefined') {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    callback();
                };
            }
        } else {
            callback();
        }
    };
    Array.prototype.first = function () {
        return this[0];
    };
    var isPiwikLoaded = function (callback) {
        if (typeof window._paq === 'undefined') {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/piwik/2.16.1/piwik.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            if (script.readyState) { //IE
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                script.onload = function () {
                    callback();
                };
            }
        } else {
            callback();
        }
    };
    var getPiwikQueryParameters = function (hash) {
        var split = hash.split('&');
        var obj = {};
        for (var i = 0; i < split.length; i++) {
            var kv = split[i].split('=');
            obj[kv[0]] = decodeURIComponent(kv[1] ? kv[1].replace(/\+/g, ' ') : kv[1]);
        }

        //Set date for this request to current datetime when request processed. Needed from CDM for order of events.
        obj.date = new Date().getTime();
        return obj;
    };
    var getCookie = function (name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    };
    var makePiwikRequest = function (obj) {
        if (!!_token) {
            var req = {
                method: 'POST',
                //url: basePiwikUrl + _tenantId + '/events',
                url: basePiwikUrl + "events",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + _token.access_token,
                    'consent-reference': _consentReference,
                    'hybris-tenant': _tenantId
                },
                data: JSON.stringify(obj)
            };
            $.ajax(req).then(function () {
                //console.log('piwik event sent');
            }, function (error) {
                // refresh roken
                //console.log("error sending piwik request", error);
            });
        } else {
            // try later one time
            setTimeout(function () {
                makePiwikRequest(obj);
            }, 1000);
        }

    };
    var getConsentReference = function () {

        _consentReference = getCookie("consentReferenceCookie");


        if (!!_consentReference) {
            _consentReference = JSON.parse(decodeURIComponent(_consentReference)).consentReference;
            return _consentReference;
        } else {
            return '';
        }
    };
    var makeOptInRequest = function () {
        var req = {
            method: 'POST',
            url: optInUrl + _tenantId + '/consentReferences',
            headers: {
                'Authorization': "Bearer " + _token.access_token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: "{}"
        };
        return $.ajax(req);
    };
    window.Y_TRACKING = window.Y_TRACKING || (function () {

        var init = function (config, pageResolver, customFunctionResolver) {
            var tenantId = config.tenantId;
            var clientId = config.clientId;
            var redirectUrl = config.redirectUrl;
            var autoLoad = true;
            if (config.autoLoad === false) {
                autoLoad = false;
            }

            if (!tenantId || !clientId || !redirectUrl) {
                console.error('Tracking not initialized correctly! Plase provide tenantId, clientId and redirectUrl to init function.');
                return;
            }

            //Assign fields
            _tenantId = tenantId;
            _clientId = clientId;
            _redirectUrl = redirectUrl;
            _pageResolver = pageResolver;
            _autoLoad = autoLoad;
            _configUrl = config.configUrl;
            _customFunctionResolver = customFunctionResolver;

            //Load jQuery if not loaded
            isJqueryLoaded(function () {
                //Get token
                getAccessToken(tenantId, clientId, redirectUrl, true);
                //Event for url change
                $(window).on('hashchange', function () {
                    if (_autoLoad) {
                        getValues();
                    }
                });
            });
            //Load piwik if not loaded
            isPiwikLoaded(function () {
                tracker = Piwik.getTracker();

                // init piwik
                window._paq = window._paq || [];
                //Make requests to service custom
                window._paq.push(['setCustomRequestProcessing', processPiwikRequest]);
                //Add site code. It should be   <tenant>.<siteCode>
                window._paq.push(['setSiteId', _tenantId + '.' + "site"]);
                window._paq.push(['setDocumentTitle', 'PageViewEvent']);
                window._paq.push(['trackPageView']);
                window._paq.push(['enableLinkTracking']);
                //   window._paq.push(['setCookieDomain', '*.profile.yaas.io']);
                //Now get values
                if (getValuesPending) {
                    getValues();
                }

            });
            // add event listener for mesages
            if (window.addEventListener) {
                window.addEventListener('message', dispatch, false);
            } else {
                window.attachEvent('onmessage', dispatch);
            }
        };
        var getAccessToken = function (tenantId, clientId, redirectUrl, callGetMappings) {

            $.get('https://api.yaas.io/hybris/account/v1/auth/anonymous/login?client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(redirectUrl) + '&hybris-tenant=' + tenantId).then(function (response) {
                //var token = response.access_token;

                _token = response;
                if (callGetMappings) {
                    getMappings(_autoLoad);
                }
                //Call the method for getting stuff??
            }, function () {
                console.error('Unable to get token for tracking - ensure project id is configured correctly.');
            });
        };
        var injectCSS = function (str) {
            var node = document.createElement('style');
            node.innerHTML = str;
            document.body.appendChild(node);
        };
        var dispatch = function (evt) {
            if (evt.origin !== 'https://tracking-builder-module-v1.us-east.modules.yaas.io') {
                //console.log("unmatched origin: ", evt.origin);
                return;
            }


            if (evt.data.action !== undefined && evt.data.action !== '') {
                if (evt.data.action === 'startIngestion') {
                    bindIngestion(evt);
                }
                if (evt.data.action === "testRequest") {
                    testRequest(evt);
                }
            } else {
                // ignore
            }
        };

        var testRequest = function (evt) {
            var __result = {};
            var testResult = "";
            switch (evt.data.data.type) {
                case 'text':
                    __result = $(evt.data.data.selector).text();
                    break;
                case 'html':
                    __result = $(evt.data.data.selector).html();
                    break;
                case 'cookie':
                    __result = getCookie(evt.data.data.selector);
                    break;
                case 'js_variable':
                    // simple variable
                    __result = window[evt.data.data.selector];
                    break;
                case 'dom':
                    __result = $(evt.data.data.selector);
                    break;
                case 'constant':
                    __result = evt.data.data.selector;
                    break;
                case 'consent':
                    __result = "consent is registering a click handler. Please click on element.";
                    break;
                default:
                    __result = "unknown mapping type";

            }

            testResult = applyPostProcessingFunction(__result, {
                type: evt.data.data.type,
                attributeValue: evt.data.data.attributeValue,
                selector: evt.data.data.selector,
                postProcessing: evt.data.data.postProcessing
            });



            parent.postMessage({
                action: "testResult",
                testResult: testResult,
                reference: evt.data.data.reference
            }, "https://tracking-builder-module-v1.us-east.modules.yaas.io");
        };

        var fetchJSObject = function (selector) {
            var q = JSON.parse(selector);
            var temp = window;
            for (var i = 0; i < q.length; i++) {
                temp = temp[q[i]];
            }

            return temp;
        };

        var bindIngestion = function (evt) {
            var message;
            injectCSS('.outline-element { outline: 1px solid #c00 }');
            injectCSS('.outline-element-clicked { outline: 1px solid #0c0 }');
            $('*').on('mouseover mouseout', function (event) {
                var $tgt = $(event.target);
                if (!$tgt.closest('.syntax_hilite').length) {
                    $tgt.toggleClass(event.type === 'click' ? 'outline-element-clicked' : 'outline-element');
                }
            });
            $(document).on('click', '*', function (e) {
                e.preventDefault();
                e.stopPropagation();
                //console.log(document.styleSheets);

                var selectorItems = [];
                var parents = $(this).parents();
                for (var i = 0; i < parents.length; i++) {
                    var item = parents[i];
                    var selector = '';
                    if (item.id) {
                        selector = '#' + item.id;
                    } else {
                        selector = item.tagName.toLowerCase();
                    }

                    if (item.className) {
                        //Check for each class if it is defined in stylesheet, so we know which ones are custom?
                        selector += '.' + $.trim(item.className).replace(/\s/gi, ".");;
                    }

                    selectorItems.push(selector);
                    if (item.id) {
                        break;
                    }
                }

                //Reverse array
                selectorItems.reverse();
                //Join with >
                var selector = selectorItems.join('>');
                //
                selector = selector + '>';
                var id = $(this).attr("id");
                if (id) {
                    selector += "#" + id;
                } else {
                    selector += $(this).prop("tagName").toLowerCase();
                }

                $(this).removeClass('tracking-element-hover');
                var classNames = $(this).attr("class");
                if (classNames) {
                    selector += "." + $.trim(classNames).replace(/\s/gi, ".");
                }

                selector = selector.replace('.outline-element', '');
                var example = $(selector).text();
                parent.postMessage({
                    "action": "clicked",
                    "selector": selector,
                    "example": example
                }, "https://tracking-builder-module-v1.us-east.modules.yaas.io");
                //console.log(selector);
            });
        };
        var setConsentReferenceCookie = function (consentReference, days) {
            var expires = 0;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = "consentReferenceCookie" + "=" + encodeURIComponent(consentReference) + expires + "; path=/";
        };

        var performOptIn = function (obj, callback) {
            //noinspection JSUnusedAssignment
            setTimeout(function () {
                makeOptInRequest().success(function (response) {
                    if (!!response.id) {
                        var cookieVal = {};
                        cookieVal.consentReference = response.id;
                        setConsentReferenceCookie(JSON.stringify(cookieVal), 30);
                    }

                    callback();
                });
            }, 1000);
        };

        var processPiwikRequest = function (e) {

            if (!_siteConfig || !_pagesFiltered || _pagesFiltered.length < 1) {
                return;
            } else {
                var ecr = getEffectiveConsent(_siteConfig, _pagesFiltered[0]);

                var obj = getPiwikQueryParameters(e);
                
                //Once we send custom data, we should clean state
                obj._profile_custom = $.extend({}, data);
                data = {};

                if (!!window.Y_TRACKING && !!window.Y_TRACKING._id) {
                    obj._id = window.Y_TRACKING._id;
                } else {
                    window.Y_TRACKING = window.Y_TRACKING || {};
                    window.Y_TRACKING._id = obj._id;
                }
                console.log(obj);
                /*
                 if no consent reference cookie present, we must get the consent reference before making the
                 first call to the tracking endpoint
                 */

                switch (ecr) {
                    case 'implicit':
                        if (!getConsentReference()) {
                            performOptIn(obj, function () {
                                //Make post request to service
                                makePiwikRequest(obj);
                            });
                        } else {
                            //Make post request to service
                            makePiwikRequest(obj);
                        }
                        break;

                    case 'explicit':
                        if (!getConsentReference()) {
                            // do nothing, we are not allowed
                        } else {
                            makePiwikRequest(obj);
                        }
                        break;
                }
            }
        };

        var getMappings = function (callGetValues) {
            if (_siteConfig === undefined || _siteConfig === null || _pagesFiltered === undefined || _pagesFiltered === null) {
                var pageId = _pageResolver();

                var mappingUrl = _configUrl;
                console.log("trying to get config from:" + _configUrl);
                $.get(mappingUrl).then(function (response) {

                    _siteConfig = JSON.parse(response);
                    console.info("siteconfig is ", _siteConfig);
                    _pagesFiltered = _siteConfig.pages.filter(function (el) {
                        // filter out the page
                        return (el.pageId === pageId);
                    });

                    if (callGetValues) {
                        getValues();
                    }
                    //Call the method for getting stuff??
                }, function () {
                    console.error('Unable to get mappings for this tenant - ensure that you are subscribed to this package.');
                });
            } else {
                if (callGetValues) {
                    getValues();
                }
            }
        };

        var getValues = function () {

            getValuesPending = true;
            if (!_tenantId || !_clientId || !_redirectUrl) {
                //console.error('Tracking not initialized correctly! Plase provide tenantId, clientId and redirectUrl to init function.');
                return;
            }

            if (!_token) {
                getAccessToken(_tenantId, _clientId, _redirectUrl, true);
                return;
            }

            getValuesPending = false;
            processMappingConfiguration();
        };

        var getEffectiveConsent = function (siteConfig, page) {
            if (page.consent === 'inherit') {
                return siteConfig.siteConsent;
            } else {
                return page.consent;
            }
        };


        /**
         * handles a detail view.
         * Tracking data gets sent ad-hoc
         * 
         * @param {type} page
         * @returns {undefined}
         */
        var handleDetailView = function (page) {

        };
        /*
         * Handles impression
         * Tracking data is sent ad-hoc
         * 
         * @param {type} page
         * @returns {undefined}
         */
        var handleImpression = function (page) {
            var mappings = page.mappings;

            for (var index = 0; index < mappings.length; index++) {
                // iterate through the mappings

                var mapping = mappings[index];
                var obj = $(mapping.selector);
                switch (mapping.type) {
                    case "consent":
                        handleConsent(page, mapping, obj);
                        // do nothing more
                        break;

                    case "cookie":
                        var t = getCookie(mapping.selector);
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case "html":
                        var t = $(mapping.selector).html();
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case "text":
                        var t = $(mapping.selector).text();
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case "js_variable":
                        var t = window[mapping.selector];
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case 'constant':
                        data[mapping.key] = mapping.selector;
                        break;

                    case "dom":
                        data[mapping.key] = applyPostProcessingFunction(obj, mapping);
                        break;
                    case "click":
                        // do nothing
                        break;

                    default:
                        // TODO default
                        break;
                }
            }

            sendPiwikPageViewEvent();
        };

        var sendPiwikCommerceEvent = function (productSku, productName, category, price) {
            window._paq.push(['setEcommerceView',
                productSku, //(required) SKU: Product unique identifier
                productName, //(optional) Product name
                category, //(optional) Product category, or array of up to 5 categories
                price //(optional) Product Price as displayed on the page
            ]);

            window._paq.push(['trackPageView', 'ProductDetailPageViewEvent']);
        };

        var sendPiwikSiteSearchEvent = function (keyword, category, resultCount) {
            window._paq.push(['trackSiteSearch',
                keyword, // Search keyword searched for
                category, // Search category selected in your search engine. If you do not need this, set to false
                0, // Number of results on the Search results page. Zero indicates a 'No Result Search Keyword'. Set to false if you don't know
                window._paq.push(['setCustomData', {
                    'categoryName': category
                }])
                //window._paq.push(['setCustomVariable', 5, "_pkc", category])
            ]);
        };

        var sendPiwikCategoryViewEvent = function (categoryPage) {
            window._paq.push(['setEcommerceView',
                false, //No product on Category page
                false, //No product on Category page
                categoryPage // Category Page, or array of up to 5 categories
            ]);

            window._paq.push(['trackPageView', 'CategoryPageViewEvent']);
        };

        var sendPiwikAdd2CartEvent = function (productSku, productName, category, price, qty, cartId) {
            window._paq.push(['addEcommerceItem',
                productSku, //(required) SKU: Product unique identifier
                productName, //(optional) Product name
                category, //(optional) Product category, or array of up to 5 categories
                price + '', //(optional) Product Price as displayed on the page.
                qty + '']);

            if (cartId === undefined) {
                cartId = guid();
            }
            window._paq.push(['setCustomVariable', 1, "ec_id", cartId, "page"]);
            window._paq.push(['trackEcommerceCartUpdate', '0']);
            //window._paq.push(['trackPageView']);

        };

        var sendPiwikPageViewEvent = function () {
            window._paq.push(['trackPageView', 'PageViewEvent']);
        };

        var handleConsent = function (page, mapping, object) {
            var ec = getEffectiveConsent(_siteConfig, page);
            if (ec === 'explicit') {
                object.click(function () {
                    performOptIn();
                });
            } else {
                // implicit, do nothing
            }
        };

        var applyPostProcessingFunction = function (input, mapping) {
            var ret = '';

            switch (mapping.type) {
                case 'js_variable':
                    if (typeof mapping.attributeValue === 'string' && mapping.attributeValue.length > 0) {
                        ret = input[mapping.attributeValue];
                    } else {
                        ret = input;
                    }
                    break;

                default:
                    if (typeof mapping.attributeValue === 'string' && mapping.attributeValue.length > 0) {
                        ret = input.attr(mapping.attributeValue);
                    } else {
                        ret = input;
                    }
                    break;
            }


            // refactor to foreach
            if (typeof mapping.postProcessing === 'object' && mapping.postProcessing.length > 0 && ret !== undefined) {
                for (var y = 0; y < mapping.postProcessing.length; y++) {
                    var dyn = mapping.postProcessing[y];
                    if (dyn.func === 'map_get') {
                        ret = ret[dyn.params];
                    } else {
                        ret = ret[dyn.func](dyn.params);
                    }

                }
            }

            //return ret + ''; // clone-safe
            var retValue = ret;
            if (typeof ret === 'object') {
                retValue = jQuery.extend(true, {}, ret);
            }

            return retValue;

        };

        /**
         * handles commerce detail view
         * sends tracking data ad-hoc
         * @param {type} page
         * @returns {undefined}
         */
        var handleCommerceDetail = function (page) {
            var mappings = page.mappings;

            for (var index = 0; index < mappings.length; index++) {
                // iterate through the mappings

                var mapping = mappings[index];
                var obj = $(mapping.selector);
                switch (mapping.type) {
                    case "consent":
                        handleConsent(page, mapping, obj);
                        // do nothing more
                        break;

                    case "cookie":
                        var t = getCookie(mapping.selector);
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case "html":
                        var t = $(mapping.selector).html();
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case "text":
                        var t = $(mapping.selector).text();
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case "js_variable":
                        var t = window[mapping.selector];
                        data[mapping.key] = applyPostProcessingFunction(t, mapping);
                        break;

                    case 'constant':
                        data[mapping.key] = mapping.selector;
                        break;

                    case "dom":
                        data[mapping.key] = applyPostProcessingFunction(obj, mapping);
                        break;
                    case "click":
                        var clickType = mapping.attributeValue;
                        if (clickType === "add2Cart") {
                            obj.click(function () {

                                // do add 2 cart call
                                if (data.productSku && data.productName && data.productCategory && data.productPrice) {
                                    sendPiwikAdd2CartEvent(data.productSku, data.productName, data.productCategory, data.productPrice, 1);
                                }

                            });
                        }
                        break;


                    default:
                        // TODO default
                        break;
                }
            }

            if (data.searchTerm) {
                sendPiwikSiteSearchEvent(data.searchTerm, data.productCategory, 1);
            }
            if (data.productSku && data.productName && data.productCategory && data.productPrice) {
                sendPiwikCommerceEvent(data.productSku, data.productName, data.productCategory, data.productPrice);
                sendPiwikCategoryViewEvent(data.productCategory);
            }
            sendPiwikPageViewEvent();
        };

        /**
         * Handles commerce overview
         * does not send tracking data
         * @param {type} page
         * @returns {undefined}
         */
        var handleCommerceOverview = function (page) {

        };
        /**
         * not used yet
         * @param {type} page
         * @returns {undefined}
         */
        var handleCustom = function (page) {

        };
        var processMappingConfiguration = function () {
            // we have only one page
            if (_pagesFiltered) {
                var page = _pagesFiltered[0];

                if(page.pageType === 'General'){
                    page.pageType = 'impression';
                }

                switch (page.pageType) {
                    case "detailView":
                        // product detail
                        handleDetailView(page);
                        break;

                    case "impression":
                        // content site
                        handleImpression(page);
                        break;

                    case "commerceDetail":
                        handleCommerceDetail(page);
                        break;

                    case "commerceOverview":
                        handleCommerceOverview(page);
                        break;

                    case "custom":
                        // use PageViewEvent with custom data
                        handleCustom(page);
                        break;
                }
            }
        };

        var collectMappings = function () {
            getValues();
        };

        return {
            init: init,
            collectMappings: collectMappings
        };
    })();
})();