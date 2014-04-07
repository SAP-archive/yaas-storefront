
    'use strict';

    /**
     * Masonry Directive for supporting dynamically updated list of items.
     * This directive is intended to be used along with ng-repeat directive.
     * Pass in a class selector for each item to be laid out.
     * Pass in optional options via masonryOptions.
     * Put the masonryItemr next to ng-repeat directive on the item to be repeated.
     *
     *
     * @param {String} infinite-masonry       Class selector of each item
     * @param {Object} masonryOptions    Optional options that are directly passed into Masonry
     */
    angular.module('ds.shared')

// Code here will be linted with ignored by JSHint.
        /* jshint ignore:start */
        .directive('infiniteMasonry', function(){
            return {
                controller: [
                    '$scope',
                    '$element',
                    '$attrs',
                    function($scope, $element, $attrs){

                        var container, masonryOptions;

                        container = $element[0];
                        var self = this;

                        // ignore underscore - quick fix for now

                        $attrs.$observe('masonryOptions', function(actualValue) {
                            masonryOptions = _.assign(
                                {},
                                $scope.$eval(actualValue),
                                { itemSelector: $attrs.infiniteMasonry }
                            );

                            self.masonry = new Masonry(
                                container,
                                masonryOptions
                            );

                            self.masonry.bindResize();

                            self.reloadItems = _.debounce(function(){
                                self.masonry.reloadItems();
                                self.masonry.layout();
                            }, 100);
                        });

                    }
                ]
            };
        })
        /* jshint ignore:end */
        .directive('masonryItem',
        function(){
            return {
                require: '^infiniteMasonry',
                link: function(scope, element, attributes, masonryCtrl){
                    // ignore "imagesLoaded not defined
                    /* jshint ignore:start */
                    imagesLoaded(element, function(){
                        if(scope.$first){
                            masonryCtrl.masonry.prepended(element);
                        }else{
                            masonryCtrl.masonry.appended(element);
                        }
                    });
                    /* jshint ignore:end */
                    scope.$on('$destroy', masonryCtrl.reloadItems);

                }
            };
        }

    );

