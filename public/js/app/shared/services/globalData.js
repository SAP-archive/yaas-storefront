'use strict';

angular.module('hybris.bs&d.newborn.shared')
    .service('GlobalData', ['settings', function (settings) {
      
		this.languageCode = settings.languageCode;

    }]);
