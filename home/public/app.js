$('.c-sideprojects,.c-header').on('mouseenter',function(){
	$('.c-main').addClass('is-moved');
	$('.c-header').removeClass('is-mini');

	setTimeout(function(){
		$('.c-sideprojects,.c-header').one('mouseleave',function(){
			$('.c-main').removeClass('is-moved');
			$('.c-header').addClass('is-mini');
		})
	},300);

})
