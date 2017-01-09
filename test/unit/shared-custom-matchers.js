var jasmineCustomMatchers = function() {

    var PromiseMatcherHelper = {
        states: {
            RESOLVED: 'resolved',
            REJECTED: 'rejected'
        },
        retrievePromiseInfo: function(promise) {
            var _this = this;
            var rootScope;
            angular.mock.inject(function($injector) {
                rootScope = $injector.get('$rootScope');
            });

            var promiseInfo = {};
            promise.then(function(data) {
                promiseInfo.status = _this.states.RESOLVED;
                promiseInfo.data = data;
            }, function(data) {
                promiseInfo.status = _this.states.REJECTED;
                promiseInfo.data = data;
            });

            rootScope.$apply();
            return promiseInfo;
        }
    };

    this.addMatchers({
        toBePromise: function() {
            return !!this.actual.then;
        },
        toBeRejected: function() {
            return PromiseMatcherHelper.retrievePromiseInfo(this.actual).status === PromiseMatcherHelper.states.REJECTED;
        },
        toBeResolved: function() {
            return PromiseMatcherHelper.retrievePromiseInfo(this.actual).status === PromiseMatcherHelper.states.RESOLVED;
        },
        toBeRejectedWithData: function(expected) {
            var promiseInfo = PromiseMatcherHelper.retrievePromiseInfo(this.actual);
            return promiseInfo.status === PromiseMatcherHelper.states.REJECTED && angular.equals(promiseInfo.data, expected);
        },
        toBeResolvedWithData: function(expected) {
            var promiseInfo = PromiseMatcherHelper.retrievePromiseInfo(this.actual);
            return promiseInfo.status === PromiseMatcherHelper.states.RESOLVED && angular.equals(promiseInfo.data, expected);
        }
    });

};