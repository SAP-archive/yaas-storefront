/**
 * Created by i839794 on 10/2/14.
 */

describe('filters', function() {

    beforeEach(module('ds.shared'));

    describe('encodeURIComponent', function() {

        it('should encode String to be URI compliant',
            inject(function(encodeURIComponentFilter) {
                expect(encodeURIComponentFilter('what > !#@|')).toBe('what%20%3E%20!%23%40%7C');
            }));
    });
});
