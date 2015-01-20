/**
 * Created by i839794 on 9/12/14.
 */
describe('httpQueue', function(){

    var $q, $httpBackend, httpQueue, $scope;
    var config = {method: 'GET', url: '/someUrl', headers: {}};
    var config2 = {method: 'GET', url: '/someUrl2', headers: {}};

    beforeEach(module('ds.queue'));
    beforeEach(module('pascalprecht.translate'));

    beforeEach(inject(function(_httpQueue_, _$httpBackend_, _$q_, _$rootScope_) {
        httpQueue = _httpQueue_;
        $httpBackend = _$httpBackend_;
        $q = _$q_;
        $scope = _$rootScope_;
    }));


    describe('retryAll', function(){
        var deferredBlocked;
        var deferredRejected;

        beforeEach(function(){
            deferredBlocked = $q.defer();
            deferredRejected = $q.defer();
            httpQueue.appendBlocked(config, deferredBlocked);
            httpQueue.appendRejected(config2, deferredRejected);
            this.addMatchers({
                toEqualData: function (expected) {
                    return angular.equals(this.actual, expected);
                }
            });
        });

        it('should resolve/retry blocked requests with token header', function () {
            var success;
            var onSuccess = function (result) {
                success = result;
            }
            var promise = deferredBlocked.promise;

            promise.then(onSuccess, function (failure) {
                console.log(failure);
            });
            var token = 'abc123';
            httpQueue.retryAll(token);
            $scope.$digest();
            expect(success).toBeTruthy();
            expect(success).toEqualData({ method : 'GET', url : '/someUrl', headers : { Authorization : 'Bearer abc123' } } );
        });

        it('should retry rejected requests', function(){

        });
    });
});