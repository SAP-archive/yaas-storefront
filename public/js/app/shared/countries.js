/**
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

'use strict';

angular.module('ds.shared')
    .constant('Countries', {

        world: {
            countries: [{ name: 'Afghanistan', id: 'AF' }, { name: 'Aland Islands', id: 'AX' },{ name: 'Albania', id: 'AL' }, { name: 'Algeria', id: 'DZ' },
                { name: 'American Samoa', id: 'AS' },{ name: 'Andorra', id: 'AD' }, { name: 'Angola', id: 'AO' }, { name: 'Anguilla', id: 'AI' },
                { name: 'Antarctica', id: 'AQ' }, { name: 'Antigua and Barbuda', id: 'AG' }, { name: 'Argentina', id: 'AR' },
                { name: 'Armenia', id: 'AM' }, { name: 'Aruba', id: 'AW' }, { name: 'Australia', id: 'AU' }, { name: 'Austria', id: 'AT' },
                { name: 'Azerbaijan', id: 'AZ' }, { name: 'Bahamas', id: 'BS' }, { name: 'Bahrain', id: 'BH' },
                { name: 'Bangladesh', id: 'BD' }, { name: 'Barbados', id: 'BB' }, { name: 'Belarus', id: 'BY' },
                { name: 'Belgium', id: 'BE' }, { name: 'Belize', id: 'BZ' }, { name: 'Benin', id: 'BJ' }, { name: 'Bermuda', id: 'BM' },
                { name: 'Bhutan', id: 'BT' }, { name: 'Bolivia, Plurinational State of', id: 'BO' }, { name: 'Bonaire, Sint Eustatius and Saba', id: 'BQ' },
                { name: 'Bosnia and Herzegovina', id: 'BA' }, { name: 'Botswana', id: 'BW' }, { name: 'Bouvet Island', id: 'BV' },
                { name: 'Brazil', id: 'BR' }, { name: 'British Indian Ocean Territory', id: 'IO' }, { name: 'Brunei Darussalam', id: 'BN' },
                { name: 'Bulgaria', id: 'BG' }, { name: 'Burkina Faso', id: 'BF' }, { name: 'Burundi', id: 'BI' }, { name: 'Cambodia', id: 'KH' },
                { name: 'Cameroon', id: 'CM' }, { name: 'Canada', id: 'CA' }, { name: 'Cape Verde', id: 'CV' }, { name: 'Cayman Islands', id: 'KY' },
                { name: 'Central African Republic', id: 'CF' }, { name: 'Chad', id: 'TD' }, { name: 'Chile', id: 'CL' }, { name: 'China', id: 'CN' },
                { name: 'Christmas Island', id: 'CX' }, { name: 'Cocos (Keeling) Islands', id: 'CC' }, { name: 'Colombia', id: 'CO' },
                { name: 'Comoros', id: 'KM' }, { name: 'Congo', id: 'CG' }, { name: 'Congo, the Democratic Republic of the', id: 'CD' },
                { name: 'Cook Islands', id: 'CK' }, { name: 'Costa Rica', id: 'CR' }, { name: 'Cote d\'Ivoire', id: 'CI' }, { name: 'Croatia', id: 'HR' },
                { name: 'Cuba', id: 'CU' }, { name: 'Curacao', id: 'CW' }, { name: 'Cyprus', id: 'CY' }, { name: 'Czech Republic', id: 'CZ' },
                { name: 'Denmark', id: 'DK' }, { name: 'Djibouti', id: 'DJ' }, { name: 'Dominica', id: 'DM' }, { name: 'Dominican Republic', id: 'DO' },
                { name: 'Ecuador', id: 'EC' }, { name: 'Egypt', id: 'EG' }, { name: 'El Salvador', id: 'SV' }, { name: 'Equatorial Guinea', id: 'GQ' },
                { name: 'Eritrea', id: 'ER' }, { name: 'Estonia', id: 'EE' }, { name: 'Ethiopia', id: 'ET' }, { name: 'Falkland Islands (Malvinas)', id: 'FK' },
                { name: 'Faroe Islands', id: 'FO' }, { name: 'Fiji', id: 'FJ' }, { name: 'Finland', id: 'FI' }, { name: 'France', id: 'FR' },
                { name: 'French Guiana', id: 'GF' }, { name: 'French Polynesia', id: 'PF' }, { name: 'French Southern Territories', id: 'TF' },
                { name: 'Gabon', id: 'GA' }, { name: 'Gambia', id: 'GM' }, { name: 'Georgia', id: 'GE' }, { name: 'Germany', id: 'DE' },
                { name: 'Ghana', id: 'GH' }, { name: 'Gibraltar', id: 'GI' }, { name: 'Greece', id: 'GR' }, { name: 'Greenland', id: 'GL' },
                { name: 'Grenada', id: 'GD' }, { name: 'Guadeloupe', id: 'GP' }, { name: 'Guam', id: 'GU' }, { name: 'Guatemala', id: 'GT' },
                { name: 'Guernsey', id: 'GG' }, { name: 'Guinea', id: 'GN' }, { name: 'Guinea-Bissau', id: 'GW' }, { name: 'Guyana', id: 'GY' },
                { name: 'Haiti', id: 'HT' }, { name: 'Heard Island and McDonald Mcdonald Islands', id: 'HM' }, { name: 'Holy See (Vatican City State)', id: 'VA' },
                { name: 'Honduras', id: 'HN' }, { name: 'Hong Kong', id: 'HK' }, { name: 'Hungary', id: 'HU' }, { name: 'Iceland', id: 'IS' },
                { name: 'India', id: 'IN' }, { name: 'Indonesia', id: 'ID' }, { name: 'Iran, Islamic Republic of', id: 'IR' }, { name: 'Iraq', id: 'IQ' },
                { name: 'Ireland', id: 'IE' }, { name: 'Isle of Man', id: 'IM' }, { name: 'Israel', id: 'IL' }, { name: 'Italy', id: 'IT' },
                { name: 'Jamaica', id: 'JM' }, { name: 'Japan', id: 'JP' }, { name: 'Jersey', id: 'JE' }, { name: 'Jordan', id: 'JO' },
                { name: 'Kazakhstan', id: 'KZ' }, { name: 'Kenya', id: 'KE' }, { name: 'Kiribati', id: 'KI' },
                { name: 'Korea, Democratic People\'s Republic of', id: 'KP' }, { name: 'Korea, Republic of', id: 'KR' },
                { name: 'Kuwait', id: 'KW' }, { name: 'Kyrgyzstan', id: 'KG' }, { name: 'Lao People\'s Democratic Republic', id: 'LA' },
                { name: 'Latvia', id: 'LV' }, { name: 'Lebanon', id: 'LB' }, { name: 'Lesotho', id: 'LS' }, { name: 'Liberia', id: 'LR' },
                { name: 'Libya', id: 'LY' }, { name: 'Liechtenstein', id: 'LI' }, { name: 'Lithuania', id: 'LT' }, { name: 'Luxembourg', id: 'LU' },
                { name: 'Macao', id: 'MO' }, { name: 'Macedonia, the Former Yugoslav Republic of', id: 'MK' }, { name: 'Madagascar', id: 'MG' },
                { name: 'Malawi', id: 'MW' }, { name: 'Malaysia', id: 'MY' }, { name: 'Maldives', id: 'MV' }, { name: 'Mali', id: 'ML' },
                { name: 'Malta', id: 'MT' }, { name: 'Marshall Islands', id: 'MH' }, { name: 'Martinique', id: 'MQ' }, { name: 'Mauritania', id: 'MR' },
                { name: 'Mauritius', id: 'MU' }, { name: 'Mayotte', id: 'YT' }, { name: 'Mexico', id: 'MX' }, { name: 'Micronesia, Federated States of', id: 'FM' },
                { name: 'Moldova, Republic of', id: 'MD' }, { name: 'Monaco', id: 'MC' }, { name: 'Mongolia', id: 'MN' }, { name: 'Montenegro', id: 'ME' },
                { name: 'Montserrat', id: 'MS' }, { name: 'Morocco', id: 'MA' }, { name: 'Mozambique', id: 'MZ' }, { name: 'Myanmar', id: 'MM' },
                { name: 'Namibia', id: 'NA' }, { name: 'Nauru', id: 'NR' }, { name: 'Nepal', id: 'NP' }, { name: 'Netherlands', id: 'NL' },
                { name: 'New Caledonia', id: 'NC' }, { name: 'New Zealand', id: 'NZ' }, { name: 'Nicaragua', id: 'NI' }, { name: 'Niger', id: 'NE' },
                { name: 'Nigeria', id: 'NG' }, { name: 'Niue', id: 'NU' }, { name: 'Norfolk Island', id: 'NF' }, { name: 'Northern Mariana Islands', id: 'MP' },
                { name: 'Norway', id: 'NO' }, { name: 'Oman', id: 'OM' }, { name: 'Pakistan', id: 'PK' }, { name: 'Palau', id: 'PW' },
                { name: 'Palestine, State of', id: 'PS' }, { name: 'Panama', id: 'PA' }, { name: 'Papua New Guinea', id: 'PG' }, { name: 'Paraguay', id: 'PY' },
                { name: 'Peru', id: 'PE' }, { name: 'Philippines', id: 'PH' }, { name: 'Pitcairn', id: 'PN' }, { name: 'Poland', id: 'PL' },
                { name: 'Portugal', id: 'PT' }, { name: 'Puerto Rico', id: 'PR' }, { name: 'Qatar', id: 'QA' }, { name: 'Reunion', id: 'RE' },
                { name: 'Romania', id: 'RO' }, { name: 'Russian Federation', id: 'RU' }, { name: 'Rwanda', id: 'RW' }, { name: 'Saint Barthelemy', id: 'BL' },
                { name: 'Saint Helena, Ascension and Tristan da Cunha', id: 'SH' }, { name: 'Saint Kitts and Nevis', id: 'KN' }, { name: 'Saint Lucia', id: 'LC' },
                { name: 'Saint Martin (French part)', id: 'MF' }, { name: 'Saint Pierre and Miquelon', id: 'PM' }, { name: 'Saint Vincent and the Grenadines', id: 'VC' },
                { name: 'Samoa', id: 'WS' }, { name: 'San Marino', id: 'SM' }, { name: 'Sao Tome and Principe', id: 'ST' }, { name: 'Saudi Arabia', id: 'SA' },
                { name: 'Senegal', id: 'SN' }, { name: 'Serbia', id: 'RS' }, { name: 'Seychelles', id: 'SC' }, { name: 'Sierra Leone', id: 'SL' },
                { name: 'Singapore', id: 'SG' }, { name: 'Sint Maarten (Dutch part)', id: 'SX' }, { name: 'Slovakia', id: 'SK' }, { name: 'Slovenia', id: 'SI' },
                { name: 'Solomon Islands', id: 'SB' }, { name: 'Somalia', id: 'SO' }, { name: 'South Africa', id: 'ZA' },
                { name: 'South Georgia and the South Sandwich Islands', id: 'GS' }, { name: 'South Sudan', id: 'SS' }, { name: 'Spain', id: 'ES' },
                { name: 'Sri Lanka', id: 'LK' }, { name: 'Sudan', id: 'SD' }, { name: 'Suriname', id: 'SR' }, { name: 'Svalbard and Jan Mayen', id: 'SJ' },
                { name: 'Swaziland', id: 'SZ' }, { name: 'Sweden', id: 'SE' }, { name: 'Switzerland', id: 'CH' }, { name: 'Syrian Arab Republic', id: 'SY' },
                { name: 'Taiwan, Province of China', id: 'TW' }, { name: 'Tajikistan', id: 'TJ' }, { name: 'Tanzania, United Republic of', id: 'TZ' },
                { name: 'Thailand', id: 'TH' }, { name: 'Timor-Leste', id: 'TL' }, { name: 'Togo', id: 'TG' }, { name: 'Tokelau', id: 'TK' },
                { name: 'Tonga', id: 'TO' }, { name: 'Trinidad and Tobago', id: 'TT' }, { name: 'Tunisia', id: 'TN' }, { name: 'Turkey', id: 'TR' },
                { name: 'Turkmenistan', id: 'TM' }, { name: 'Turks and Caicos Islands', id: 'TC' }, { name: 'Tuvalu', id: 'TV' },
                { name: 'Uganda', id: 'UG' }, { name: 'Ukraine', id: 'UA' }, { name: 'United Arab Emirates', id: 'AE' }, { name: 'United Kingdom', id: 'GB' },
                { name: 'United States', id: 'US' }, { name: 'United States Minor Outlying Islands', id: 'UM' }, { name: 'Uruguay', id: 'UY' },
                { name: 'Uzbekistan', id: 'UZ' }, { name: 'Vanuatu', id: 'VU' }, { name: 'Venezuela, Bolivarian Republic of', id: 'VE' },
                { name: 'Viet Nam', id: 'VN' }, { name: 'Virgin Islands, British', id: 'VG' }, { name: 'Virgin Islands, U.S.', id: 'VI' },
                { name: 'Wallis and Futuna', id: 'WF' }, { name: 'Western Sahara', id: 'EH' }, { name: 'Yemen', id: 'YE' }, { name: 'Zambia', id: 'ZM' },
                { name: 'Zimbabwe', id: 'ZW' }]
        },

        us: {
            states: [{id:'AL', name:'Alabama'},{id:'AK', name:'Alaska'},{id:'AZ', name:'Arizona'},{id:'AR', name:'Arkansas'},
                {id:'CA', name:'California'},{id:'CO', name:'Colorado'},{id:'CT', name:'Connecticut'},{id:'DE', name:'Delaware'},
                {id:'DC', name:'District Of Columbia'},{id:'FL', name:'Florida'},{id:'GA', name:'Georgia'},{id:'HI', name:'Hawaii'},
                {id:'ID', name:'Idaho'},{id:'IL', name:'Illinois'},{id:'IN', name:'Indiana'},{id:'IA', name:'Iowa'},
                {id:'KS', name:'Kansas'},{id:'KY', name:'Kentucky'},{id:'LA', name:'Louisiana'},{id:'ME', name:'Maine'},
                {id:'MD', name:'Maryland'},{id:'MA', name:'Massachusetts'},{id:'MI', name:'Michigan'},{id:'MN', name:'Minnesota'},
                {id:'MS', name:'Mississippi'},{id:'MO', name:'Missouri'},{id:'MT', name:'Montana'},{id:'NE', name:'Nebraska'},
                {id:'NV', name:'Nevada'},{id:'NH', name:'New Hampshire'},{id:'NJ', name:'New Jersey'},{id:'NM', name:'New Mexico'},{id:'NY', name:'New York'},
                {id:'NC', name:'North Carolina'},{id:'ND', name:'North Dakota'},{id:'OH', name:'Ohio'},{id:'OK', name:'Oklahoma'},{id:'OR', name:'Oregon'},
                {id:'PA', name:'Pennsylvania'},{id:'RI', name:'Rhode Island'},{id:'SC', name:'South Carolina'},{id:'SD', name:'South Dakota'},
                {id:'TN', name:'Tennessee'},{id:'TX', name:'Texas'},{id:'UT', name:'Utah'},{id:'VT', name:'Vermont'},{id:'VA', name:'Virginia'},
                {id:'WA', name:'Washington'},{id:'WV', name:'West Virginia'},{id:'WI', name:'Wisconsin'},{id:'WY', name:'Wyoming'}]
        },

        canada: {
            provinces: [{id:'AB', name:'Alberta'},{id:'BC', name:'British Columbia'},{id:'MB', name:'Manitoba'},
                {id:'NB', name:'New Brunswick'},{id:'NL', name:'Newfoundland and Labrador'},{id:'NS', name:'Nova Scotia'},
                {id:'NT', name:'Northwest Territories'},{id:'NU', name:'Nunavut'},{id:'ON', name:'Ontario'},
                {id:'PE', name:'Prince Edward Island'},{id:'QC', name:'Quebec'},{id:'SK', name:'Saskatchewan'},{id:'YT', name:'Yukon'}]
        }

    });