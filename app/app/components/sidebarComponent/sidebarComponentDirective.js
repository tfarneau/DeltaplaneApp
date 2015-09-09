angular.module('App')

.directive('sidebarComponent', [function() {
    return {
        restrict: 'A',
        templateUrl: 'components/sidebarComponent/sidebarComponent.html',
        link: function(){

        	console.log("init")

        	$('.c-sidebar').on('mouseenter',function(){
			  $('.c-main').addClass('is-moved');

			  setTimeout(function(){
			    $('.c-sidebar').one('mouseleave',function(){
			      $('.c-main').removeClass('is-moved');
			    })
			  },300);

			});
        	
			$('.c-sidebar').on('click',function(){
				$('.c-main').removeClass('is-moved');
			});

        }
    };
}]);