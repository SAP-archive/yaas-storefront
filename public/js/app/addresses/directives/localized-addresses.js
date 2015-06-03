

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

'use strict';

/**
 *	Localized Addresses: dynamic address forms based on user selection of localization.

angular.module('ds.addresses', [])
    .directive('localizedAddresses', function ($compile) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'js/app/addresses/templates/default-address.html',

		    link: function (scope, element) {
		    	var chinaTemplate = '';


    			scope.localizedSelection;
    			scope.localizationSelections = [{name:'A'}, {name:'B'}, {name:'C'}];
        		scope.rootDirectory = 'js/app/addresses/';
				scope.changeLocale = function(item){
						debugger;
					if (item === 'B'){
						// compile localized view into template

				        element.html(getTemplate(scope.content.content_type)).show();

				        $compile(element.contents())(scope);
					}
				}

			    scope.getTemplateURL = function(contentType) {
			        var template = '';

			        switch(contentType) {
			            case 'image':
			                template = chinaTemplate;
			                break;
			            case 'video':
			                template = usTemplate;
			                break;
			            case 'notes':
			                template = canadaTemplate;
			                break;
			        }

			        return template;
			    }




		    }

        };
    });

angular.module('ds.addresses')
    .controller('localizedAddressesCtrl', function ($scope) {

});
 **/

angular.module('ds.addresses').
    directive('localizedAddresses', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {


        var templateLinker = function(scope, element, attrs) {

        	var currentElement = element;


			scope.localeSelection;
			scope.localeSelections = [{name:'A'}, {name:'B'}, {name:'C'}];

			scope.changeLocale = function(item){
				var temp;
				if(item === 'A'){
					temp = '<H1>A WURLD PEAS</H1><pre>{{localeSelections|json}}</pre><div class="col-lg-12"><div class="form-group input-group"><label class="input-group-addon control-label" for="addressLocale">Country</label><select class="form-control" ng-model="localeSelection" ng-options="item.name as item.name for item in localeSelections" ng-change="changeLocale(localeSelection)" id="addressLocale"></select></div></div>';
				} else {
					temp = '<H1>B C WURLD PEAS</H1><pre>{{localeSelections|json}}</pre><div class="col-lg-12"><div class="form-group input-group"><label class="input-group-addon control-label" for="addressLocale">Country</label><select class="form-control" ng-model="localeSelection" ng-options="item.name as item.name for item in localeSelections" ng-change="changeLocale(localeSelection)" id="addressLocale"></select></div></div>';
				}

				currentElement.html(temp).show();

	        	$compile(currentElement.contents())(scope);
			}



			var template = '<H1>HELLOWURLD</H1><pre>{{localeSelections|json}}</pre><div class="col-lg-12"><div class="form-group input-group"><label class="input-group-addon control-label" for="addressLocale">Country</label><select class="form-control" ng-model="localeSelection" ng-options="item.name as item.name for item in localeSelections" ng-change="changeLocale(localeSelection)" id="addressLocale"></select></div></div>';

			//initialize
	        element.html(template).show();

	        $compile(element.contents())(scope);
        }

        return {
            restrict: 'E',
            // scope: {
            //     post:'='
            // },
            link: templateLinker
        };
    }]);

// angular.module('ds.addresses').
//     directive('localizedAddresses', ['$compile', '$http', '$templateCache', function($compile, $http, $templateCache) {

//     	var currentElement;

//         var getTemplate = function(contentType) {
//         	debugger;
//             var templateLoader,
//             // baseUrl = '/templates/components/tumblr/',
//             baseUrl = 'js/app/addresses/templates/',
//             templateMap = {
//             	USA : 'address-USA.html',
//             	CAN : 'address-CAN.html',
//             	CHI : 'address-CHI.html',
//             	def : 'address-default.html'
//                 // text: 'text.html',
//                 // photo: 'photo.html',
//                 // video: 'video.html',
//                 // quote: 'quote.html',
//                 // link: 'link.html',
//                 // chat: 'chat.html',
//                 // audio: 'audio.html',
//                 // answer: 'answer.html'
//             };

//             var templateUrl = baseUrl + templateMap[contentType];
//             templateLoader = $http.get(templateUrl, {cache: $templateCache});

//             return templateLoader;

//         }

//         var templateLinker = function(scope, element, attrs) {
//         	debugger;
//         	currentElement = element;
//         	//locale selection combo
// 			scope.localeSelection;
// 			scope.localeSelections = [{name:'A'}, {name:'B'}, {name:'C'}];
//     		// scope.rootDirectory = 'js/app/addresses/templates/';
// 			scope.changeLocale = function(item){
// 					item = 'USA';
// 				if (item === 'USA'){
// 					// compile localized view into template
// 					//template loading and replacement
// 		            var tempLoader = getTemplate(item);

// 		            var promise = tempLoader.success(function(html) {
// 		                // element.html(html).show();
// 		                replacementElement = angular.element(html);
// 		            }).then(function (response) {
// 		                // element.replaceWith($compile(element.html())(scope));
// 		                currentElement.replaceWith($compile(replacementElement.html())(scope));
// 		                // currentElement.replaceWith(replacementElement);
// 		                currentElement = replacementElement;
// 		            });

// 			        //element.html(getTemplate(scope.content.content_type)).show();

// 			        //$compile(element.contents())(scope);
// 				}
// 			}

// 			var replacementElement;

// 				// var replacementElement = angular.element(html);
//     //             currentElement.replaceWith(replacementElement);
//     //             currentElement = replacementElement;



// 			//initialize
// 			//load localized address template or default
// 			var currentLocale = 'def';
//             var tempLoader = getTemplate(currentLocale);

//             var promise = tempLoader.success(function(html) {
//             	replacementElement = angular.element(html);
//                 // element.html(html);
//                 // currentElement.html(html);
//             }).then(function (response) {
//                 // element.replaceWith($compile(element.html())(scope));
//                 currentElement.replaceWith($compile(replacementElement.html())(scope));
//                 // currentElement.replaceWith(replacementElement);
//                 currentElement = replacementElement;
//             });
//         }

//         return {
//             restrict: 'E',
//             // scope: {
//             //     post:'='
//             // },
//             link: templateLinker
//         };
//     }]);


