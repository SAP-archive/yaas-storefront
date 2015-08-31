var initRefineAffix = function()
{
    $('#refineAffix').affix({
        offset: {
            top: function () {
                return (this.top = $('.product-grid').offset().top)
            }
        }
    });
}


$(document).ready(function () {

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
			itemsCustom:[[0, 5], [400, 5], [700, 5], [1000, 5], [1200, 5], [1600, 5]],
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
	 	var zoom =  $item.data("zoom")



	 	if(type=="tap"){
	 		$(".gallery .image").append('<div class="zoomCanvas">  <button class="btn btn-link zoomButtonClose"><span class="hyicon hyicon-menu"></span></button><canvas  id="zoomcanvas" style="width: 100%; height: 100%"></canvas></div>')

	 		 var gesturableImg = new ImgTouchCanvas({
	            canvas: document.getElementById('zoomcanvas'),
	            path: zoom
	        });
	 	}

        else{

			$(".gallery .image .owl-item").each(function(){
				var img = $(this).find("img");

				img.attr("src",img.data("zoom"))

			});
            $(".gallery .image img").fullScreen(true);


	 	}

	 }



	 $(document).on("click",".gallery .image .zoomButtonClose",function(e){
	 	e.preventDefault();
	 	//remove zoom canvas
	 	$(".gallery .image .zoomCanvas").remove();
	 })


	if ($(".carousel").length && $(".carousel").owlCarousel) {
		$(".carousel").owlCarousel({
			items : 5,
			itemsCustom:[[0, 1], [660,1], [661, 5], [1000, 5], [1200, 5], [1600, 5]],
			navigation:true,
			navigationText:false,
			lazyLoad : true,
			pagination:false,
			itemsScaleUp:true,
			responsiveBaseWidth:$(".carousel")
		});
	}







});
