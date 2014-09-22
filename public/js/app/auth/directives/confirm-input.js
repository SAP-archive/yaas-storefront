/**
 * Created by i839794 on 9/16/14.
 */
'use strict';

angular.module('ds.auth')
.directive('confirmInput', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var firstPassword = '#' + attrs.confirmInput;
            // we're adding a 'on key up' listener to both the original and repeat password
            element.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    var v = element.val()===$(firstPassword).val();
                    ctrl.$setValidity('match', v);
                });
            });
        }
    };
});
