'use strict';

angular.module('ds.shared')
    .service('GlobalData', ['settings', function (settings) {
      
		this.languageCode = settings.languageCode;

    }]);
