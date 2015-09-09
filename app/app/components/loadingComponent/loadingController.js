angular.module('App')

.controller('loadingController', ['$scope','$rootScope', function($scope,$rootScope) {

	$scope.isVisible = false;

	var unbind_showLoading = $rootScope.$on('loadingComponent.show',function(event){
		$('.js-blur').addClass('u-blur');
		$scope.isVisible = true;
	});

	var unbind_hideLoading = $rootScope.$on('loadingComponent.hide',function(event){
		$('.js-blur').removeClass('u-blur');
		$scope.isVisible = false;
	});

	$scope.$on('$destroy', function() {
	    unbind_showLoading();
	    unbind_hideLoading();
	});


}]);