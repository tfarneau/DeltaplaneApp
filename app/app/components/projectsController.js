angular.module('App')

.controller('projectsController', ['$scope','$timeout','$state','config','Project','Task','Cache','$rootScope','$location', function($scope,$timeout,$state,config,Project,Task,Cache,$rootScope,$location) {
	
	$rootScope.$broadcast('loadingComponent.show');

	$scope.projects = Cache.get('projectsList');
	Project.query().$promise.then(function(data){

		$scope.projects = data.data;
		Cache.put('projectsList',data.data);

		Task.query({ status : 0 }).$promise.then(function(data){
			data.data = setTasksDaysDifference(data.data);
			setTasksToProjects(data.data);
			$rootScope.$broadcast('loadingComponent.hide');
		});

	});


	$scope.goProject = function(id){
		$location.path('/projects/'+id);
	}

	// Task functions
	// ##############

	$scope.deleteTask = function(parentIndex,index){

		Task.delete({taskId: $scope.projectTasks[parentIndex].tasks[index].id});
		$scope.projectTasks[parentIndex].tasks.splice(index,1);

	}

	$scope.changeTaskStatus = function(parentIndex,index){

		$scope.projectTasks[parentIndex].tasks[index].status == 0 ? $scope.projectTasks[parentIndex].tasks[index].status = 1 : $scope.projectTasks[parentIndex].tasks[index].status = 0;
		Task.update({taskId:$scope.projectTasks[parentIndex].tasks[index].id}, {
			status: $scope.projectTasks[parentIndex].tasks[index].status
		});

	}

	function setTasksDaysDifference(tasks){

		var _tasks = [];
		var hoursOverdue = 0;

		var today = moment();
		angular.forEach(tasks,function(task_value,task_key){

			task_value.difference = today.diff(task_value.day, 'days');
			if(task_value.difference >= 0){
				_tasks.push(task_value);
				hoursOverdue+=task_value.difference;
			}

		});

		$scope.hoursOverdue = hoursOverdue;

		return _tasks;
	}

	function setTasksToProjects(tasks){

		var _projects = [];
		var projectsData = angular.copy($scope.projects);

		// Set tasks to projects
		// #####################

		angular.forEach(tasks,function(task_value,task_key){

			if(task_value.status == 0){

				if(_projects[task_value.project_id] === undefined){
					_projects[task_value.project_id] = {
						id : task_value.project_id,
						tasks : []
					};
				}

				_projects[task_value.project_id].tasks.push(task_value);

			}

		});

		// Set project data
		// ################

		angular.forEach(_projects,function(project_value,project_key){
			angular.forEach(projectsData, function(projectData_value,projectData_key){

				if(projectData_value.id == project_value.id){
					project_value.name = projectData_value.name;
				}

			});
		});

		var __projects = [];

		// Set this to an array
		// ####################

		angular.forEach(_projects,function(project_value,project_key){
			__projects.push(project_value);
		});

		_projects = __projects;

		$scope.projectTasks = _projects;

	}

	// Form
	// ####
	
	$scope.deleteProject = function(index){

		Project.delete({projectId: $scope.projects[index].id});
		$scope.projects.splice(index,1);

		$rootScope.$broadcast('sidebarComponent.removeProject',index);

		$rootScope.$broadcast('notificationComponent.sendNotif',{
			type : 'is-success',
			icon : 'fa-check',
			message : 'The project was successfully deleted'
		});

	}

	$scope.addProject = function(){

		if($scope.formData.projectName !== undefined && $scope.formData.projectName.length > 3 && $scope.formData.projectColor !== undefined && $scope.formData.projectColor.length > 5){

			var _project = new Project();
			_project.status = 1;
			_project.name = $scope.formData.projectName;
			_project.description = '';
			_project.color = $scope.formData.projectColor;
			_project.budget = $scope.formData.projectBudget;

			var __project = angular.copy(_project);

			$scope.formData = {};
			_project.$save(function(data,b){

				__project.id = data.data.id;
				$scope.projects.push(__project);

				$rootScope.$broadcast('sidebarComponent.addProject',__project);

				$rootScope.$broadcast('notificationComponent.sendNotif',{
					type : 'is-success',
					icon : 'fa-check',
					message : 'The project was successfully added'
				});

			});

		}else{

			$rootScope.$broadcast('notificationComponent.sendNotif',{
				type : 'is-error',
				icon : 'fa-warning',
				message : 'Please provide a valid name and color !'
			});

		}

	}

}]);