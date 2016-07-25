'use strict';

var desktopSiteConfig = require('../config/desktop-site.json');

var TI = require('./account.test-input.json');
var utils = require('../utils/utils.js');
var AccountPageObject = require('./account.po.js');
var SitePageObject = require('../site/site.po.js');


describe('account:', function() {

    var accountPO,
        sitePO;

    var testUsers = TI.users;

    describe('verify login functionality', function() {

        beforeEach(function() {
            utils.deleteCookies();
            utils.setWindowSize(desktopSiteConfig.windowDetails.width, desktopSiteConfig.windowDetails.height);

            accountPO = new AccountPageObject();
            sitePO = new SitePageObject();

            sitePO.getHomePage();
        });

        it('should not allow invalid user to login', function() {
            accountPO.loginUser(testUsers.bad);
            expect(accountPO.getAccountModalErrorMessage()).toEqual(TI.errorMessages.INVALIDUSER.EN);
        });

        it('should allow an existing user to login', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            expect(accountPO.accountDetails.getFullName()).toContain(testUsers.cool.name.full);
        });

        it('should allow user to update account info', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            expect(accountPO.accountDetails.getFullName()).toContain(testUsers.cool.name.full);

            accountPO.accountDetails.editDetails(testUsers.cool.alternateName);

            expect(accountPO.accountDetails.getFullName()).toContain(testUsers.cool.alternateName.full);

            accountPO.accountDetails.editDetails(testUsers.cool.name);

            expect(accountPO.accountDetails.getFullName()).toContain(testUsers.cool.name.full);
        });

        it('should be able to create a new user', function() {
            accountPO.createAccount(testUsers.bad,true);

            expect(accountPO.getAccountModalErrorMessage()).toEqual(TI.errorMessages.WEAKPASSWORD.EN);

            var newUser = {
                name: 'cool',
                password: 'coolio'
            };
             
            accountPO.createAccount(newUser,false);

            accountPO.accountDetails.getPage();

            expect(accountPO.accountDetails.getContactEmail()).toContain(newUser.name);

        });

        it('should allow existing user to manage addresses', function() {
            accountPO.createAccount(testUsers.addressTest,true);

            accountPO.accountDetails.getPage();

            accountPO.populateAddress(testUsers.addressTest.address1);

            expect(accountPO.address.getStreet(0)).toEqual(testUsers.addressTest.address1.street + ', ' + 
                                                           testUsers.addressTest.address1.aptNumber);

            expect(accountPO.address.getCity(0)).toEqual(testUsers.addressTest.address1.cityStateZipCode);
            expect(accountPO.address.getCountry(0)).toEqual(testUsers.addressTest.address1.countryAcronym);
            expect(accountPO.address.getContactPhone(0)).toEqual(testUsers.addressTest.address1.contactPhone);

            accountPO.populateAddress(testUsers.addressTest.address2);

            expect(accountPO.address.getContactName(1)).toEqual(testUsers.addressTest.address2.contactName);
            expect(accountPO.address.getStreet(1)).toEqual(testUsers.addressTest.address2.street + ', ' + 
                                                           testUsers.addressTest.address2.aptNumber);
            expect(accountPO.address.getCity(1)).toEqual(testUsers.addressTest.address2.cityStateZipCode);
            expect(accountPO.address.getCountry(1)).toEqual(testUsers.addressTest.address2.countryAcronym);
            expect(accountPO.address.getContactPhone(1)).toEqual(testUsers.addressTest.address2.contactPhone);

            accountPO.address.setDefault();

            expect(accountPO.address.getStreet(0)).toEqual(testUsers.addressTest.address2.street + ', ' + 
                                                           testUsers.addressTest.address2.aptNumber);

            accountPO.address.setDefault();

            expect(accountPO.address.getStreet(0)).toEqual(testUsers.addressTest.address1.street + ', ' + 
                                                           testUsers.addressTest.address1.aptNumber);
            
            accountPO.address.delete();

            // Confirm delete address
            accountPO.address.waitForDeleteButton();

            accountPO.address.delete();

            // Confirm delete address
            expect(accountPO.address.isDeleteButtonPresent()).toBe(false);
        });

        it('should not allow user to update password with an incorrect original password', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            accountPO.accountDetails.updatePassword(TI.passwordTestVectors.vector1);

            accountPO.accountDetails.clickUpdatePasswordButton();

            expect(accountPO.getAccountModalErrorMessage()).toEqual(TI.errorMessages.WRONGPASSWORD.EN);
        });

        it('should not allow user to update their password if it less than 6 chars', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            accountPO.accountDetails.updatePassword(TI.passwordTestVectors.vector2);

            expect(accountPO.accountDetails.isUpdatePasswordButtonEnabled()).toBe(false);
        });

        it('should not allow user to update their password if it does not match confirmation', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            accountPO.accountDetails.updatePassword(TI.passwordTestVectors.vector3);

            expect(accountPO.accountDetails.isUpdatePasswordButtonEnabled()).toBe(false);
        });

        it('should allow user to update their password provided the new password is valid', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            accountPO.accountDetails.updatePassword(TI.passwordTestVectors.vector4);

            accountPO.accountDetails.clickUpdatePasswordButton();

            accountPO.logoutUser();

            var coolUser = {
                username: testUsers.cool.username,
                password: 'password'
            };

            accountPO.loginUser(coolUser);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            accountPO.accountDetails.updatePassword(TI.passwordTestVectors.vector5);

            accountPO.accountDetails.clickUpdatePasswordButton();
        });

        it('should allow user to update their email', function() {
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            accountPO.accountDetails.updateEmail(testUsers.cool.newEmail, testUsers.cool.password);

            expect(accountPO.accountDetails.isCheckEmailModalPresent()).toBe(true);

            accountPO.accountDetails.closeCheckEmailModal();

            accountPO.logoutUser();

            // Verify the user still can login in with the old email, as the new one was not confirmed
            accountPO.loginUser(testUsers.cool);

            accountPO.waitForSignInComplete();

            accountPO.accountDetails.getPage();

            expect(accountPO.accountDetails.getContactEmail()).toContain(testUsers.cool.username);

        });

    });

});

