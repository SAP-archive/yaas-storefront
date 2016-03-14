/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris  
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

xdescribe('CartNoteMixinSvc Test', function() {

    beforeEach(function(){
       module('restangular');
       module('ds.products');
       module('ds.shared',
       function($provide){
           $provide.value('appConfig', {});
       });
       module('ds.cart');
    });
    
     
    beforeEach(inject(function(CartSvc, SiteConfigSvc) {
        
    }));
    
    
    it('should persist the note', function() {
        
    });
});
