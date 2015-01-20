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

describe('languageSelectorController Test', function () {

    var $scope, $rootScope, $controller;

    var langCode = 'en';
    var language = {id: langCode}
    var languages = [language];


    //***********************************************************************
    // Common Setup
    // - shared setup between constructor validation and method validation
    //***********************************************************************

    // configure the target controller's module for testing - see angular.mock
    beforeEach(angular.mock.module('ds.shared'));

    beforeEach(inject(function(_$rootScope_,  _$controller_) {

        $rootScope =  _$rootScope_;
        $scope = _$rootScope_.$new();
        $controller = _$controller_;
    }));

    var mockedGlobalData;

   



    beforeEach(function () {
        mockedGlobalData = {
            getAvailableLanguages: function(){return languages},
            setLanguage: jasmine.createSpy('setLanguage'),
            getLanguageCode: function(){return langCode;},
            setCurrency: jasmine.createSpy('setCurrency')
        };
        spyOn(mockedGlobalData, 'getAvailableLanguages').andCallThrough();
        languageSelectorController = $controller('languageSelectorController', {$scope: $scope, $rootScope: $rootScope, 'GlobalData': mockedGlobalData});
        
    });

    describe('language Selection', function () {

        it("should get available languages from GlobalData", function() {
            expect(mockedGlobalData.getAvailableLanguages).wasCalled();
        });

        describe('initialization', function() {
            it('should have language related select box variables set correctly', function () {
                expect($scope.language).toBeDefined();
                expect($scope.language.selected).toBeDefined();
                expect($scope.language.selected.iso).toBeDefined();
                expect($scope.language.selected.iso).toEqual(langCode);
                expect($scope.language.selected.value).toBeDefined();
                expect($scope.language.selected.value).toEqual(langCode);

                expect($scope.languages).toBeDefined();

                /*
                 expect($scope.languages.length).toEqual($scope.languageCodes.length);
                 for (var i = 0; i < $scope.languageCodes.length; i++) {
                 expect($scope.languages[i].iso).toEqual($scope.languageCodes[i]);
                 expect($scope.languages[i].value).toEqual($scope.languageCodes[i]);
                 };*/
            });
        });

        describe('watchLanguage', function(){
            it('should setLanguage in GlobalData if selected language changes', function(){
                var newLang =  'pl';
                $scope.language.selected = {iso: newLang, languageCode: newLang};
                $scope.$apply();
                //??? expect(mockedGlobalData.setLanguage).toHaveBeenCalledWith(newLang);
            });
        });


        describe('onLanguageChanged', function(){
            it('should update the selected language if different', function(){
                $rootScope.$emit('language:updated', {languageCode: 'pl'});
                expect(mockedGlobalData.setLanguage).toHaveBeenCalled;
            });
        });


    });

});
