describe("ProductAttributeSvc", function () {

    beforeEach(module('restangular'));
    beforeEach(module('ds.products'));

    var $httpBackend, ProductAttributeSvc;

    beforeEach(inject(function (_$httpBackend_, _ProductAttributeSvc_) {
        $httpBackend = _$httpBackend_;
        ProductAttributeSvc = _ProductAttributeSvc_;
    }));

    it("should get schema", function () {
        var callbackSpy = jasmine.createSpy();

        $httpBackend.expectGET('http://path.to/schema').respond(200, 'expected schema');
        ProductAttributeSvc.getSchema('http://path.to/schema').then(callbackSpy);

        $httpBackend.flush();
        expect(callbackSpy.mostRecentCall.args[0]).toEqual('expected schema');
    });

    it("should get attribute groups from product", function () {
        var product = {
            metadata: {
                mixins: {
                    attributegroup_1: "http://path.to/attributegroup_1/schema",
                    attributegroup_2: "http://path.to/attributegroup_2/schema",
                }
            },
            mixins: {
                inventory: 'not a attribute group',
                attributegroup_1: 'group 1 attributes',
                attributegroup_2: 'group 2 attributes'
            }
        };

        var groups = ProductAttributeSvc.getAttributeGroups(product);

        expect(groups.length).toBe(2);
        expect(groups).toContain({
            schema: 'http://path.to/attributegroup_1/schema',
            attributes: 'group 1 attributes'
        });
        expect(groups).toContain({
            schema: 'http://path.to/attributegroup_2/schema',
            attributes: 'group 2 attributes'
        });
    });

    it("should return positive if has any of attributes set", function () {
        var product = {
            metadata: {
                mixins: {}
            },
            mixins: {
                attributegroup_1: {
                    attr_1: "test",
                    attr_2: null
                },
            }
        };

        var result = ProductAttributeSvc.hasAnyOfAttributesSet(product);

        expect(result).toBe(true);
    });

    it("should return negative if has none of attributes set", function () {
        var product = {
            metadata: {
                mixins: {}
            },
            mixins: {
                attributegroup_1: {
                    attr_1: null,
                    attr_2: null
                },
            }
        };

        var result = ProductAttributeSvc.hasAnyOfAttributesSet(product);

        expect(result).toBe(false);
    });

    it("should define date formatting", function () {
        expect(ProductAttributeSvc.dateFormatting.date).toBeDefined();
        expect(ProductAttributeSvc.dateFormatting.time).toBeDefined();
        expect(ProductAttributeSvc.dateFormatting.dateTime).toBeDefined();
    });
});