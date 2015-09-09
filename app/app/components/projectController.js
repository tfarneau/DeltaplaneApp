angular.module('App')

.controller('projectController', ['$scope','$rootScope','Project','$stateParams','Task','Cache','taskParser','Note', function($scope,$rootScope,Project,$stateParams,Task,Cache,taskParser,Note) {

	$rootScope.$broadcast('loadingComponent.show');

	$scope.project = Cache.get('actualProject');

	// 2 types :
	// - classic : all days visible
	// - simple : only tasked days TODO
	// - calendar : days on calendar

	var SCREENMODE = $stateParams.showType;

	// Form data
	// #########

	$scope.formData = {
		newTask : []
	}

	$scope.projectData = {
		duration: 0
	}

	// Init tasks
	// ##########

	var tasks = [];

	$scope.addTask = function(day,index){

		var _task = new Task();
		_task.status = 0;
		_task.name = $scope.formData.newTask[index];
		_task.day = day.date.datetime;
		_task.project_id = $scope.project.id;

		var taskMetaData = taskParser.getTaskMetaData(_task,'add',{});
		_task.meta_hours = taskMetaData.duration;

		var __task = angular.copy(_task);

		_task.$save(function(data,b){
			__task.id = data.data.id;
			setTaskIndex(angular.copy(__task));
		});

		$scope.projectData = taskParser.getTaskMetaData(_task,'add',$scope.projectData);
		setProjectData();

		$scope.formData.newTask[index] = '';

	}

	$scope.deleteTask = function(day,index){

		$scope.projectData = taskParser.getTaskMetaData(day.tasks[index],'remove',$scope.projectData);
		setProjectData();

		Task.delete({taskId: day.tasks[index].id});
		day.tasks.splice(index,1);

	}

	$scope.changeTaskStatus = function(day,index){

		day.tasks[index].status == 0 ? day.tasks[index].status = 1 : day.tasks[index].status = 0;
		Task.update({taskId:day.tasks[index].id}, {
			status: day.tasks[index].status
		});

	}

	// ###############
	// Days management
	// ###############

	function generateDay(_moment){

		var _date = {
			date: {
				datetime: _moment.format('YYYY-MM-DD 00:00:00'),
				date: _moment.format('MMMM Do YYYY'),
				day: _moment.format('dddd'),
				calendar: _moment.fromNow()
			}
		};

		moment().format('YYYY-MM-DD') == _moment.format('YYYY-MM-DD') ? _date.isToday = true : null;

		return _date;

	}

	function setDays(){

		var myMoment = moment();
		var days = [];
		for(var i = 1; i <= 4; i++){

			days.push(generateDay(myMoment));
			myMoment.add(1, 'days');

		}

		$scope.days = days;

		setTasksToDays();

	}

	function setTasksToDays(){

		angular.forEach($scope.days, function(day_value, day_key) {
			tasks[day_value.date.datetime] == undefined ? tasks[day_value.date.datetime] = [] : null;
			day_value.tasks = tasks[day_value.date.datetime];

			for(var i in day_value.tasks){
				day_value.tasks[i].name = day_value.tasks[i].name.replace(/(^|\W)(#[a-z\d][\w-]*)/ig, '$1<span class="o-hashtag">$2</span>');
			}
		});

	}

	// Days functions
	// ##############

	$scope.changeDays = function(type){
		if(type=="next"){
			
			$scope.days.splice(0,1);
			$scope.days.push(generateDay(moment($scope.days[$scope.days.length-1].date.datetime).add(1,'days')));

		}else if(type=="prev"){
			
			$scope.days.unshift(generateDay(moment($scope.days[0].date.datetime).subtract(1,'days')));
			$scope.days.splice($scope.days.length-1,1);

		}

		setTasksToDays();
	}

	$scope.resetDays = function(){
		setDays();
	}

	// Notes functions
	// ###############

	$scope.saveNote = function(index){
		$scope.saveNoteIsVisible = false;

		Note.update({noteId:$scope.notes[index].id}, {
			content: $scope.selectedNoteText
		});

		$scope.notes[index].content = $scope.selectedNoteText;

	}

	$scope.setSelectedNote = function(index){

		if($scope.selectedNoteText !== undefined){ $scope.saveNote($scope.selectedNote); }

		$scope.selectedNote = index;
		$scope.selectedNoteText = $scope.notes[index].content;

		console.log($scope.notes[index])
	}

	$scope.addNote = function(){

		var _note = new Note();
		_note.name = $scope.addNoteName;
		_note.content = '';
		_note.project_id = $scope.project.id;

		var __note = angular.copy(_note);

		_note.$save(function(data,b){
			__note.id = data.data.id;
			$scope.notes.push(__note);
		});

		$scope.addNoteName = '';
	}

	$scope.deleteNote = function(index){

		Note.delete({noteId: $scope.notes[index].id});
		$scope.notes.splice(index,1);

	}

	// Generate basic dates
	// ####################

	setDays();

	// Get all tasks for dates
	// #######################

	function setTaskIndex(task_value){
		var index = moment(task_value.day).format('YYYY-MM-DD 00:00:00');
		tasks[index] == undefined ? tasks[index] = [] : null;
		tasks[index].push(task_value);			
	}

	Project.query({projectId:$stateParams.projectId}).$promise.then(function(data){
		
		$scope.project = data.data;
		Cache.put("actualProject", data.data);

		Task.query({project_id: $scope.project.id}).$promise.then(function(data){

			angular.forEach(data.data, function(task_value, task_key){

				$scope.projectData.duration += task_value.meta_hours; //taskParser.getTaskMetaData(task_value,'add',$scope.projectData);
				setTaskIndex(task_value);

			});

			setTasksToDays();
			setProjectData();

			$rootScope.$broadcast('loadingComponent.hide');

		});

		Note.query({project_id: $scope.project.id}).$promise.then(function(data){
			$scope.notes = data.data;
			$scope.notes.length > 0 ? $scope.selectedNote = 0 : $scope.selectedNote = null;
			if($scope.notes.length > 0){ $scope.setSelectedNote($scope.selectedNote); }
		});

	});

	// Set project data
	// ################

	function setProjectData(){
		$scope.projectData.showDuration = $scope.projectData.duration;
		$scope.projectData.showDurationDays = moment.duration($scope.projectData.duration, "hours").format("d [days]");
		$scope.projectData.showWorkDurationDays = moment.duration($scope.projectData.duration/(1/3), "hours").format("d");
	}


}]);