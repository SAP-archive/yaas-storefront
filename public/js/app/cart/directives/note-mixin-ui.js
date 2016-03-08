angular.module('ds.cart')
/**
 * note-mixin-ui
 * This directive the Add Note UI and functionality
 * @return {Object}
 */
    .directive('noteMixinUi',['$rootScope', function($rootScope){
        return {
            restrict: 'E',
            template: "<h1>Future home of the Add Note Mixin UI </h1>"
        }
    }]);