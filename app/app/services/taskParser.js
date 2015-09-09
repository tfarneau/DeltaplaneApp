angular.module('App')

.factory('taskParser', ['config', 
	function (config) {

		function getDuration(str){

			var pattDuration1 = new RegExp(/(-( |)[0-9]+( |)(hour(s|)|h(|s|rs)))/g);
			var pattDuration2 = new RegExp(/([0-9]+)/g);
			var resDuration1 = pattDuration1.exec(str);
			var resDuration2 = pattDuration2.exec(resDuration1);

			var taskDuration = resDuration2 != null ? parseInt(resDuration2[0]) : 0;
			return parseInt(taskDuration);
		}

	    return {
	       getTaskMetaData: function(task_value,operation,projectdata){

	       		if(projectdata.duration === undefined){ projectdata.duration = 0; }

				// Test duration
				var taskDuration = getDuration(task_value.name);

				if(operation == 'remove'){
					projectdata.duration -= taskDuration;
				}else{
					projectdata.duration += taskDuration;
				}

				return projectdata;

		   },
		   getDuration: function(str){
		   		return getDuration(str);
		   }
		}
	}]
);