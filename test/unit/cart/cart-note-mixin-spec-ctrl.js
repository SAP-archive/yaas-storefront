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

describe('CartNoteMixinCtrl Test', function () {

    var $scope, $rootScope, $controller, $injector, cartNoteMixinCtrl;
    
    beforeEach(angular.mock.module('ds.cart'));
    
    beforeEach(inject(function(_$rootScope_, _$controller_, $q) {

        this.addMatchers({
            toEqualData: function (expected) {
                return angular.equals(this.actual, expected);
            }
        });
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        
        this.deferred1 = $q.defer();
        this.deferred2 = $q.defer();
        
        mockedCartNoteMixinSvc = {
            updateNote: function () {},
            removeNote: function () {}
        }
        
        spyOn(mockedCartNoteMixinSvc, "updateNote").andReturn(this.deferred1.promise);
        spyOn(mockedCartNoteMixinSvc, "removeNote").andReturn(this.deferred2.promise);
        
        mockedCartSvc = {};
        
        cartNoteMixinCtrl = _$controller_('CartNoteMixinCtrl', {
            $scope: $scope,
            $state: {}, 
            CartSvc: mockedCartSvc,
            CartNoteMixinSvc: mockedCartNoteMixinSvc
        });
        
        
    }));
    
    it('should expand the note input section', function(){
        $scope.note.expandNote();
        expect($scope.note.noteCollapsed).toBeFalsy();
    });
    
    it('should collapse the note input section', function(){
        $scope.note.collapseNote();
        expect($scope.note.noteCollapsed).toBeTruthy();
    });
    
    it('should call updateNote in the CartNoteMixinSvc on submit/save', function(){
        $scope.note.content = "A placeholder note";
        $scope.note.submit({});
        // Resolve the promise of updateNote
        this.deferred1.resolve();
        $rootScope.$digest();
        
        expect(mockedCartNoteMixinSvc.updateNote).toHaveBeenCalled();
    });
    
    it('should call removeNote when a blank note is saved (submitted)', function(){
        spyOn($scope.note, 'removeNote').andReturn({});
        
        $scope.note.content = "";
        $scope.note.submit({});
        
        expect($scope.note.removeNote).toHaveBeenCalled();
    });
    it('should call removeNote in the CartNoteMixinSvc on note remove', function(){
        $scope.note.removeNote({});
        // Resolve the promise of updateNote
        this.deferred2.resolve();
        $rootScope.$digest();
        
        expect(mockedCartNoteMixinSvc.removeNote).toHaveBeenCalled();
    });
});