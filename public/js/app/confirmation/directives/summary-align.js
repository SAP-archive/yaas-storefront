/**
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2015 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

angular.module('ds.confirmation')
    .directive('summaryAlign',function() {
        return {
            restrict: 'A',
            scope:{
                productcount: '@'
            },
            link: function(scope, element, attrs){
                
                /*
                    after calculating the proper position we apply the necessary
                    class to the container to finalize the visual layout
                */
                var setClass = function(alignClass){
                    element.attr('class', alignClass);
                };
                 
                attrs.$observe('productcount', function(value){
                    
                    var alignClass = 'col-xs-12 ';
                    //check to see if we're only dealing with a signle product.  
                    
                    if( parseInt(value, 10) === 1)
                    {
                        //if only 1 product is in the cart it is an automatic centering for the display position
                        alignClass += 'col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4';
                    }else{
                        
                        //determines where the summary should be aligned based 
                        //on the number of products in the cart
                        var calculatePositionSlot = function(){
                            /*
                                here wer'e looking for 33% of hte display purely based on the knowledge that
                                based on the visual comps that unless we're in mobile the each product will always take up 
                                1/3 of the available horizontal space for display.
                                
                                Mobile is an autmoatic full width per product layout, so we can safely
                                leave the col-xs-12 as a default as that is a constant. 
                            */
                            return Math.floor(parseInt(((value*0.33) %1).toFixed(1).split('.')[1], 10)/3);
                        };
                    
                        
                        switch(calculatePositionSlot())
                        {
                            //places the summary in slot 3 of 3
                            case 0:
                                alignClass += 'col-lg-4 col-lg-offset-8 col-md-4 col-md-offset-8';
                            break;
                            //places the summary in slot 1 of 3
                            case 1:
                                alignClass += 'col-lg-4 col-md-4';
                            break;
                            //places the summary in slot 2 of 3
                            case 2:
                                alignClass += 'col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4';
                            break;
                        }
                    }
                    
                    setClass(alignClass);
                    
                });
                
            }
        };
    });
