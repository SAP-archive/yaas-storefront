'use strict';

/**
 *  Encapsulates access to the CAAS product API.
 */
angular.module('ds.products')
    .factory('CategorySvc', ['PriceProductREST', '$q', function(PriceProductREST, $q){

        var categoryMap;

        function sluggify(name){
            // very simplistic algorithm to handle German Umlaute - should ultimately be provided by server
            return window.encodeURIComponent(name.toLowerCase().replace(' ', '-').replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue').replace('ß', 'ss'));
        }

        function loadCategory(cat, parent){
            cat.path = [];
            if(parent){
                angular.copy(parent.path, cat.path);
            }
            cat.path.push(cat);
            cat.slug = sluggify(cat.name)+'~'+cat.id;
            categoryMap[cat.id] = cat;

            if(cat.subcategories){
                angular.forEach(cat.subcategories, function(sub){
                    loadCategory(sub, cat);
                });
            }
        }

        function getCategory(slug){
            var tildeIndex = slug.indexOf('~');
            if(tildeIndex < 0) {
                return null;
            }
            var catId = slug.substring(tildeIndex+1, slug.length);
            return categoryMap[catId];
        }

        return {

            /** Returns a promise over the category list.*/
            getCategories: function () {
                var catDef = $q.defer();

                PriceProductREST.Categories.all('categories').getList({ expand: 'subcategories', toplevel: true }).then(function (result) {
                    categoryMap = {};
                    var cats = [];
                    angular.forEach(result.plain(), function (category) {
                        cats.push(category);
                        loadCategory(category);
                    });
                    catDef.resolve(cats);
                }, function (error) {
                    catDef.reject(error);
                });

                return catDef.promise;
            },


            getCategoryWithProducts: function (categorySlug) {
                var compositeDef = $q.defer();

                if (!categorySlug) {
                    compositeDef.resolve(null);
                } else {
                    var cdef = $q.defer();
                    if (categoryMap) {
                        var category = getCategory(categorySlug);
                        if(category){
                            cdef.resolve(category);
                        } else {
                            cdef.reject();
                        }
                    } else {
                        this.getCategories().then(function () {
                            var category = getCategory(categorySlug);
                            if(category){
                                cdef.resolve(category);
                            } else {
                                cdef.reject();
                            }
                        });
                    }
                    cdef.promise.then(function (category) {
                        PriceProductREST.Categories.all('categories').one(category.id).all('elements').getList().then(
                            function(elements){
                                category.elements = elements.plain();
                                compositeDef.resolve(category);
                            }, function(){
                                compositeDef.resolve(category);
                            }
                        );
                    });
                }

                return compositeDef.promise;
            },



            getSlug: function (name) {
                return sluggify(name);
            }
        };
}]);
