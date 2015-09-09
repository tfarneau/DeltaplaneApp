angular.module('App')

.controller('notificationController', ['$scope', '$rootScope', '$timeout', function($scope,$rootScope,$timeout) {

	var timeout = null;

	$scope.notifications = [];

	var unbind_sendNotif = $rootScope.$on('notificationComponent.sendNotif', function(e,d){

		$scope.notification = {
			type : d.type,
			icon : d.icon,
			message : d.message,
			isActive : true
		}

		$timeout(function(){
			$scope.notification = {
				isActive : false
			}
		},3000);

	});

	$scope.$on('$destroy', function() {
	    unbind_sendNotif();
	});

}]);
