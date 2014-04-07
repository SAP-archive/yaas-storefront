define(['angular', 'masonry', 'imagesLoaded', 'lodash'], function(angular, Masonry, imagesLoaded, _){

    // based on github gist https://gist.github.com/CMCDragonkai/6191419

    'use strict';

    /**
     * Masonry Directive for a wall of item.
     * This directive is intended to be used along with ng-repeat directive.
     * Put masonryWallDir on the container element and pass in a class selector for each item to be laid out.
     * Pass in optional options via masonryWallOptions.
     * Put the masonryItemDir next to ng-repeat directive on the item to be repeated.
     * You're done!
     *
     * @param {String} masonryWallDir        Class selector of each item
     * @param {Object} masonryWallOptions    Optional options that are directly passed into Masonry
     */
    angular.module('Directives')
        .directive('masonryWallDir', function(){
            return {
                controller: [
                    '$scope',
                    '$element',
                    '$attrs',
                    function($scope, $element, $attrs){

                        var wallContainer, masonryOptions;

                        wallContainer = $element[0];

                        $attrs.$observe('masonryWallOptions', function(actual_value) {
                            masonryOptions = _.assign(
                                {},
                                $scope.$eval(actual_value), //$attrs.masonryWallOptions),
                                { itemSelector: $attrs.masonryWallDir }
                            );

                            self.masonry = new Masonry(
                                wallContainer,
                                masonryOptions
                            );

                            self.masonry.bindResize();

                            self.debouncedReload = _.debounce(function(){
                                self.masonry.reloadItems();
                                self.masonry.layout();
                            }, 100);
                        });

                    }
                ]
            };
        })
        .directive('masonryItemDir',
        function(){
            return {
                require: '^masonryWallDir',
                link: function(scope, element, attributes, masonryWallDirCtrl){

                    imagesLoaded(element, function(){
                        if(scope.$first){
                            masonryWallDirCtrl.masonry.prepended(element);
                        }else{
                            masonryWallDirCtrl.masonry.appended(element);
                        }
                    });

                    scope.$on('$destroy', masonryWallDirCtrl.debouncedReload);

                }
            };
        }
    );

});
