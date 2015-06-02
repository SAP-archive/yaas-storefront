

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

'use strict';

/**
 *	Localized Addresses: dynamic address forms based on user selection of localization.
 **/
angular.module('ds.addresses', [])
    .directive('localizedAddresses', function ($compile) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/app/addresses/templates/default-address.html',

		    link: function (scope, element) {
    			scope.localizedSelection;
    			scope.localizationSelections = [{name:'A'}, {name:'B'}, {name:'C'}];
				scope.changeLocale = function(item){
						debugger;
				}
		    }

        };
    });

angular.module('ds.addresses')
    .controller('localizedAddressesCtrl', function ($scope) {

});


