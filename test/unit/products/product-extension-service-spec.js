describe("ProductExtensionSvc", function () {

    beforeEach(module('restangular'));
    beforeEach(module('ds.products'));

    var $httpBackend, ProductExtensionSvc;

    beforeEach(inject(function (_$httpBackend_, _ProductExtensionSvc_) {
        $httpBackend = _$httpBackend_;
        ProductExtensionSvc = _ProductExtensionSvc_;
    }));

    it("should get schema", function () {
        var callbackSpy = jasmine.createSpy();

        $httpBackend.expectGET('http://path.to/schema').respond(200, 'expected schema');
        ProductExtensionSvc.getSchema('http://path.to/schema').then(callbackSpy);

        $httpBackend.flush();
        expect(callbackSpy.mostRecentCall.args[0]).toEqual('expected schema');
    });
});