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

'use strict';

angular.module('ds.i18n')
    .constant('TranslationsDE', {

        en: 'English',
        de: 'German',
        fr: 'French',
        es: 'Spanish',


        //-------------------------------------------------
        // Cart
        //-------------------------------------------------

        //XBUT
        BACK_TO_CHECKOUT: 'Back to checkout',
        //XBUT
        CHECKOUT: 'Checkout',
        //XBUT
        CONTINUE_SHOPPING: 'Continue shopping',
        //XBUT
        SHOP: 'Shop',
        //XFLD
        EST_ORDER_TOTAL: 'Est. order total',
        //XFLD
        FREE_SHIPPING: 'Free Shipping and Returns in the US',
        //XFLD
        ITEM: 'Item',
        //XFLD
        ITEM_PRICE: 'Item Price',
        //XFLD
        TOTAL_PRICE: 'Total Price',
        //XMSG
        CART_UNAVAILABLE: 'The cart is currently unavailable. Please try again.',
        //XMSG
        CART_EMPTY: 'Your cart is empty',
        //XMSG
        CART_ITEM_UPDATE_ERROR: 'The update was not successful. Please try again.',
        ESTIMATE_TAX: 'Estimate Tax',
        APPLY: 'Apply',
        ESTIMATE_TAX_ERROR: 'Zip/Postal Code and Country Code fields are required',


        //-------------------------------------------------
        // Checkout
        //-------------------------------------------------

        //XFLD
        ADDRESS: 'Address',
        //XFLD
        ADDRESS_LINE_1: 'Address Line 1',
        //XFLD
        ADDRESS_LINE_2: 'Address Line 2',
        //XGRP
        BILLING_ADDRESS: 'Billing Address',
        //XFLD
        CITY: 'City',
        //XFLD
        PROVINCE: 'Province',
        //XBUT
        CONTINUE: 'Continue',
        //XFLD
        COUNTRY: 'Country',
        //XFLD
        CREDIT_CARD_NUMBER: 'Credit Card Number',
        //XFLD
        CVC_NUMBER: 'CVC Number',
        //XFLD
        DELIVERY_METHOD: 'Delivery Method',
        //XFLD
        EMAIL: 'Email',
        //XBUT
        EDIT: 'Edit',
        //XFLD
        FIRST_NAME: 'First Name',
        //XLST
        FREE_STANDARD_SHIPPING: 'Free Standard Shipping',
        //XLST
        FLAT_RATE_SHPPING: 'Flat Rate',
        //XMSG
        INVALID_EXPIRATION_DATE: 'Invalid Expiration Date',
        //XFLD
        ITEMS: 'Items',
        //XFLD
        LAST_NAME: 'Last Name',
        //XFLD
        LAST_NAME_REQUIRED: 'Last Name Required',
        //XFLD
        METHOD: 'Method',
        //XFLD
        MIDDLE_NAME: 'Middle Name',
        //XFLD
        MONTH: 'Month',
        //XFLD
        NAME: 'Name',
        //XMSG
        NO_ITEMS_IN_CART: 'There are no items in your cart.',
        //XACT
        OPTIONAL: 'Optional',
        //XGRP
        ORDER_DETAILS: 'Order Details',
        //XFLD
        ORDER_DATE: 'Order Date',
        //XMSG
        ORDER_PENDING: 'One moment... Placing your order',
        //XFLD
        ORDER_TOTAL: 'Order Total',
        //XFLD
        PAYMENT: 'Payment',
        //XMSG
        PHONE_REQUIRED: 'Phone Required',
        //XBUT
        PLACE_ORDER: 'Place Order',
        //XFLD
        PLACED_AT: 'Placed At',
        //XMSG
        PLEASE_CORRECT_ERRORS: 'Please correct the errors above before placing your order.',
        //XMSG
        PLEASE_ENTER_VALID_CC: 'Please enter a valid credit card number',
        //XMSG
        PLEASE_ENTER_VALID_CODE: 'Please enter a valid code',
        //XMSG
        PLEASE_ENTER_VALID_EMAIL: 'Please enter a valid email in the format name@example.com',
        //XACT
        REQUIRED: 'Required',
        //XCKL
        SAME_AS_BILLING_ADDRESS: 'Same As Billing Address',
        //XTIT
        SECURE_CHECKOUT: 'Secure Checkout',
        //XBUT
        SELECT_FROM_ADDRESS_BOOK: 'Select from address book',
        //XFLD
        SHIPPING: 'Shipping',
        //XGRP
        SHIPPING_ADDRESS: 'Shipping Address',
        //XGRP
        SIMPLE_3_STEP_CHECKOUT: 'Simple 3 Step Checkout',
        //XGRP
        SIMPLE_4_STEP_CHECKOUT: 'Simple 4 Step Checkout',
        //XFLD
        STATE: 'State',
        //XGRP
        STEP_1_MY_DETAILS: 'Step 1. My Details',
        //XGRP
        STEP_2_SHIPPING_INFORMATION: 'Step 2. Shipping Information',
        //XGRP
        STEP_3_PAYMENT: 'Step 3. Payment',
        //XGRP
        STEP_4_REVIEW_ORDER: 'Step 4. Review Order',
        //XFLD
        SUBTOTAL: 'Subtotal',
        //XFLD
        DISCOUNT: 'Discount',
        //XFLD
        TAX: 'Tax',
        //XFLD
        TOTAL: 'Total',
        //XFLD
        YEAR: 'Year',


        //-------------------------------------------------
        // Addresses
        //-------------------------------------------------

        //XFLD
        DEFAULT: 'Default',
        //XFLD
        DISTRICT: 'District',
        //XFLD
        STREET_NAME: 'Street Name/ Number',
        //XFLD
        BUILDING_NAME: 'Building Name/ Number',
        //XFLD
        ROOM_NUMBER: 'Room Number',
        //XFLD
        PREFECTURE: 'Prefecture',
        //XFLD
        POSTAL_CODE: 'Postal Code',
        //XFLD
        ZIP: 'Zip/ Postal Code',
        //XFLD
        CITY_VILLAGE: 'City/ Village/ City Ward',
        //XFLD
        SUBAREA: 'Subarea',
        //XFLD
        FURTHER_SUBAREA: 'Further Subarea, Block #/ House #',


        //-------------------------------------------------
        // Coupons
        //-------------------------------------------------

        //XBUT
        COUPON_APPLY: 'Apply',
        //XFLD
        COUPON_APPLIED: 'Applied',
        //XLNK
        COUPON_CODE: 'Add Coupon Code',
        //XMSG
        COUPON_ERROR: 'Coupon not valid.',
        //XMSG
        COUPON_ERR_CURRENCY: 'Currency invalid with coupon',
        //XMSG
        COUPON_ERR_ANONYMOUS: 'Sign in to use coupon code',
        //XMSG
        COUPON_ERR_UNAVAILABLE: 'Coupon no longer available',
        //XMSG
        COUPON_MINIMUM_NOT_MET: 'Current order total does not meet the required minimum for this coupon',
        //XMSG
        COUPON_NOT_VALID: 'Coupon Not Valid',


        //-------------------------------------------------
        // Confirmation
        //-------------------------------------------------

        //XMSG
        A_COPY_OF_YOUR_ORDER_DETAILS_HAS_BEEN_SENT_TO: 'A copy of your order details has been sent to',
        //XMSG
        ENJOY_YOUR_ITEMS: 'Enjoy your items!',
        //XMSG
        FOR_YOUR_ORDER: 'for your order!',
        //XMSG
        ITEM_IN_YOUR_ORDER: 'Item in your order',
        //XMSG
        ITEMS_IN_YOUR_ORDER: 'Items in your order',
        //XMSG
        QUESTIONS: 'If you have any questions, contact us at',
        //XFLD
        ORDER: 'Order',
        //XBUT
        RETURN_TO_SHOPPING: 'Return to shopping',
        //XMSG
        SUCCESS: 'Success!',
        //XMSG
        ACCOUNT_SUCCESS: 'Your account was successfully created!',
        //XMSG
        THANK_YOU: 'Thank you',
        //XMSG
        THANK_YOU_FOR_YOUR_ORDER: 'Thank you</br>for your order!',
        //XMSG
        THE_SHIPMENT_IS_SCHEDULED_TO_ARRIVE_AT_THE_FOLLOWING_LOCATION: 'The order will be shipped to',
        //XMSG
        YOUR_ORDER_IS: 'Your order # is ',
        //XMSG
        ONE_MORE_STEP: 'One More Step to Create an Account',
        //XMSG
        ONE_MORE_STEP_MESSAGE: 'for a <strong>Fast Checkout</strong> and <strong>Easy Access</strong> to Previous Orders',
        //XFLD
        SKU: 'SKU',


        //-------------------------------------------------
        // Navigation
        //-------------------------------------------------

        //XFLD
        PRODUCTS: 'Products',
        //XBUT
        BACK_TO: 'Back To',
        //XFLD
        REGION: 'Region',


        //-------------------------------------------------
        // Product Detail Page
        //-------------------------------------------------

        //XBUT
        BUY: 'Buy',
        //XBUT
        ADD_TO_CART:'Add to Cart',
        //XTIT
        PRODUCT_DESCRIPTION: 'Product Description',
        //XBUT
        OUT_OF_STOCK: 'out of stock',
        //XFLD
        QTY: 'Qty',
        //XMSG
        ERROR_ADDING_TO_CART: 'Add to Cart was not successful.  Please try again.',


        //-------------------------------------------------
        // Product List Page
        //-------------------------------------------------

        //XLST
        NEWEST: 'newest',
        //XFLD
        OF: 'of',
        //XLST
        PRICE_HIGH_LOW: 'price high - low',
        //XLST
        PRICE_LOW_HIGH: 'price low - high',
        //XFLD
        SORT_BY: 'Sort by',
        //XFLD
        VIEWING: 'Viewing',
        //XFLD
        PRODUCTS_FROM_TO: '<div>{{productsFrom}}-{{productsTo}} of {{total}}</div>',
        //XFLD
        ALL_PRODUCTS: 'All Products',
        //XTIT
        EMPTY_MSG: 'Demo Store - Coming Soon',
        //XFLD
        LANGUAGES: 'Languages',
        //XFLD
        SELECT_LANGUAGE: 'Select a language',
        //XBUT
        SIGN_OUT: 'Sign Out',
        //XBUT
        SIGN_IN: 'Sign In',
        //XBUT
        SIGN_IN_WITH_FACEBOOK: 'Sign in with Facebook',
        //XBUT
        LOG_IN_WITH_GOOGLE_PLUS: 'Sign in with Google +',
        //XBUT
        MY_ACCOUNT: 'My Account',
        //XBUT
        CREATE_ACCOUNT: 'Create Account',
        //XBUT
        CONTINUE_AS_GUEST: 'Continue as our guest',


        //-------------------------------------------------
        // Account Page
        //-------------------------------------------------

        //XFLD
        ACCOUNT_DETAILS: 'Account details',
        //XBUT
        ADD: 'Add',
        //XGRP
        ADDRESSBOOK: 'Addressbook',
        //XMSG
        NO_ADDRESSES: 'You have no addresses stored!',
        //XBUT
        ADD_ADDRESS: 'Add Address',
        //XBUT
        CLOSE: 'Close',
        //XFLD
        COMPANY_NAME: 'Company',
        //XMSG
        CONFIRM_ADDRESS_REMOVAL: 'Are you sure you want to remove the address?',
        //XFLD
        FULL_NAME: 'Full Name',
        //XFLD
        CONTACT_PHONE: 'Phone',
        //XFLD
        DATE: 'Date',
        //XMSG
        NAME_REQUIRED: 'Name Required',
        //XFLD
        STREET: 'Street',
        //XFLD
        STREET_NUMBER: 'Street Number',
        //XTIT
        WELCOME: 'Welcome<span ng-if="account.firstName || account.lastName">,</span> <br/><strong>{{firstName}} {{middleName}} {{lastName}}</strong>',
        //XFLD
        ITEMS_IN_ORDER: 'Items In Order',
        //XFLD
        NOT_SET: 'Not Set',
        //XGRP
        ORDER_HISTORY: 'Order History',
        //XFLD
        ORDER_NUMBER: 'Order Number',
        //XFLD
        ORDER_STATUS: 'Order Status',
        //XFLD
        SHIPPING_DETAILS: 'SHIPPING DETAILS',
        //XBUT
        SAVE: 'Save',
        //XBUT
        UPDATE_PASSWORD: 'Update password',
        //XBUT
        CURRENT_PASSWORD: 'Current password',
        //XBUT
        NEW_PASSWORD: 'New password',
        //XMSG
        CONFIRM_NEW_PASSWORD: 'Confirm new password',
        //XMSG
        PASSWORDS_NO_MATCH: 'Passwords do not match',
        //XMSG
        WRONG_CURRENT_PASSWORD: 'Please provide correct current password!',
        //XMSG
        PASSWORD_TOO_SHORT: 'Password too short',
        //XFLD
        SHOW_ALL: 'Show all',
        //XFLD
        SHOW_LESS: 'Show less',


        //-------------------------------------------------
        // Login, password, signup
        //-------------------------------------------------

        //XBUT
        FORGOT_PW: 'Forgot your password?',
        //XFLD
        PASSWORD: 'Password',
        //XACT
        PASSWORD_MINCHAR: 'Min. 6 characters',
        //XBUT
        CONFIRM_PASSWORD: 'Confirm Password',
        //XFLD
        TOKEN: 'Token',
        //XBUT
        RESET_PASSWORD: 'Reset Password',
        //XGRP
        RESET_PW_TITLE: 'Reset Your Password',
        //XMSG
        RESET_PW_INSTRUCT: 'Please create a new password.',
        //XMSG
        FORGOT_PW_INSTRUCT: 'Please enter your account email address below.  An email will be sent to you with a link to reset your password.',
        //XMSG
        REQUEST_PW_EXPIRED: 'Reset Password Request Expired',
        //XMSG
        REQUEST_PW_EXPIRED_MSG: 'The request to reset your password has expired. Please enter your email to make a new request.',
        //XMSG
        CHECK_EMAIL:'Check Your Email',
        //XMSG
        CHECK_EMAIL_INSTRUCT: '...and follow the link to reset your password. The link will be valid for 24 hours.',
        //XMSG
        PASSWORD_REQUIRED: 'Password with 6 character minimum required.',
        //XMSG
        PASSWORDS_MUST_MATCH: 'Passwords must match.',
        //XMSG
        PW_SUCCESS: 'Success',
        //XMSG
        PW_CHANGED_MSG: 'Your password has been reset. You can now sign into your account.',
        //XMSG
        INVALID_TOKEN: 'This reset-password link is no longer valid.  Please request a new one.',
        //XMSG
        PW_CHANGE_FAILED: 'Update of password failed.',
        //XMSG
        RESET_PW_REPEAT: 'Request another reset-password link.',
        //XACT
        FIELD_REQUIRED: 'Field is required!',
        //XACT
        FIELD_TOO_SHORT: 'Field too short!',
        //XACT
        FIELDS_NOT_MATCHING: 'Fields not matching!',

        //XMSG
        SERVER_UNAVAILABLE: 'Server is unavailable, please try again later.',
        //XMSG
        INVALID_CREDENTIALS: 'You entered an invalid email or password.',
        //XMSG
        PASSWORD_INVALID: 'Password invalid - minimum of 6 characters required.',
        //XMSG
        ACCOUNT_LOCKED: 'Account has been locked due to excessive number of invalid login attempts. Please wait 5 minutes and try again.',
        //XMSG
        ACCOUNT_ALREADY_EXISTS: 'Email address already in use for existing account.',
        //XFLD
        FORGOT_PASSWORD: 'Forgot password?',
        //XMSG
        EMAIL_NOT_FOUND: 'There is no account associated with that email address.',
        //XACT
        ENTER_EMAIL: 'Enter Email',
        //XMSG
        ENTER_EXISTING_EMAIL: 'Enter the email address of an existing account',
        //XMSG
        LOGIN_FAILED: 'Login failed',

        //XFLD
        ACCOUNT_EMAIL: 'Account Email',


        //-------------------------------------------------
        // Dynamic Error Displays
        //-------------------------------------------------

        //XMSG
        ERROR_TITLE: 'Internal Error',
        //XMSG
        ERROR_MESSAGE: 'Oops! There\'s a problem.',
        //XMSG
        ERROR_TITLE_401: 'Unauthorized',
        //XMSG
        ERROR_MESSAGE_401: 'Oops! There\'s a problem. Your login credentials don\'t allow access to this page.',
        //XMSG
        ERROR_TITLE_404: 'Page not found',
        //XMSG
        ERROR_MESSAGE_404: 'Oops! There\'s a problem. This page doesn\'t exist.',
        //XMSG
        ERROR_REDIRECT: 'Here is a page to help you get back on track.',
        //XBUT
        ERROR_BUTTON_TEXT: 'HOMEPAGE',


        //-------------------------------------------------
        // Titles
        //-------------------------------------------------

        //XACT
        DR: 'Dr.',
        //XACT
        MR: 'Mr.',
        //XACT
        MRS: 'Mrs.',
        //XACT
        MS: 'Ms.',
        //XACT
        TITLE: 'Title',


        //-------------------------------------------------
        // Order Statuses
        //-------------------------------------------------

        //XSEL
        COMPLETED: 'Completed',
        //XSEL
        CONFIRMED: 'Confirmed',
        //XSEL
        CREATED: 'Created',
        //XSEL
        DECLINED: 'Declined',
        //XSEL
        SHIPPED: 'Shipped',


        //-------------------------------------------------
        // Order Details
        //-------------------------------------------------

        //XFLD
        CREDIT_CARD: 'Credit Card',
        ON: 'on',
        QUANTITY: 'Quantity',
        SHIPPED_BY_ON: '<span><b>{{carrier}} on {{shippedDate}}</b></span>',
        TRACKING_NUMBER: '<span>Tracking Number: {{trackingNumber}}</span>',


        //-------------------------------------------------
        // Search
        //-------------------------------------------------

        //XFLD
        FOUND_FOR: 'found for',
        //XACT
        SEARCH: 'Search',
        //XFLD
        SEARCH_RESULTS: 'Search results',
        //XFLD
        MOST_RELEVANT: 'Most Relevant',
        //XGRP
        RESULTS: 'Results',
        //XLNK
        SEE_ALL: 'See All',
        //XMSG
        SEARCH_UNAVAILABLE: 'Search is currently unavailable.',
        //XMSG
        NO_RESULTS_FOUND:'No results found.',

        //-------------------------------------------------
        // FOOTER
        //-------------------------------------------------

        //XFLD
        TERMS_AND_CONDITIONS: 'Terms & Conditions',
        //XFLD
        CONTACT_US: 'Contact Us',
        //XFLD
        SITE_MAP: 'Site Map',

    });