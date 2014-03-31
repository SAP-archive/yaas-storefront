'use strict';

angular.module('hybris.bs&d.newborn.shared')
	.directive('popover', [
		function () {
			return {
				restrict: 'A',
				scope: {
			        selector: '@'
			    },
				link: function (scope, iElement, iAttrs) {
					var popover;

					var popOverToggle = function() {
						if (!popover || !popover.length) {
							popover = angular.element(iAttrs.selector);
						}
						popover.toggle();
					};

					iElement.popover();
					iElement.on('click', popOverToggle);
					
					scope.$on('$destroy', function() {
						iElement.off('click', popOverToggle);
					});
				}
			};
		}
	]);