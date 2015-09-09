angular.module('App')

.controller('calendarController', ['$scope','Project','$stateParams','Task','Cache','taskParser','$rootScope','$state', function($scope,Project,$stateParams,Task,Cache,taskParser,$rootScope,$state) {

    $scope.stateName = $state.$current.self.name;

    $rootScope.$broadcast('loadingComponent.show');

	$scope.project = Cache.get('actualProject');

	var tasks = [];

	function setDaysOpacity(){

        var colorScale = chroma.scale(['#F0F7FC', '#63aeda']).domain([0, 100]);

        var maxTasks = 0;
		var maxHours = 0;

		angular.forEach($scope.weeks, function(week_value, week_key) {
			angular.forEach(week_value.days, function(day_value, day_key) {

                day_value.tasks.length > maxTasks ? maxTasks = parseInt(day_value.tasks.length) : null;

                day_value.hours = 0;
                angular.forEach(day_value.tasks, function(task_value, task_key) {
                    day_value.hours += task_value.meta_hours;
                });
                day_value.hours > maxHours ? maxHours = parseInt(day_value.hours) : null;

			});
		});

		angular.forEach($scope.weeks, function(week_value, week_key) {
			angular.forEach(week_value.days, function(day_value, day_key) {

                day_value.opacityTasks = (1/(maxTasks/parseInt(day_value.tasks.length)))+0.1;
				day_value.hours > 0 ? day_value.opacityHours = (1/(maxHours/parseInt(day_value.hours)))+0.1 : day_value.opacityHours = 0;

                var val = parseInt(day_value.hours)/8*100;
                day_value.hoursVal = val;
                
                day_value.backgroundColor = colorScale(val).hex();
                day_value.opacity = val/100;

            });
		});		

	}

	function setTasksToDays(){

		angular.forEach($scope.weeks, function(week_value, week_key) {

			angular.forEach(week_value.days, function(day_value, day_key) {

				var index = day_value.date.format('YYYY-MM-DD 00:00:00');
				tasks[index] == undefined ? tasks[index] = [] : null;
				day_value.tasks = tasks[index];

			});

		});

		setDaysOpacity();

	}

	function setTaskIndex(task_value){
		var index = moment(task_value.day).format('YYYY-MM-DD 00:00:00');
		tasks[index] == undefined ? tasks[index] = [] : null;
		tasks[index].push(task_value);			
	}

	// Project
	// #######

	Project.query({projectId:$stateParams.projectId}).$promise.then(function(data){

		$scope.project = data.data;
		Cache.put("actualProject", data.data);

		Task.query({project_id: $scope.project.id}).$promise.then(function(data){

			angular.forEach(data.data, function(task_value, task_key){
				setTaskIndex(task_value);
			});

			setTasksToDays();

            $rootScope.$broadcast('loadingComponent.hide');

		});

	});

    // Color
    // #####

    var hsv2rgb = function(h, s, v) {
      var rgb, i, data = [];
      if (s === 0) {
        rgb = [v,v,v];
      } else {
        h = h / 60;
        i = Math.floor(h);
        data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
        switch(i) {
          case 0:
            rgb = [v, data[2], data[0]];
            break;
          case 1:
            rgb = [data[1], v, data[0]];
            break;
          case 2:
            rgb = [data[0], v, data[2]];
            break;
          case 3:
            rgb = [data[0], data[1], v];
            break;
          case 4:
            rgb = [data[2], data[0], v];
            break;
          default:
            rgb = [v, data[0], data[1]];
            break;
        }
      }
      return '#' + rgb.map(function(x){
        return ("0" + Math.round(x*255).toString(16)).slice(-2);
      }).join('');
    };

	// Calendar
	// ########

	$scope.day = moment();

	$scope.selected = moment();
    $scope.month = $scope.selected.clone();

    var start = $scope.selected.clone();
    start.date(1);
    _removeTime(start.day(0));

    _buildMonth($scope, start, $scope.month);

    $scope.selectDay = function(day) {
        $scope.selected = day.date;  
    };

    $scope.nextMonth = function() {
        var next = $scope.month.clone();
        _removeTime(next.month(next.month()+1).date(1));
        $scope.month.month($scope.month.month()+1);
        _buildMonth($scope, next, $scope.month);
        setTasksToDays();
    };

    $scope.previousMonth = function() {
        var previous = $scope.month.clone();
        _removeTime(previous.month(previous.month()-1).date(1));
        $scope.month.month($scope.month.month()-1);
        _buildMonth($scope, previous, $scope.month);
        setTasksToDays();
    };

    function _removeTime(date) {
        return date.day(0).hour(0).minute(0).second(0).millisecond(0);
    }

    function _buildMonth(scope, start, month) {
        scope.weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            scope.weeks.push({ days: _buildWeek(date.clone(), month) });
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
    }

    function _buildWeek(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                date: date
            });
            date = date.clone();
            date.add(1, "d");
        }
        return days;
    }


}]);