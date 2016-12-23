/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2016 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

describe('OrderCancelDialogCtrl', function () {
    var $scope, $controller, $q,
        order, deferredOrder;

    var OrderDetailSvc = {};
    var mockedModal = {};

    beforeEach(module('ds.account', function ($provide) {
        $provide.value('$uibModalInstance', mockedModal);
    }));

    beforeEach(inject(function (_$rootScope_, _$controller_, _$q_) {
        $q = _$q_;
        order = {};

        mockedModal.close = jasmine.createSpy('close');
        mockedModal.dismiss = jasmine.createSpy('dismiss');

        $scope = _$rootScope_.$new();
        $controller = _$controller_;

        deferredOrder = $q.defer();
        OrderDetailSvc.cancelOrder = jasmine.createSpy('cancelOrder').andReturn(deferredOrder.promise);
    }));

    describe('', function () {

        beforeEach(function () {
            $controller('OrderCancelDialogCtrl', {$scope: $scope, 'OrderDetailSvc': OrderDetailSvc, 'order': order,'$uibModalInstance': mockedModal});
        });

        it('should expose correct scope interface', function () {
            expect($scope.cancelOrder).toBeDefined();
            expect($scope.closeCancelOrderDialog).toBeDefined();
        });

        it('should call OrderDetailSvc.cancelOrder() when cancelOrder() is called and close modal when success', function () {
            $scope.modalInstance = mockedModal;
            $scope.cancelOrder();

            expect(OrderDetailSvc.cancelOrder).toHaveBeenCalled();
            deferredOrder.resolve({});

            $scope.$digest();

            expect(mockedModal.close).toHaveBeenCalled();
        });

        it('should dismiss modal when $scope.closeCancelOrderDialog() is called', function () {
            $scope.closeCancelOrderDialog();
            expect(mockedModal.dismiss).toHaveBeenCalled();
        });

    });
});