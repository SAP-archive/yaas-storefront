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


$(document).on('mouseover', '.js-megamenutoggle', function() {
    
    //close all other dropdown menus
    $('.dropdown-menu').hide();
    
    //show the current drop down menu if there is one
    var subMenu = $(this).siblings('.dropdown-menu');
    if(subMenu.size() > 0){
        subMenu.show();
    }
});

$(document).on('click', '.js-megamenutoggle', function() {
    $('.js-megamenutoggle').removeClass('mactive');
    $(this).addClass('mactive');
});

$(document).on('mouseleave', '.js-mainNav', function(){
    $('.dropdown-menu').hide();
    
});

$(document).on('click', 'body', function() {
    $('.dropdown-menu').hide();
});


