'use strict';

angular.module('rice.shared')
    .service('GlobalData', ['settings', function (settings) {
      
		this.languageCode = settings.languageCode;

    }]);
