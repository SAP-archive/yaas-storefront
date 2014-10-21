'use strict';

angular.module('ds.i18n')
	.constant('TranslationsEN', {

        /*
            cart
         */
        CHECKOUT: 'Checkout',
        CONTINUE_SHOPPING: 'Continue shopping',
        EST_ORDER_TOTAL: 'Est. order total',
        FREE_SHIPPING: 'Free Shipping and Returns in the US',
        ITEM: 'Item',
        ITEM_PRICE: 'Item Price',
        TOTAL_PRICE: 'Total Price',
        CART_UNAVAILABLE: 'The cart is currently unavailable. Please try again.',
        CART_EMPTY: 'Your cart is empty',
        CART_ITEM_UPDATE_ERROR: 'The update was not successful. Please try again.',

        /*
            checkout
         */
        ADDRESS: 'Address',
        ADDRESS_LINE_1: 'Address Line 1',
        ADDRESS_LINE_2: 'Address Line 2',
        BILLING_ADDRESS: 'Billing Address',
        CITY: 'City',
        CONTINUE: 'Continue',
        COUNTRY: 'Country',
        CREDIT_CARD_NUMBER: 'Credit Card Number',
        CVC_NUMBER: 'CVC Number',
        DELIVERY_METHOD: 'Delivery Method',
        EMAIL: 'Email',
        FIRST_NAME: 'First Name',
        FREE_STANDARD_SHIPPING: 'Free Standard Shipping',
        FLAT_RATE_SHPPING: 'Flat Rate',
        INVALID_EXPIRATION_DATE: 'Invalid Expiration Date',
        ITEMS: 'Items',
        LAST_NAME: 'Last Name',
        LAST_NAME_REQUIRED: 'Last Name Required',
        METHOD: 'Method',
        MIDDLE_NAME: 'Middle Name',
        MONTH: 'Month',
        NAME: 'Name',
        OPTIONAL: 'Optional',
        ORDER_DETAILS: 'Order Details',
        ORDER_PENDING: 'One moment... Placing your order',
        ORDER_TOTAL: 'Order Total',
        PAYMENT: 'Payment',
        PHONE_REQUIRED: 'Phone Required',
        PLACE_ORDER: 'Place Order',
        PLEASE_CORRECT_ERRORS: 'Please correct the errors above before placing your order.',
        PLEASE_ENTER_VALID_CC: 'Please enter a valid credit card number',
        PLEASE_ENTER_VALID_CODE: 'Please enter a valid code',
        PLEASE_ENTER_VALID_EMAIL: 'Please enter a valid email in the format name@example.com',
        REQUIRED: 'Required',
        SAME_AS_BILLING_ADDRESS: 'Same As Billing Address',
        SECURE_CHECKOUT: 'Secure Checkout',
        SHIPPING: 'Shipping',
        SHIPPING_ADDRESS: 'Shipping Address',
        SIMPLE_3_STEP_CHECKOUT: 'Simple 3 Step Checkout',
        SIMPLE_4_STEP_CHECKOUT: 'Simple 4 Step Checkout',
        STATE: 'State',
        STEP_1_MY_DETAILS: 'Step 1. My Details',
        STEP_2_SHIPPING_INFORMATION: 'Step 2. Shipping Information',
        STEP_3_PAYMENT: 'Step 3. Payment',
        STEP_4_REVIEW_AND_PAYMENT: 'Step 4. Review and Payment',
        SUBTOTAL: 'Subtotal',
        TAX: 'Tax',
        TOTAL: 'Total',
        YEAR: 'Year',
        ZIP: 'Zip Code',


        /*
            confirmation
         */
        A_COPY_OF_YOUR_ORDER_DETAILS_HAS_BEEN_SENT_TO: 'A copy of your order details has been sent to',
        ENJOY_YOUR_ITEMS: 'Enjoy your items!',
        FOR_YOUR_ORDER: 'for your order!',
        ITEMS_IN_YOUR_ORDER: 'Items in your order',
        QUESTIONS: 'If you have any questions, contact us at',
        ORDER: 'Order',
        RETURN_TO_SHOPPING: 'Return to shopping',
        SUCCESS: 'Success!',
        THANK_YOU: 'Thank you',
        THE_SHIPMENT_IS_SCHEDULED_TO_ARRIVE_AT_THE_FOLLOWING_LOCATION: 'The order will be shipped to',
        YOUR_ORDER_IS: 'Your order # is ',
        SKU: 'SKU',

        /*
            navigation
         */
        PRODUCTS: 'Products',

        /*
            product detail page
         */
        BUY: 'Buy',
        DESCRIPTION: 'Description',
        OUT_OF_STOCK: 'out of stock',
        QTY: 'Qty',
        ERROR_ADDING_TO_CART: 'Add to Cart was not successful.  Please try again.',

        /*
            product list page
         */
        NEWEST: 'newest',
        OF: 'of',
        PRICE_HIGH_LOW: 'price high - low',
        PRICE_LOW_HIGH: 'price low - high',
        SORT_BY: 'Sort by',
        VIEWING: 'Viewing',
        ALL_PRODUCTS: 'All Products',


		EMPTY_MSG: 'Demo Store - Coming Soon',
		LANGUAGES: 'Languages',
		en: 'English',
		de: 'German',
        SIGN_OUT: 'Sign Out',
        SIGN_IN: 'Sign In',
        MY_ACCOUNT: 'My Account',
        CREATE_ACCOUNT: 'Create Account',
        CONTINUE_AS_GUEST: 'Continue as our guest',

        /*
            account page
         */
        ACCOUNT_DETAILS: 'Account details',
        ADD: 'Add',
        ADDRESSBOOK: 'Addressbook',
        NO_ADDRESSES: 'You have no addresses stored!',
        ADD_ADDRESS: 'Add Address',
        CLOSE: 'Close',
        CONTACT_NAME: 'Contact Name',
        CONTACT_PHONE: 'Contact Phone',
        CURRENCY: 'Currency',
        DATE: 'Date',
        LOCALE: 'Locale',
        NAME_REQUIRED: 'Name Required',
        STREET: 'Street',
        STREET_NUMBER: 'Street Number',
        WELCOME: 'Welcome',
        ITEMS_IN_ORDER: 'Items In Order',
        ORDER_HISTORY: 'Order History',
        ORDER_NUMBER: 'Order Number',
        ORDER_STATUS: 'Order Status',
        SAVE: 'Save',
        UPDATE_PASSWORD: 'Update password',
        CURRENT_PASSWORD: 'Current password',
        NEW_PASSWORD: 'New password',
        CONFIRM_NEW_PASSWORD: 'Confirm new password',
        PASSWORDS_NO_MATCH: 'Passwords do not match',
        WRONG_CURRENT_PASSWORD: 'Please provide correct current password!',
        PASSWORD_TOO_SHORT: 'Password too short',
        SHOW_ALL: 'Show all',

        /*
           login, password, signup
         */
        FORGOT_PW: 'Forgot your password?',
        PASSWORD: 'Password',
        CONFIRM_PASSWORD: 'Confirm Password',
        TOKEN: 'Token',
        RESET_PASSWORD: 'Reset Password',
        RESET_PW_TITLE: 'Reset Your Password',
        RESET_PW_INSTRUCT: 'Please create a new password.',
        FORGOT_PW_INSTRUCT: 'Please enter your account email address below.  An email will be sent to you with a link to reset your password.',
        REQUEST_PW_EXPIRED: 'Reset Password Request Expired',
        REQUEST_PW_EXPIRED_MSG: 'The request to reset your password has expired. Please enter your email to make a new request.',
        CHECK_EMAIL:'Check Your Email',
        CHECK_EMAIL_INSTRUCT: '...and follow the link to reset your password. The link will be valid for 24 hours.',
        PASSWORD_REQUIRED: 'Password with 6 character minimum required.',
        PASSWORDS_MUST_MATCH: 'Passwords must match.',
        PW_SUCCESS: 'Success',
        PW_CHANGED_MSG: 'Your password has been reset. You can now sign into your account.',
        INVALID_TOKEN: 'This reset-password link is no longer valid.  Please request a new one.',
        PW_CHANGE_FAILED: 'Update of password failed.',
        RESET_PW_REPEAT: 'Request another reset-password link.',
        FIELD_REQUIRED: 'Field is required!',
        FIELD_TOO_SHORT: 'Field too short!',
        FIELDS_NOT_MATCHING: 'Fields not matching!',

        INVALID_CREDENTIALS: 'You entered an invalid email or password.',
        PASSWORD_INVALID: 'Password invalid - minimum of 6 characters required.',
        ACCOUNT_LOCKED: 'Account has been locked due to excessive number of invalid login attempts. Please wait 5 minutes and try again.',
        ACCOUNT_ALREADY_EXISTS: 'Email address already in use for existing account.',
        FORGOT_PASSWORD: 'Forgot password?',
        EMAIL_NOT_FOUND: 'There is no account associated with that email address.',
        ENTER_EMAIL: 'Enter Email',

        /*
            titles
         */
        DR: 'Dr.',
        MR: 'Mr.',
        MRS: 'Mrs.',
        MS: 'Ms.',
        TITLE: 'Title',

        /*
         order statuses
         */
        COMPLETED: 'Completed',
        CONFIRMED: 'Confirmed',
        CREATED: 'Created',
        DECLINED: 'Declined',
        SHIPPED: 'Shipped'
	});