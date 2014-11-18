/**
 * Created by i839794 on 11/18/14.
 */
'use strict';

angular.module('ds.products')
    .directive('dsCategoryBreadcrumb', ['$compile', function ($compile) {

         return {//
             restrict: 'E',
             replace: true,

             link: function(scope, element){
                 //start creating an html string for our "view".
                 var bc = '<a ui-sref=\"base.category({catName: null})\">{{ \'ALL_PRODUCTS\' | translate }}</a>';

                 var i = 0;
                 angular.forEach(scope.category.path, function(cat){
                     if(++ i< scope.category.path.length) {
                         bc += ' / <a ui-sref=\"base.category({catName: cat.slug})\">' + cat.name +'</a>';
                     } else {
                         bc += ' - '+ cat.name;
                     }
                 });

                 //create an angular element. (this is still our "view")
                 var el = angular.element(bc);

                 //compile the view into a function.
                 var compiled = $compile(el);

                 //append our view to the element of the directive.
                 element.append(el);

                 //bind our view to the scope!
                 compiled(scope);
             }
         };
    }]);