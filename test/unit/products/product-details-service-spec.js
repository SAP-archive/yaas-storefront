describe("ProductDetailsSvc", function () {

    beforeEach(module('restangular'));
    beforeEach(module('ds.products'));

    var $httpBackend, ProductDetailsSvc;

    beforeEach(inject(function (_$httpBackend_, _ProductDetailsSvc_) {
        $httpBackend = _$httpBackend_;
        ProductDetailsSvc = _ProductDetailsSvc_;
    }));

    it("should get schema", function () {
        var callbackSpy = jasmine.createSpy();

        $httpBackend.expectGET('http://path.to/schema').respond(200, 'expected schema');
        ProductDetailsSvc.getSchema('http://path.to/schema').then(callbackSpy);

        $httpBackend.flush();
        expect(callbackSpy.mostRecentCall.args[0]).toEqual('expected schema');
    });
});