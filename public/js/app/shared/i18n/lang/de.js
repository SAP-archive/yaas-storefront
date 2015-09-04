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


        /*

        languages
        */
        en: 'Englisch',
        de: 'Deutsch',
        fr: 'Französisch',
        es: 'Spanisch',


        /*
            countries
        */
        CANADA: 'Canada',
        USA: 'USA',


        /*
         cart
         */
        BACK_TO_CHECKOUT: 'zurück zur Kasse',
        CHECKOUT: 'Kasse',
        CONTINUE_SHOPPING: 'Weiter Einkaufen',
        SHOP: 'Geschäft',
        EST_ORDER_TOTAL: 'Zwischensumme',
        FREE_SHIPPING: 'Kostenloser Versand',
        ITEM: 'Artikel',
        ITEM_PRICE: 'Artikel Preis',
        TOTAL_PRICE: 'Gesamtpreis',
        CART_UNAVAILABLE: 'Warenkorb momentan nicht zugänglich.  Bitte noch einmal anfordern.',
        CART_EMPTY: 'Keine Artikel im Korb',
        CART_ITEM_UPDATE_ERROR: 'Aktualizierung nicht erfolgreich. Bitte noch einmal anfordern.',
        ESTIMATE_TAX: 'Schätzung Steuerberatung',
        APPLY: 'Anwenden',
        ESTIMATE_TAX_ERROR: 'PLZ/Postleitzahl und Land Code Felder sind Pflichtfelder',
        //XMSG
        SELECT_A_COUNTRY: 'Wählen Sie ein Land',

        /*
         checkout
         */
        ADDRESS: 'Adresse',
        ADDRESS_LINE_1: 'Adresszeile 1',
        ADDRESS_LINE_2: 'Adresszeile 2',
        BILLING_ADDRESS: 'Rechnungsadresse',
        CITY: 'Stadt',
        PROVINCE: 'Provinz',
        CONTINUE: 'Weiter',
        COUNTRY: 'Land',
        CREDIT_CARD_NUMBER: 'Kreditkartennummer',
        CVC_NUMBER: 'CVC Nummer',
        DELIVERY_METHOD: 'Versandart',
        EMAIL: 'Email',
        EDIT: 'Bearbeiten',
        FIRST_NAME: 'Vorname',
        FREE_STANDARD_SHIPPING: 'Kostenloser Standardversand',
        FLAT_RATE_SHPPING: 'Pauschale',
        INVALID_EXPIRATION_DATE: 'Ungültiges Ablaufdatum',
        ITEMS: 'Artikel',
        LAST_NAME: 'Nachname',
        LAST_NAME_REQUIRED: 'Nachname Pflicht',
        METHOD: 'Verfahren',
        MIDDLE_NAME: 'Zweiter Vorname',
        MONTH: 'Monat',
        NAME: 'Name',
        NO_ITEMS_IN_CART: 'Es sind keine Artikel im Warenkorb.',
        OPTIONAL: 'optional',
        ORDER_DETAILS: 'Bestelldetails',
        ORDER_DATE: 'Bestelldatum',
        ORDER_PENDING: 'Einen Moment... Sie Ihre Bestellung',
        ORDER_TOTAL: 'Gesamtsumme',
        PAYMENT: 'Zahlung',
        PHONE_REQUIRED: 'Telefon Pflicht',
        PLACE_ORDER: 'Bestellung aufgeben',
        PLEASE_CORRECT_ERRORS: 'Bitte korrigieren sie alle Fehler.',
        PLEASE_ENTER_VALID_CC: 'Bitte geben Sie eine gültige Kreditkartennummer an.',
        PLEASE_ENTER_VALID_CODE: 'Bitte geben Sie einen gültigen Code an.',
        PLEASE_ENTER_VALID_EMAIL: 'Geben Sie eine gültige E-Mail an.',
        REQUIRED: 'Erforderlich',
        SAME_AS_BILLING_ADDRESS: 'entspricht Rechnungsadresse',
        SECURE_CHECKOUT: 'Sicher bestellen',
        SELECT_FROM_ADDRESS_BOOK: 'Vom Adressbuch Wählen',
        SHIPPING: 'Versand',
        SHIPPING_ADDRESS: 'Versandadresse',
        SIMPLE_3_STEP_CHECKOUT: 'Einfach bestellen in drei Schritten',
        SIMPLE_4_STEP_CHECKOUT: 'Einfach bestellen in vier Schritten',
        STATE: 'Bundesland',
        STEP_1_MY_DETAILS: '1. Meine Daten',
        STEP_2_SHIPPING_INFORMATION: '2. Versandinformationen',
        STEP_3_PAYMENT: '3. Zahlung',
        STEP_4_REVIEW_ORDER: '4. Bestätigung',
        SUBTOTAL: 'Zwischensumme',
        DISCOUNT: 'Rabatt',
        TAX: 'MwSt',
        TOTAL: 'gesamt',
        YEAR: 'Jahr',

        /*  addresses  */
        DEFAULT: 'Default',
        DISTRICT: 'Kreis',
        STREET_NAME: 'Straßenname mit Hausnummer',
        BUILDING_NAME: 'Gebäudename',
        ROOM_NUMBER: 'Zimmernummer',
        PREFECTURE: 'Präfektur',
        POSTAL_CODE: 'Postleitzahl',
        ZIP: 'PLZ',
        CITY_VILLAGE: 'Stadt / Dorf / Stadt Ward',
        SUBAREA: 'Untergebiet',
        FURTHER_SUBAREA: 'Weitere Untergebiet , Block # / Haus #',

        /*  coupons   */
        COUPON_APPLY: 'Anwenden',
        COUPON_APPLIED: 'Angewandt',
        COUPON_CODE: 'Gutscheincode hinzufügen',
        COUPON_ERROR: 'Coupon nicht gültig',
        COUPON_ERR_CURRENCY: 'Währungs ungültige Gutschein',
        COUPON_ERR_ANONYMOUS: 'Melden Sie sich an , um Gutscheincode zu nutzen',
        COUPON_ERR_UNAVAILABLE: 'Coupon nicht mehr verfügbar',
        COUPON_MINIMUM_NOT_MET: 'Aktuelle Bestellsumme nicht die erforderliche Mindest für diesen Gutschein treffen',
        COUPON_NOT_VALID: 'Coupon ungültig',

        /*
         confirmation
         */
        A_COPY_OF_YOUR_ORDER_DETAILS_HAS_BEEN_SENT_TO: 'Eine Bestellbestätigung wurde Ihnen zugesendet',
        ENJOY_YOUR_ITEMS: 'Viel Spass mit ihrer Bestellung!',
        FOR_YOUR_ORDER: 'für Ihre Bestellung!',
        ITEM_IN_YOUR_ORDER: 'Element in der Reihenfolge',
        ITEMS_IN_YOUR_ORDER: 'Artikel in Ihrer Bestellung',
        QUESTIONS: 'Wenn Sie irgendwelche Fragen haben, kontaktieren Sie uns unter',
        ORDER: 'Bestellung',
        RETURN_TO_SHOPPING: 'Weiter einkaufen',
        SUCCESS: 'Erfolg!',
        ACCOUNT_SUCCESS: 'Dein Konto wurde erfolgreich erstellt!',
        THANK_YOU: 'Vielen Dank',
        THANK_YOU_FOR_YOUR_ORDER: 'Vielen Dank Für Ihre Bestellung',
        THE_SHIPMENT_IS_SCHEDULED_TO_ARRIVE_AT_THE_FOLLOWING_LOCATION: 'Die Artikel werden an die folgenden Adresse gesendet',
        YOUR_ORDER_IS: 'Ihre Bestellung ist # ',
        ONE_MORE_STEP: 'Ein weiterer Schritt , um ein Konto zu erstellen',
        ONE_MORE_STEP_MESSAGE: 'für eine <strong>Schnellauswahl</strong> und <strong>einfachen Zugang</strong> zu Vorherige Bestellungen',
        SKU: 'SKU',

        /*
         navigation
         */
        PRODUCTS: 'Produkte',
        BACK_TO: 'Zurück zu',
        REGION: 'Region',

        /*
         product detail page
         */
        BUY: 'In den Warenkorb',
        ADD_TO_CART:'In den Warenkorb',
        PRODUCT_DESCRIPTION: 'Produkte Beschreibung',
        OUT_OF_STOCK: 'Ausverkauft',
        QTY: 'Menge',
        ERROR_ADDING_TO_CART: 'Artikel konnte nicht hinzugefügt werden. Bitte noch einmal probieren.',


        /*
         product list page
         */
        NEWEST: 'neueste',
        OF: 'Von',
        PRICE_HIGH_LOW: 'Preis absteigend',
        PRICE_LOW_HIGH: 'Preis aufsteigend',
        SORT_BY: 'Sortieren',
        VIEWING: 'Anzeige',
        PRODUCTS_FROM_TO: '<div>{{productsFrom}}-{{productsTo}} of {{total}}</div>',
        ALL_PRODUCTS: 'Alle Produkte',

        EMPTY_MSG: 'Demo Shop - Coming soon',
		LANGUAGES: 'Sprachen',
        SELECT_LANGUAGE: 'Wählen Sie eine Sprache',
        SIGN_OUT: 'Austragen',
        SIGN_IN: 'Anmelden',
        SIGN_IN_WITH_FACEBOOK: 'Mit Facebook Anmelden',
        LOG_IN_WITH_GOOGLE_PLUS: 'Mit Google+ Anmelden',
        MY_ACCOUNT: 'Mein Profil',
        CREATE_ACCOUNT: 'Konto erstellen',
        CONTINUE_AS_GUEST: 'Weiter als Gast',

        /*
            account page
         */
        ACCOUNT_DETAILS: 'Kontodaten',
        ADD: 'Hinzufügen',
        ADDRESSBOOK: 'Adressbuch',
        NO_ADDRESSES: 'Sie haben keine Adressen gespeichert!',
        ADD_ADDRESS: 'Adresse hinzufügen',
        CLOSE: 'Schließen',
        COMPANY_NAME: 'Name Der Firma',
        CONFIRM_ADDRESS_REMOVAL: 'Adresse löschen?',
        FULL_NAME: 'Vollständiger Name',
        CONTACT_PHONE: 'Telefon',
        CURRENCY: 'Währung',
        SELECT_CURRENCY: 'Wählen Sie eine Währung',
        DATE: 'Datum',
        LOCALE: 'Ort',
        NAME_REQUIRED: 'Name Erforderlich',
        STREET: 'Straße',
        SAVE: 'Speichern',
        WELCOME: 'Willkommen<span ng-if="account.firstName || account.lastName">,</span> <br/><strong>{{firstName}} {{middleName}} {{lastName}}</strong>',
        ITEM_IN_ORDER: 'translation needed',
        ITEMS_IN_ORDER: 'Postenzähler',
        NOT_SET: 'Unbekannt',
        ORDER_HISTORY: 'Bestellverlauf',
        ORDER_NUMBER: 'Bestellnummer',
        ORDER_STATUS: 'Auftragsstatus',
        SHIPPING_DETAILS: 'SHIPPING DETAILS',
        STREET_NUMBER: 'Nummer',
        UPDATE_PASSWORD: 'Passwort aktualisieren',
        CURRENT_PASSWORD: 'Aktuelles Passwort',
        NEW_PASSWORD: 'Neues Passwort',
        CONFIRM_NEW_PASSWORD: 'Neues Passwort bestätigen',
        PASSWORDS_NO_MATCH: 'Passwörter stimmen nicht überein',
        WRONG_CURRENT_PASSWORD: 'Aktuelles Passwort nicht korrekt.',
        PASSWORD_TOO_SHORT: 'Passwort zu kurz',
        SHOW_ALL: 'Alle anzeigen',
        SHOW_LESS: 'Weniger',

        /*
         login, password, signup
         */
        PASSWORD: 'Passwort',
        PASSWORD_MINCHAR: 'Min. 6 Zeichen',
        CONFIRM_PASSWORD: 'Passwort bestätigen',
        FORGOT_PW: 'Passwort vergessen?',
        RESET_PASSWORD: 'Neues Passwort',
        RESET_PW_TITLE: 'Passwort Zurücksetzen',
        RESET_PW_INSTRUCT: 'Bitte ein neues Passwort angeben.',
        TOKEN: 'Token',
        FORGOT_PW_INSTRUCT: 'Bitte Emailadresse angeben. Ein Link zum Zurücksetzen des Passworts wird Ihnen dann zugesendet.',
        REQUEST_PW_EXPIRED: 'Passwort Zurücksetzung Abgelaufen',
        REQUEST_PW_EXPIRED_MSG: 'Die Anfrage zum Zurücksetzen des Passworts ist abgelaufen.  Bitte Emailadresse angeben und noch einmal anfordern.',
        CHECK_EMAIL:'Überprüfen Sie Ihre Email',
        CHECK_EMAIL_INSTRUCT: '... und klicken auf den Link zum Zurücksetzen des Passworts.  Gültig für 24 Stunden.',
        PASSWORD_REQUIRED: 'Passwort mit mindestens 6 Zeichen erforderlich.',
        PASSWORDS_MUST_MATCH: 'Passwörter müssen übereinstimmen.',
        PW_SUCCESS: 'Erfolg',
        PW_CHANGED_MSG: 'Ihr Passwort wurde geändert. Sie können sich nun in Ihrem Konto anmelden.',
        INVALID_TOKEN: 'Dieser Link is nicht gültig. Bitte neu anfordern.',
        PW_CHANGE_FAILED: 'Passwort konnte nicht geändert werden.',
        RESET_PW_REPEAT: 'Link nochmal anfordern.',
        FIELD_REQUIRED: 'Angabe erforderlich',
        FIELD_TOO_SHORT: 'Feld zu kurz!',
        FIELDS_NOT_MATCHING: 'Angaben stimmen nicht überein!',

        SERVER_UNAVAILABLE: 'Server ist nicht verfügbar, bitte versuchen Sie es später erneut.',
        INVALID_CREDENTIALS: 'Anmeldeinformation ungültig.',
        PASSWORD_INVALID: 'Passwort ungültig - mindestens 6 Zeichen erforderlich.',
        ACCOUNT_LOCKED: 'Konto wegen hoher Anzahl von ungültigen Anmeldeversuchen gesperrt. Bitte warten Sie 5 Minuten.',
        ACCOUNT_ALREADY_EXISTS: 'Konto für diese Emailadresse wurde bereits erstellt.',
        FORGOT_PASSWORD: 'Passwort vergessen?',
        EMAIL_NOT_FOUND: 'Emailadresse nicht mit einem Konto verbunden.',
        ENTER_EMAIL: 'Emailadresse angeben',
        ENTER_EXISTING_EMAIL: 'Geben Sie die E-Mail-Adresse eines vorhandenen Kontos',
        LOGIN_FAILED: 'Anmeldung fehlgeschlagen',

        ACCOUNT_EMAIL: 'Konto Email',

        /*
            error display
        */
        ERROR_TITLE: 'Interner Fehler',
        ERROR_MESSAGE: 'Ups! Da ist ein Problem',
        ERROR_TITLE_401: 'Unbefugt',
        ERROR_MESSAGE_401: 'Ups! Da ist ein Problem. Ihre Anmeldedaten gewähren keinen Zugang zu dieser Seite',
        ERROR_TITLE_404: 'Seite nicht gefunden',
        ERROR_MESSAGE_404: 'Ups! Da ist ein Problem. Diese Seite ist nicht vorhanden',
        ERROR_REDIRECT: 'Hier ist eine Seite , damit Sie wieder auf die Strecke',
        ERROR_BUTTON_TEXT: 'HOMEPAGE',


        /*
         titles
    */
        DR: 'Dr.',
        MR: 'Herr',
        MRS: 'Frau',
        MS: 'Fräulein',
        TITLE: 'Anrede',


        /*
         order statuses
         */
        COMPLETED: 'Fertiggestellt',
        CONFIRMED: 'Bestätigt',
        CREATED: 'Erstellt',
        DECLINED: 'Zurückgegangen',
        SHIPPED: 'Ausgeliefert',

        /*
         Order Details
         */
        CREDIT_CARD: 'Kreditkarte',
        ON: 'an',
        QUANTITY: 'Menge',
        SHIPPED_BY_ON: 'Versendet durch: <span><b>{{carrier}} on {{shippedDate}}</b></span>',
        TRACKING_NUMBER: 'Verfolgungsnummer',


        /*
         Search
         */
        FOUND_FOR: 'gefunden',
        SEARCH: 'Suche',
        SEARCH_RESULTS: 'Suchergebnisse',
        MOST_RELEVANT: 'Wichtigsten',
        SEARCH_AGAIN: 'Neue Suche',
        RESULTS: 'Ergebnisse',
        SEE_ALL: 'Zeige Alle',
        SEARCH_UNAVAILABLE: 'Suche ist derzeit nicht verfügbar',
        NO_RESULTS_FOUND: 'Keine Ergebnisse gefunden',

        //-------------------------------------------------
        // FOOTER
        //-------------------------------------------------

        //XFLD
        TERMS_AND_CONDITIONS: 'Geschäftsbedingungen',
        //XFLD
        CONTACT_US: 'Kontaktieren Sie Uns',
        //XFLD
        SITE_MAP: 'Site Map',


    });
