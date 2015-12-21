/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

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