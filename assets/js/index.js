$(document).ready(function(){
	//
	var kiky = {

		init: function(){
			var siteHeader = $('.site-header');
			//console.log(siteHeader);
			if ($(window).scrollTop() > 100) {
                siteHeader.addClass('reading');
            } else {
                siteHeader.removeClass('reading');
            }
			$(window).on('scroll', function(){
				if ($(window).scrollTop() > 100) {
                    siteHeader.addClass('reading');
                } else {
                    siteHeader.removeClass('reading');
                }
			});
			kiky.toggleNav();
		},
		toggleNav: function(){
			var event =  'ontouchstart' in window ? 'touchstart' : 'click',
				menuIcon = $('.iconfont'),
				navTag = $('.site-nav-tag');
				menuIcon.on(event, function(){
					navTag.toggle(300);
					//console.log(navUl)
				});
				$(window).resize(function(){
					if($(window).width() <= 600 && navTag.css('display') == 'block'){
						navTag.css('display','none')
					}
					if($(window).width() > 600 && navTag.css('display') == 'none'){
						navTag.css('display','block')
					}
				});
		}

	}
	kiky.init();
})