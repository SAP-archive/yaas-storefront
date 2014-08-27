/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('AuthDialogManager Test', function () {

    var AuthDialogManager;
    var $mockedModal = {
      close: jasmine.createSpy('close'),
      open: jasmine.createSpy('open').andReturn({
        result: {
            then: jasmine.createSpy('then')
        },
        close: jasmine.createSpy('closemodal')
      })
    };

    beforeEach(module('ds.auth', function($provide) {
      $provide.value('$modal', $mockedModal);
    }));

    beforeEach(inject(function(_AuthDialogManager_) {
      AuthDialogManager = _AuthDialogManager_;
    }));

    it('should expose correct interface', function () {
      expect(AuthDialogManager.isOpened).toBeDefined();
      expect(AuthDialogManager.open).toBeDefined();
      expect(AuthDialogManager.close).toBeDefined();
    });

    it("should open the dialog by delegating call to $modal instance", function() {
      var options = {
        templateUrl: 'abc.html',
        controller: 'SomeCtrl'
      };

      AuthDialogManager.open(options);
      expect($mockedModal.open).wasCalledWith(options);

      $mockedModal.open.reset();
      AuthDialogManager.open(options, {reuqired: true});
      var expectedOptions = angular.copy(options);
      expectedOptions.keyboard = false;
      expectedOptions.backdrop = 'static';
      expect($mockedModal.open).wasCalledWith(options);
    });

});
