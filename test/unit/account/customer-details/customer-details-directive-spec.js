describe('directive: customerDetails', function () {
    var element, scope, ctrl, compile, rootScope;
    var mockedGlobalData = {
        getUserTitles: jasmine.createSpy()
    };
    var mockedModal = {};
    var mockedAccountSvc = {};

    beforeEach(module('ds.account', function ($provide) {
        $provide.value('GlobalData', mockedGlobalData);
        $provide.value('$modal', mockedModal);
        $provide.value('AccountSvc', mockedAccountSvc);
    }));

    beforeEach(inject(function ($rootScope, $compile, $templateCache) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        compile = $compile;

        var templateHtml = '<div><div class="mockedCustomerDirective"></div></div>';
        $templateCache.put('js/app/account/directives/customer-details/customer-details.html', templateHtml);
    }));

    function createElement(template) {
        element = compile(template)(scope);
        scope.$digest();
        return element;
    };

    it('should create customer-details element', function () {
        var elem = createElement('<customer-details></customer-details>');

        var items = elem.find('.mockedCustomerDirective');

        expect(items.length).toEqual(1);
    });
});