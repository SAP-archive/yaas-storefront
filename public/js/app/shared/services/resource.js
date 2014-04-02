'use strict';

angular.module('hybris.bs&d.newborn.shared')
    .factory('Resource', ['$resource', '$q',
        function($resource, $q) {

            return function(url, params, actions, defaultHeaders) {

                var resource,
                    DEFAULT_ACTIONS = {
                        'get':    { method: 'GET' },
                        'save':   { method: 'POST' },
                        'query':  { method: 'GET', isArray:true },
                        'remove': { method: 'DELETE' },
                        'delete': { method: 'DELETE' },
                        'update': { method: 'PUT' }
                    },
                    // TODO: add loading indicator here and extract this and headers into reusalbe custom resource
                    DEFAULT_INTERCEPTOR = {
                        response: function (data) {
                            console.log('response in interceptor', data);
                        },
                        responseError: function (data) {
                            console.log('error in interceptor', data);
                        }
                    };

                actions = angular.extend(DEFAULT_ACTIONS, actions);
                
                angular.forEach(actions, function(action) {
                    // Handle headers
                    action.headers = angular.extend(action.headers || {}, defaultHeaders || {});

                    // Handle interceptors
                    if (!action.interceptor) {
                        action = angular.extend(action, { interceptor: DEFAULT_INTERCEPTOR });
                    } else {
                        // Merge custom with default interceptors
                        var mergedInterceptor = action.interceptor;
                        angular.forEach(action.interceptor, function(interceptorFn, interceptorKey) {
                            if (DEFAULT_INTERCEPTOR[interceptorKey]) {
                                mergedInterceptor[interceptorKey] = function() {
                                    DEFAULT_INTERCEPTOR[interceptorKey].apply(this, arguments);
                                    interceptorFn.apply(this, arguments);
                                };
                            }
                            action.interceptor = mergedInterceptor;
                        });
                    }
                });

                resource = $resource(url, params, actions);
                
                resource.prototype.isNew = function() {
                    // return !this.id;
                    return !this.created;
                };

                resource.prototype.saveOrUpdate = function(successCallback, errorCallback, ctx) {
                    var self = this,
                        deferred = $q.defer(),
                        handlers = {
                            success: function() {
                                console.log('Product ', (self.isNew() ? 'saved' : 'updated') ,' successfully! ', arguments);
                                if (successCallback) {
                                    successCallback.call(ctx || this);
                                }
                                deferred.resolve();
                            },
                            error: function() {
                                console.log('Product NOT ', (self.isNew() ? 'saved' : 'updated') ,'! ', arguments);
                                if (errorCallback) {
                                    errorCallback.call(ctx || this);
                                }
                                deferred.reject();
                            }
                        };

                    if (this.isNew()) {
                        this.$save(handlers.success, handlers.error);
                    } else {
                        this.$update(handlers.success, handlers.error);
                    }

                    return deferred.promise;
                };

                // Abstract method performing validation - to be implemented per resource
                // Return null if object is valid
                // Return object with validation errrs if object is invalid
                resource.prototype.validate = function() {
                    return null;
                };

                resource.prototype.isValid = function(attributes) {
                    this.errors = this.validate(attributes);
                    return !this.errors;
                };

                resource.prototype.serialize = function() {
                    return resource;
                };

                return resource;
            };

        }
    ]);