angular.module('App')

.controller('sidebarController', ['$scope','Project','Cache','$rootScope', function($scope,Project,Cache,$rootScope) {

	$scope.projects = Cache.get('projectList');

	Project.query().$promise.then(function(data){
		$scope.projects = data.data;
		Cache.put('projectList',data.data);
	});

	var unbind_removeProject = $rootScope.$on('sidebarComponent.removeProject',function(event,index){
		$scope.projects.splice(index,1);
	});

	var unbind_addProject = $rootScope.$on('sidebarComponent.addProject',function(event,project){
		$scope.projects.push(project);
	});

	$scope.$on('$destroy', function() {
	    unbind_removeProject();
	    unbind_addProject();
	});


}]);