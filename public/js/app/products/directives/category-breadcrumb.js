/**
 * Created by i839794 on 11/18/14.
 */
'use strict';

angular.module('ds.products')
    .directive('dsCategoryBreadcrumb', ['$translate', '$compile', function ($translate, $compile) {

         return {//
             restrict: 'AE',
             replace: true,
             priority: 1000,
             link: function($scope, $element){

                 //start creating an html string for our "view".
                 var bc = '<div><a ui-sref="base.category({catName: null})" id="bc0"></a>';

                 var i = 0;
                 angular.forEach($scope.category.path, function(cat){
                     if(++ i< $scope.category.path.length) {
                         bc += ' / <a ui-sref="base.category({catName: \''+ cat.slug+'\' })\" id="bc' + cat.id+'">' + cat.name +'</a>';
                     } else {
                         bc += ' / '+ cat.name;
                     }
                 });
                 bc += '</div>';



                 //create an angular element. (this is still our "view")
                 var el = angular.element(bc);

                 //compile the view into a function.
                 var compiled = $compile(el);

                 //append our view to the element of the directive.
                 $element.append(el);

                 $translate('ALL_PRODUCTS').then(function(allProdVar){
                    $element.find('#bc0').text(allProdVar);
                 });

                 //bind our view to the scope!
                 compiled($scope);

                return $element;
             }
         };
    }]);