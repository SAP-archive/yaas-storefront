'use strict';

var CouponPageObject = function () {

    var buttons = {
        applyCoupon: element(by.id('apply-coupon')),
        removeCoupon: element(by.id('remove-coupon'))
    };

    var inputFields = {
        couponCode: element(by.id('coupon-code'))
    };

    var textDisplays = {
        errorMessage: element(by.binding('couponErrorMessage'))
    };

    this.applyCoupon = function (couponCode) {
        inputFields.couponCode.click();
        inputFields.couponCode.sendKeys(couponCode);
        buttons.applyCoupon.click();
    };

    this.removeCoupon = function () {
        buttons.removeCoupon.click();
    };

    this.getErrorMessage = function () {
        return textDisplays.errorMessage.getText();
    };
};

module.exports = CouponPageObject;