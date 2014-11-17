$(document).ready(function () {

	$('#refineAffix').affix({
		offset: {
			top: function () {
				return (this.top = $('.product-grid').offset().top)
			}
		}
	});

	if ($(".gallery .image").length && $(".gallery .image").owlCarousel) {
		$(".gallery .image").owlCarousel({
			singleItem : true,
			navigation:false,
			pagination:true,
			lazyLoad : true,
			lazyFollow : true,
			lazyEffect:"goDown",
			autoHeight:true,
			afterAction : syncPosition,
			afterInit: setupZoom
		});
	}
	if ($(".gallery .thumbnails").length && $(".gallery .thumbnails").owlCarousel) {
		$(".gallery .thumbnails").owlCarousel({
			items : 5,
			itemsCustom:[[0, 2], [400, 4], [700, 4], [1000, 4], [1200, 5], [1600, 10]],
			navigation:true,
			navigationText:false,
			lazyLoad : true,
			pagination:false,
			itemsScaleUp:true
		});
	}


	 $(document).on("click",".gallery .thumbnails a.item",function(e){
	 	e.preventDefault();
	 	var $p = $(this).parents(".owl-item")
	 	$p.addClass("clicked")
	 	$(".gallery .image").trigger("owl.goTo",$p.data("owlItem"));

	 })

	 function syncPosition(el){

	 	//remove zoom canvas
	 	$(".gallery .image .zoomCanvas").remove();

	 	var current = this.currentItem
		$(".gallery .thumbnails .owl-item").removeClass("active")

	 	if($(".gallery .thumbnails .owl-item.clicked").length==0){
			$(".gallery .thumbnails").trigger("owl.goTo",current);
			$(".gallery .thumbnails").find(".owl-item").eq(current).addClass("clicked")
		}

		$(".gallery .thumbnails .owl-item.clicked").addClass("active").removeClass("clicked")
	 }


	 function setupZoom(el){
	 	console.log("setupZoom",el)
	 	$(el).append('<button class="btn btn-link zoomButton"><span class="hyicon hyicon-plus"></span></button>')
	 
	 	bindZoomClick()
	 }


	 function bindZoomClick(){
	 	var isTap=false

	 	$(".gallery .image .zoomButton").on({ 'touchstart' : function(e){
	  			isTap=true
	   	} })


	   	$(".gallery .image .zoomButton").on("click",function(e){
		 	e.preventDefault();
		 	if(isTap){
		 		initZoom("tap")

		 	}else{
		 		initZoom("click")
		 	}
		 })
	 }




	 function initZoom(type){
	 	var oc = $(".gallery .image").data('owlCarousel');
	 	var current = oc.currentItem;

	 	var $item =$(".gallery .image").find(".owl-item").eq(current).find("img");

	 	//$item.before('<canvas class="zoomCanvas" id="zoomcanvas" style="width: 100%; height: 100%"></canvas>')
	 	var zoom =  $item.data("zoom")



	 	if(type=="tap"){
	 		$(".gallery .image").append('<div class="zoomCanvas">  <button class="btn btn-link zoomButtonClose"><span class="hyicon hyicon-menu"></span></button><canvas  id="zoomcanvas" style="width: 100%; height: 100%"></canvas></div>')
	 	
	 		 var gesturableImg = new ImgTouchCanvas({
	            canvas: document.getElementById('zoomcanvas'),
	            path: zoom
	        });
	 	}else{

			$(".gallery .image .owl-item").each(function(){
				var img = $(this).find("img")	

				img.attr("src",img.data("zoom"))

			})	

	 			$(".gallery").fullScreen(true);
	 	}

	 	console.log(type,current,zoom)

	 }



	 $(document).on("click",".gallery .image .zoomButtonClose",function(e){
	 	e.preventDefault();
	 	//remove zoom canvas
	 	$(".gallery .image .zoomCanvas").remove();
	 })


	if ($(".carousel").length && $(".carousel").owlCarousel) {
		$(".carousel").owlCarousel({
			items : 5,
			itemsCustom:[[0, 2], [400, 4], [700, 4], [1000, 4], [1200, 5], [1600, 16]],
			navigation:true,
			navigationText:false,
			lazyLoad : true,
			pagination:false,
			itemsScaleUp:true,
			responsiveBaseWidth:$(".carousel")
		});
	}
	
	






/*
	$("#sidebar .navi").menuAim({
	      // Function to call when a row is purposefully activated. Use this
	      // to show a submenu's content for the activated row.
	      activate: function(row) {
	      	$(row).addClass("active");
	      },

	      // Function to call when a row is deactivated.
	      deactivate: function(row) {
	      	$(row).removeClass("active");
	      },

	      // Function to call when mouse enters a menu row. Entering a row
	      // does not mean the row has been activated, as the user may be
	      // mousing over to a submenu.
	      enter: function() {},

	      // Function to call when mouse exits a menu row.
	      exit: function() {},

	      // Function to call when mouse exits the entire menu. If this returns
	      // true, the current row's deactivation event and callback function
	      // will be fired. Otherwise, if this isn't supplied or it returns
	      // false, the currently activated row will stay activated when the
	      // mouse leaves the menu entirely.
	      exitMenu: function() {
	      	$("#sidebar .navi > li").removeClass("active");
	      },

	      // Selector for identifying which elements in the menu are rows
	      // that can trigger the above events. Defaults to "> li".
	      rowSelector: "> li",

	      // You may have some menu rows that aren't submenus and therefore
	      // shouldn't ever need to "activate." If so, filter submenu rows w/
	      // this selector. Defaults to "*" (all elements).
	      submenuSelector: "*",

	      // Direction the submenu opens relative to the main menu. This
	      // controls which direction is "forgiving" as the user moves their
	      // cursor from the main menu into the submenu. Can be one of "right",
	      // "left", "above", or "below". Defaults to "right".
	      submenuDirection: "right"
	  });
*/



/*
	$(document).on("click","#sidebar .navi > li.has-sub > a",function(e){
		e.preventDefault();
		$("#sidebar .navi > li > a").removeClass("mactive");
		$(this).addClass("mactive");


		$("#sidebar .navi").addClass("sub-1");

	})


	$(document).on("click","#sidebar .navi .sub-navi-list > li.has-sub > a",function(e){
		e.preventDefault();
		$("#sidebar .navi .sub-navi-list > li > a").removeClass("mactive");
		$(this).addClass("mactive");
		$("#sidebar .navi").addClass("sub-2");
	})

*/


	$(document).on("click","#sidebar .navi ul.sub-navi-list > li.back > a",function(e){
		e.preventDefault();
		$("#sidebar .navi > li > a").removeClass("mactive");
		$("#sidebar .navi").removeClass("sub-1");
		$("#sidebar .navi").removeClass("sub-2");

	})

	$(document).on("click","#sidebar .navi ul.sub-navi-list  ul >  li.back > a ",function(e){
		e.preventDefault();
		$("#sidebar .navi .sub-navi-list > li > a").removeClass("mactive");
		$("#sidebar .navi").removeClass("sub-2");

	})












});