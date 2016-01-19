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

/* jshint ignore:start */

angular.module('ds.i18n')
    .constant('TranslationsDE', {
        //XFLD
        "en": "Englisch",
        //XFLD
        "de": "Deutsch",
        //XFLD
        "fr": "Französisch",
        //XFLD
        "es": "Spanisch",

        //XFLD
        //-------------------------------------------------
        // Cart
        //-------------------------------------------------

        //XBUT
        "BACK_TO_CHECKOUT": "Zurück zur Kasse",
        //XBUT
        "CHECKOUT": "Kasse",
        //XBUT
        "CONTINUE_SHOPPING": "Einkauf fortsetzen",
        //XBUT
        "SHOP": "Einkaufen",
        //XFLD
        "EST_ORDER_TOTAL": "Geschätzte Bestellsumme",
        //XFLD
        "PREVIEW_ORDER": "Preview Order",
        //XFLD
        "PLEASE_CORRECT_MESSAGE_ERRORS": "Something went wrong, please try again",
        //XFLD
        "FREE_SHIPPING": "Versand und Rücksendung in den USA kostenlos",
        //XFLD
        "ITEM": "Position",
        //XFLD
        "ITEM_PRICE": "Positionspreis",
        //XFLD
        "TOTAL_PRICE": "Gesamtpreis",
        //XMSG
        "CART_UNAVAILABLE": "Der Warenkorb ist zurzeit nicht verfügbar. Versuchen Sie es noch einmal.",
        //XMSG
        "CART_EMPTY": "Ihr Warenkorb ist leer",
        //XMSG
        "CART_ITEM_UPDATE_ERROR": "Die Aktualisierung war nicht erfolgreich. Versuchen Sie es noch einmal.",
        //XFLD
        "ESTIMATE_TAX": "Steuern schätzen",
        //XFLD
        "APPLY": "Anwenden",
        //XFLD
        "ESTIMATE_TAX_ERROR": "Felder \"Postleitzahl\" und \"Ländercode\" sind erforderlich",
        //XMSG
        "ADDITIONAL_SHIPPING_OPTIONS": 'Additional shipping options are available in checkout.',
        //XMSG
        "SELECT_A_COUNTRY": "Land auswählen",

        //XFLD
        //-------------------------------------------------
        // Checkout
        //-------------------------------------------------

        //XFLD
        "ADDRESS": "Adresse",
        //XFLD
        "ADDRESS_LINE_1": "Adresszeile 1",
        //XFLD
        "ADDRESS_LINE_2": "Adresszeile 2",
        //XGRP
        "CANT_BE_SHIPPED": 'Items cannot be shipped to this location',
        //XGRP
        "BILLING_ADDRESS": "Rechnungsadresse",
        //XFLD
        "CITY": "Ort",
        //XFLD
        "PROVINCE": "Provinz/Bundesland",
        //XBUT
        "CONTINUE": "Weiter",
        //XFLD
        "COUNTRY": "Land",
        //XFLD
        "CREDIT_CARD_NUMBER": "Kreditkartennummer",
        //XFLD
        "CVC_NUMBER": "Prüfnummer",
        //XFLD
        "DELIVERY_METHOD": "Liefermethode",
        //XFLD
        "EMAIL": "E-Mail",
        //XBUT
        "EDIT": "Bearbeiten",
        //XFLD
        "FIRST_NAME": "Vorname",
        //XLST
        "FREE_STANDARD_SHIPPING": "Kostenloser Standardversand",
        //XLST
        "FLAT_RATE_SHPPING": "Pauschale",
        //XMSG
        "INVALID_EXPIRATION_DATE": "Ungültiges Ablaufdatum",
        //XFLD
        "ITEMS": "Positionen",
        //XFLD
        "LAST_NAME": "Nachname",
        //XFLD
        "LAST_NAME_REQUIRED": "Nachname erforderlich",
        //XFLD
        "METHOD": "Versandart",
        //XFLD
        "MIDDLE_NAME": "Zweiter Vorname",
        //XFLD
        "MONTH": "Monat",
        //XFLD
        "NAME": "Name",
        //XMSG
        "NO_ITEMS_IN_CART": "Ihr Warenkorb enthält keine Positionen.",
        //XACT
        "OPTIONAL": "Optional",
        //XGRP
        "ORDER_DETAILS": "Bestelldetails",
        //XFLD
        "ORDER_DATE": "Bestelldatum",
        //XMSG
        "ORDER_PENDING": "Einen Augenblick bitte... Ihre Bestellung wird ausgeführt",
        //XFLD
        "ORDER_TOTAL": "Bestellsumme",
        //XFLD
        "PAYMENT": "Zahlung",
        //XMSG
        "PHONE_REQUIRED": "Telefon erforderlich",
        //XBUT
        "PLACE_ORDER": "Bestellen",
        //XFLD
        "PLACED_AT": "Bestellt am",
        //XMSG
        "PLEASE_CORRECT_ERRORS": "Korrigieren Sie vor dem Bestellen die oben aufgeführten Fehler.",
        //XMSG
        "PLEASE_CORRECT_ERRORS_PREVIEW": 'Please correct the errors above before previewing your order.',
        //XMSG
        "PLEASE_CORRECT_ERRORS_ADDRESS": 'Please correct the address details before previewing your order.',
        //XMSG
        "PLEASE_ENTER_VALID_CC": "Geben Sie eine gültige Kreditkartennummer ein",
        //XMSG
        "PLEASE_ENTER_VALID_CODE": "Geben Sie einen gültigen Code ein",
        //XMSG
        "PLEASE_ENTER_VALID_EMAIL": "Geben Sie eine gültige E-Mail-Adresse im Format name@beispiel.com ein",
        //XACT
        "REQUIRED": "Erforderlich",
        //XCKL
        "SAME_AS_BILLING_ADDRESS": "Wie Rechnungsadresse",
        //XTIT
        "SECURE_CHECKOUT": "Sichere Kaufabwicklung",
        //XBUT
        "SELECT_FROM_ADDRESS_BOOK": "Aus Adressbuch auswählen",
        //XFLD
        "SHIPPING": "Versand",
        //XGRP
        "SHIPPING_ADDRESS": "Lieferadresse",
        //XGRP
        "SIMPLE_3_STEP_CHECKOUT": "Einfache Kaufabwicklung in 3 Schritten",
        //XGRP
        "SIMPLE_4_STEP_CHECKOUT": "Einfache Kaufabwicklung in 4 Schritten",
        //XFLD
        "STATE": "Bundesstaat",
        //XGRP
        "STEP_1_MY_DETAILS": "Schritt 1: Meine Details",
        //XGRP
        "STEP_2_SHIPPING_INFORMATION": "Schritt 2: Versandinformationen",
        //XGRP
        "STEP_3_PAYMENT": "Schritt 3: Zahlung",
        //XGRP
        "STEP_4_REVIEW_ORDER": "Schritt 4: Bestellung prüfen",
        //XFLD
        "SUBTOTAL": "Zwischensumme",
        //XFLD
        "DISCOUNT": "Rabatt",
        //XFLD
        "TAX": "Steuern",
        //XFLD
        "TOTAL": "Summe",
        //XFLD
        "YEAR": "Jahr",


        //XFLD
        //-------------------------------------------------
        // Addresses
        //-------------------------------------------------

        //XFLD
        "DEFAULT": "Standard",
        //XFLD
        "DISTRICT": "Stadtbezirk",
        //XFLD
        "STREET_NAME": "Straße/Hausnummer",
        //XFLD
        "BUILDING_NAME": "Gebäudename/-nummer",
        //XFLD
        "ROOM_NUMBER": "Zimmernummer",
        //XFLD
        "PREFECTURE": "Präfektur",
        //XFLD
        "POSTAL_CODE": "Postleitzahl",
        //XFLD
        "ZIP": "Postleitzahl",
        //XFLD
        "CITY_VILLAGE": "Stadt/Dorf/Stadtbezirk",
        //XFLD
        "SUBAREA": "Stadtteil",
        //XFLD
        "FURTHER_SUBAREA": "Stadtteilabschnitt, Blocknummer/Hausnummer",

        //XFLD
        //-------------------------------------------------
        // Coupons
        //-------------------------------------------------

        //XBUT
        "COUPON_APPLY": "Anwenden",
        //XFLD
        "COUPON_APPLIED": "Angewendet",
        //XLNK
        "COUPON_CODE": "Couponcode hinzufügen",
        //XMSG
        "COUPON_ERROR": "Coupon nicht gültig.",
        //XMSG
        "COUPON_ERR_CURRENCY": "Währung für Coupon ungültig",
        //XMSG
        "COUPON_ERR_ANONYMOUS": "Melden Sie sich an, um den Couponcode zu verwenden",
        //XMSG
        "COUPON_ERR_UNAVAILABLE": "Coupon nicht mehr verfügbar",
        //XMSG
        "COUPON_MINIMUM_NOT_MET": "Aktuelle Bestellsumme entspricht nicht der erforderlichen Mindestsumme für diesen Coupon",
        //XMSG
        "COUPON_NOT_VALID": "Coupon nicht gültig",


        //XFLD
        //-------------------------------------------------
        // Confirmation
        //-------------------------------------------------

        //XMSG
        "A_COPY_OF_YOUR_ORDER_DETAILS_HAS_BEEN_SENT_TO": "<p class=\"orderEmailedTo\">Eine Kopie Ihrer Bestelldetails wurde gesendet an <strong>{{emailAddress}}</strong></p>",
        //XMSG
        "ENJOY_YOUR_ITEMS": "Viel Freude an Ihrem Einkauf!",
        //XMSG
        "FOR_YOUR_ORDER": "für Ihre Bestellung!",
        //XMSG
        "ITEM_IN_YOUR_ORDER": "Position in Ihrer Bestellung",
        //XMSG
        "ITEMS_IN_YOUR_ORDER": "Positionen in Ihrer Bestellung",
        //XMSG
        "QUESTIONS": "<p class=\"support-box\">Bei Fragen kontaktieren Sie uns unter <strong>{{contactInfo}}</strong>.</p>",
        //XFLD
        "ORDER": "Bestellung",
        //XBUT
        "RETURN_TO_SHOPPING": "Zurück zum Einkauf",
        //XMSG
        "SUCCESS": "Vorgang war erfolgreich!",
        //XMSG
        "ACCOUNT_SUCCESS": "Ihr Konto wurde erfolgreich angelegt.",
        //XMSG
        "THANK_YOU": "Vielen Dank",
        //XMSG
        "THANK_YOU_FOR_YOUR_ORDER": "Vielen Dank</br>für Ihre Bestellung!",
        //XMSG
        "THE_SHIPMENT_IS_SCHEDULED_TO_ARRIVE_AT_THE_FOLLOWING_LOCATION": "Die Bestellung wird geliefert an",
        //XMSG
        "YOUR_ORDER_IS": "Ihre Bestellnummer lautet ",
        //XMSG
        "ONE_MORE_STEP": "Nur ein weiterer Schritt zum Anlegen eines Kontos mit <strong>schneller Kaufabwicklung</strong> und einem <strong>einfachen Zugriff</strong> auf frühere Bestellungen",
        //XFLD
        "SKU": "Lagermengeneinheit",
        //XMSG
        "YOUR_CHECKOUT_HAS_BEEN_ACCEPTED_ORDER_NOT_CREATED": "Ihre Kaufabwicklung wurde angenommen, aber die Bestellung wurde nicht angelegt. Verwenden Sie zur Verfolgung folgende Kaufabwicklungs-ID-Nummer: ",
        //XMSG
        "YOUR_ORDER_WILL_BE_CREATED": "Ihre Bestellung wird so schnell wie möglich angelegt.",


        //XFLD
        //-------------------------------------------------
        // Navigation
        //-------------------------------------------------

        //XFLD
        "PRODUCTS": "Produkte",
        //XBUT
        "BACK_TO": "Zurück zu",
        //XFLD
        "REGION": "Region",


        //XFLD
        //-------------------------------------------------
        // Product Detail Page
        //-------------------------------------------------


        //XFLD
        "SHIPPING_INFORMATION": "Shipping information",
        //XFLD
        "SHIPPING_ZONE": "Shipping Zone",
        //XFLD
        "STANDARD_SHIPPING": "Standard Shipping",
        //XFLD
        "SHIPPING_RATE": "Shipping Rate",
        //XFLD
        "ZONE": "Zone",

        //XBUT
        "BUY": "Kaufen",
        //XBUT
        "ADD_TO_CART": "In den Warenkorb",
        //XTIT
        "PRODUCT_DESCRIPTION": "Produktbeschreibung",
        //XTIT
        "PRODUCT_DETAILS": "Produktdetails",
        //XBUT
        "OUT_OF_STOCK": "nicht vorrätig",
        //XFLD
        "QTY": "Menge",
        //XMSG
        "INCLUDES": 'Includes',
        //XMSG
        "NO_LIMIT": 'No Limit',
        //XMSG
        "DESTINATION_COUNTRY": 'Destination country(s)',
        //XMSG
        "ERROR_ADDING_TO_CART": "Hinzufügen zum Warenkorb war nicht erfolgreich.  Versuchen Sie es noch einmal.",

        //XFLD
        //-------------------------------------------------
        // Product List Page
        //-------------------------------------------------

        //XLST
        "NEWEST": "neueste",
        //XFLD
        "OF": "von",
        //XLST
        "PRICE_HIGH_LOW": "Preis (höchster - niedrigster)",
        //XLST
        "PRICE_LOW_HIGH": "Preis (niedrigster - höchster)",
        //XFLD
        "SORT_BY": "Sortieren nach",
        //XFLD
        "VIEWING": "Anzeigen",
        //XFLD
        "PRODUCTS_FROM_TO": "<div>{{productsFrom}}-{{productsTo}} von {{total}}</div>",
        //XFLD
        "ALL_PRODUCTS": "Alle Produkte",
        //XTIT
        "EMPTY_MSG": "Demo-Filiale - demnächst verfügbar",
        //XFLD
        "LANGUAGES": "Sprachen",
        //XFLD
        "SELECT_LANGUAGE": "Sprache auswählen",
        //XBUT
        "SIGN_OUT": "Abmelden",
        //XBUT
        "SIGN_IN": "Anmelden",
        //XBUT
        "SIGN_IN_WITH_FACEBOOK": "Über Facebook anmelden",
        //XBUT
        "LOG_IN_WITH_GOOGLE_PLUS": "Über Google+ anmelden",
        //XBUT
        "MY_ACCOUNT": "Mein Konto",
        //XBUT
        "CREATE_ACCOUNT": "Konto anlegen",
        //XBUT
        "CONTINUE_AS_GUEST": "Weiter als Gast",


        //XFLD
        //-------------------------------------------------
        // Account Page
        //-------------------------------------------------

        //XFLD
        "UPDATE_ACCOUNT_DETAILS": "Kontodetails aktualisieren",
        //TIT
        "UPDATE_EMAIL": "E-Mail aktualisieren",
        //XBUT
        "ADD": "Hinzufügen",
        //XFLD
        "REGION_PREFERENCES": "Regionspräferenzen",
        //XFLD
        "NEW_EMAIL": "Neue E-Mail",
        //XGRP
        "ADDRESSBOOK": "Adressbuch",
        //XMSG
        "NO_ADDRESSES": "Sie haben keine Adressen gespeichert.",
        //XMSG
        "FAIL_ADDRESSES": "Die Adressen sind nicht verfügbar. Versuchen Sie es später noch einmal.",
        //XBUT
        "ADD_ADDRESS": "Adresse hinzufügen",
        //XBUT
        "CLOSE": "Schließen",
        //XFLD
        "COMPANY_NAME": "Unternehmen",
        //XTIT
        "CONFIRM_DELETE_ADDRESS_TITLE": "Delete Address",
        //XMSG
        "CONFIRM_ADDRESS_REMOVAL": "Are you sure you want to delete this address?",
        //XFLD
        "FULL_NAME": "Vollständiger Name",
        //XFLD
        "CONTACT_PHONE": "Telefon",
        //XFLD
        "FAIL_CUSTOMER_DETAILS": "Die Kundendetails sind nicht verfügbar. Versuchen Sie es später noch einmal.",
        //XFLD
        "DATE": "Datum",
        //XMSG
        "NAME_REQUIRED": "Name erforderlich",
        //XFLD
        "STREET": "Straße",
        //XFLD
        "STREET_NUMBER": "Hausnummer",
        //XTIT
        "WELCOME": "Willkommen",
        //XFLD
        "NOT_SET": "Nicht festgelegt",
        //XGRP
        "ORDER_HISTORY": "Bestellhistorie",
        //XFLD
        "ORDER_NUMBER": "Bestellnummer",
        //XFLD
        "ORDER_STATUS": "Bestellstatus",
        //XFLD
        "FAIL_ORDER": "Die Bestellungen sind nicht verfügbar. Versuchen Sie es später noch einmal.",
        //XFLD
        "NO_ORDERS": "Sie haben keine Bestellungen gespeichert",
        //XSEL
        "ORDER_ITEM_COUNT": "{{number}} Position",
        //XSEL
        "ORDER_ITEMS_COUNT": "{{number}} Positionen",

        //XFLD
        "SHIPPING_DETAILS": "VERSANDDETAILS",
        //XBUT
        "SAVE": "Sichern",
        //XBUT
        "UPDATE_PASSWORD": "Kennwort aktualisieren",
        //XBUT
        "CURRENT_PASSWORD": "Aktuelles Kennwort",
        //XBUT
        "NEW_PASSWORD": "Neues Kennwort",
        //XMSG
        "CONFIRM_NEW_PASSWORD": "Neues Kennwort bestätigen",
        //XMSG
        "PASSWORDS_NO_MATCH": "Kennwörter stimmen nicht überein",
        //XMSG
        "WRONG_CURRENT_PASSWORD": "Geben Sie ein korrektes aktuelles Kennwort an.",
        //XMSG
        "PASSWORD_TOO_SHORT": "Kennwort zu kurz",
        //XFLD
        "SHOW_ALL": "Alles anzeigen",
        //XFLD
        "SHOW_LESS": "Weniger anzeigen",
        //XFLD
        "ITEMS_IN_ORDER": "Positionen in Bestellung",
        //XMSG
        "SAVE_ADDRESS_ERROR": "Es ist ein Fehler aufgetreten; die Aktualisierungen wurden nicht gesichert. Sichern Sie die Aktualisierungen.",
        //XMSG
        "REMOVE_ADDRESS_ERROR": "Löschen der Adresse fehlgeschlagen. Versuchen Sie es noch einmal.",
        //XMSG
        "UPDATE_DEFAULT_ADDRESS_ERROR": "Aktualisieren der Standardadresse fehlgeschlagen. Versuchen Sie es noch einmal.",


        //XFLD
        //-------------------------------------------------
        // Login, password, signup
        //-------------------------------------------------

        //XBUT
        "FORGOT_PW": "Kennwort vergessen?",
        //XFLD
        "PASSWORD": "Kennwort",
        //XACT
        "PASSWORD_MINCHAR": "Mindestens 6 Zeichen",
        //XBUT
        "CONFIRM_PASSWORD": "Kennwort bestätigen",
        //XFLD
        "TOKEN": "Token",
        //XBUT
        "RESET_PASSWORD": "Kennwort zurücksetzen",
        //XGRP
        "RESET_PW_TITLE": "Kennwort zurücksetzen",
        //XMSG
        "RESET_PW_INSTRUCT": "Legen Sie ein neues Kennwort an.",
        //XMSG
        "FORGOT_PW_INSTRUCT": "Geben Sie unten die E-Mail-Adresse Ihres Kontos an.  Sie erhalten eine E-Mail mit einem Link zum Zurücksetzen Ihres Kennworts.",
        //XMSG
        "REQUEST_PW_EXPIRED": "Anforderung zum Zurücksetzen des Kennworts abgelaufen",
        //XMSG
        "REQUEST_PW_EXPIRED_MSG": "Die Anforderung zum Zurücksetzen Ihres Kennworts ist abgelaufen. Geben Sie Ihre E-Mail ein, um eine neue Anforderung zu übermitteln.",
        //XMSG
        "CHECK_EMAIL": "Überprüfen Sie Ihre E-Mail",
        //XMSG
        "CHECK_EMAIL_INSTRUCT": "... und wählen Sie den Link, um Ihr Kennwort zurückzusetzen. Der Link ist 24 Stunden gültig.",
        //XMSG
        "PASSWORD_REQUIRED": "Das Kennwort muss mindestens 6 Zeichen haben.",
        //XMSG
        "PASSWORDS_MUST_MATCH": "Die Kennwörter müssen übereinstimmen.",
        //XMSG
        "PW_SUCCESS": "Erfolgreich",
        //XMSG
        "PW_CHANGED_MSG": "Ihr Kennwort wurde zurückgesetzt. Sie können sich nun an Ihrem Konto anmelden.",
        //XMSG
        "INVALID_TOKEN": "Der Link zum Zurücksetzen des Kennworts ist nicht mehr gültig. Fordern Sie einen neuen Link an.",
        //XMSG
        "PW_CHANGE_FAILED": "Aktualisierung des Kennworts fehlgeschlagen.",
        //XMSG
        "RESET_PW_REPEAT": "Fordern Sie erneut einen Link zum Zurücksetzen des Kennworts an.",
        //XACT
        "FIELD_REQUIRED": "Das Feld ist erforderlich.",
        //XACT
        "FIELD_TOO_SHORT": "Das Feld ist zu kurz.",
        //XACT
        "FIELDS_NOT_MATCHING": "Die Felder stimmen nicht überein.",

        //XMSG
        "SERVER_UNAVAILABLE": "Der Server ist nicht verfügbar, versuchen Sie es später erneut.",
        //XMSG
        "INVALID_CREDENTIALS": "Sie haben eine ungültige E-Mail-Adresse oder ein ungültiges Kennwort eingegeben.",
        //XMSG
        "PASSWORD_INVALID": "Kennwort ungültig - mindestens 6 Zeichen erforderlich.",
        //XMSG
        "ACCOUNT_LOCKED": "Das Konto wurde gesperrt, weil die Anzahl der ungültigen Anmeldeversuche überschritten wurde. Versuchen Sie es nach 5 Minuten noch einmal.",
        //XMSG
        "ACCOUNT_ALREADY_EXISTS": "E-Mail-Adresse wird für das vorhandene Konto bereits verwendet.",
        //XFLD
        "FORGOT_PASSWORD": "Kennwort vergessen?",
        //XMSG
        "EMAIL_NOT_FOUND": "Dieser E-Mail-Adresse ist kein Konto zugeordnet.",
        //XACT
        "ENTER_EMAIL": "E-Mail-Adresse eingeben",
        //XMSG
        "ENTER_EXISTING_EMAIL": "Geben Sie die E-Mail-Adresse eines vorhandenen Kontos ein",
        //XMSG
        "LOGIN_FAILED": "Anmeldung fehlgeschlagen",

        //XFLD
        "ACCOUNT_EMAIL": "E-Mail-Adresse für Konto",


        //XFLD
        //-------------------------------------------------
        // Dynamic Error Displays
        //-------------------------------------------------

        //XMSG
        "ERROR_TITLE": "Interner Fehler",
        //XMSG
        "ERROR_MESSAGE": "Hoppla, es ist ein Problem aufgetreten.",
        //XMSG
        "ERROR_TITLE_401": "Keine Berechtigung",
        //XMSG
        "ERROR_MESSAGE_401": "Hoppla, es ist ein Problem aufgetreten. Ihre Anmeldedaten lassen keinen Zugriff auf diese Seite zu.",
        //XMSG
        "ERROR_TITLE_404": "Seite nicht gefunden",
        //XMSG
        "ERROR_MESSAGE_404": "Hoppla, es ist ein Problem aufgetreten. Diese Seite ist nicht vorhanden.",
        //XMSG
        "ERROR_REDIRECT": "Hier ist eine Seite, die Ihnen weiterhilft.",
        //XBUT
        "ERROR_BUTTON_TEXT": "STARTSEITE",


        //XFLD
        //-------------------------------------------------
        // Titles
        //-------------------------------------------------

        //XACT
        "DR": "Dr.",
        //XACT
        "MR": "Herr",
        //XACT
        "MRS": "Frau",
        //XACT
        "MS": "Frau",
        //XACT
        "TITLE": "Anrede",


        //XFLD
        //-------------------------------------------------
        // Order Statuses
        //-------------------------------------------------

        //XSEL
        "COMPLETED": "Abgeschlossen",
        //XSEL
        "CONFIRMED": "Bestätigt",
        //XSEL
        "CREATED": "Angelegt",
        //XSEL
        "DECLINED": "Abgelehnt",
        //XSEL
        "SHIPPED": "Versendet",


        //XFLD
        //-------------------------------------------------
        // Order Details
        //-------------------------------------------------

        //XFLD
        "CREDIT_CARD": "Kreditkarte",
        //XFLD
        "ON": "am",
        //XFLD
        "QUANTITY": "Menge",
        //XFLD
        "SHIPPED_BY_ON": "Geliefert von: <span><b>{{carrier}} am {{shippedDate}}</b></span>",
        //XFLD
        "TRACKING_NUMBER": "<span>Verfolgungsnummer: {{trackingNumber}}</span>",


        //XFLD
        //-------------------------------------------------
        // Search
        //-------------------------------------------------

        //XFLD
        "FOUND_FOR": "<strong>{{total}}</strong> gefunden für <strong>{{searchString}}</strong>",
        //XACT
        "SEARCH": "Suchen",
        //XFLD
        "SEARCH_RESULTS": "Suchergebnisse",
        //XFLD
        "MOST_RELEVANT": "Relevanteste",
        //XGRP
        "RESULTS": "Ergebnisse",
        //XLNK
        "SEE_ALL": "Alle anzeigen",
        //XMSG
        "SEARCH_UNAVAILABLE": "Die Suche ist zurzeit nicht verfügbar.",
        //XMSG
        "NO_RESULTS_FOUND": "Keine Ergebnisse gefunden.",
        //XFLD
        "IN":"im",

        //XFLD
        //-------------------------------------------------
        // FOOTER
        //-------------------------------------------------

        //XFLD
        "TERMS_AND_CONDITIONS": "Geschäftsbedingungen",
        //XFLD
        "CONTACT_US": "Kontakt",
        //XFLD
        "SITE_MAP": "Sitemap"

    });

/* jshint ignore:end */
