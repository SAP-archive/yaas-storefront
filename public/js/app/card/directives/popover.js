'use strict';

angular.module('hybris.bs&d.newborn.card')
	.directive('cardpopover', [
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
					var onOrderCreatedHandler = scope.$on('orders:order:created', popOverToggle);
					
					scope.$on('$destroy', function() {
						iElement.off('click', popOverToggle);
						onOrderCreatedHandler();
					});
				}
			};
		}
	]);