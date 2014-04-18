$(document).ready(function () {
	$('[data-toggle=offcanvas]').click(function () {
		$('.off-canvas').toggleClass('active');
	});


	$('[data-toggle=offcanvas-cart]').click(function () {
		$('.off-canvas').toggleClass('right');
	});

	$(".gridMasonry").imagesLoaded( function() {
			$(".gridMasonry").masonry({
				itemSelector: '.item',
				isInitLayout: true
		});
	});


 	$(document).on("click",".showRefineContainer",function(e){
	 	e.preventDefault();

	 	if(!$(".refinePanel").hasClass("active")){
			//var offset = $(this).offset().top+46
	 		$(".refinePanel").addClass("active")
	 		//$(".refinePanel").css("top",offset)
	 	}else{
	 		$(".refinePanel").removeClass("active")
	 	}
	 	

	 })

 	$(document).on("click",".closeRefineContainer",function(e){
	 	e.preventDefault();
	 	$(".refinePanel").removeClass("active")

	 })


//productGrid
	$('#refineAffix').affix({
		offset: {
			top: function () {
				return (this.top = $('.gridMasonry').offset().top)
			},
			bottom: 0
		}
	})


	$('#refinePanelAffix').affix({
		offset: {
			top: function () {
				return (this.top = $('.gridMasonry').offset().top)
			},
			bottom: 0
		}
	})







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
		$(".gallery .thumbnails").owlCarousel({
			items : 5,
			itemsCustom:[[0, 2], [400, 4], [700, 4], [1000, 4], [1200, 5], [1600, 10]],
			navigation:true,
			navigationText:false,
			lazyLoad : true,
			pagination:false,
			itemsScaleUp:true
		});
	


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









	// ratingCalc
	// should be rewritten as an angular directive

	$(".ratingCalc").each(function(){

		var ratingData = $(this).data("rating");
		var $ratingIcon = $(this).find(".ratingIcon");
		var $clonelh;

		
		for (var i = 1; i <= ratingData.total; i++) {
			var $clone = $ratingIcon.clone().removeClass("ratingIcon");
			

			// adds the active class to the stars that are less than or equal than the current rating
			if(i <= ratingData.rating){
				$clone.addClass("active")
			}

			// divides the icons for the half rating points
			if(i-0.5 == ratingData.rating){
				$clone.addClass("active fh")
				$clonelh = $ratingIcon.clone().removeClass("ratingIcon");
				$clonelh.addClass("lh")
			}
			

			// inert the rating icons in the dom
			$clone.insertBefore($ratingIcon);
			if($clonelh){
				$clonelh.insertBefore($ratingIcon);
				$clonelh=null
			}

		

		}
		// delete the template icon
		$ratingIcon.remove()
	})






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

	
	






});