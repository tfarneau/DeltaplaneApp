angular.module('App')

.factory('Task', ['config', '$resource',
	function(config,$resource){
		return $resource(
			config.API_URL+'/tasks/:taskId', 
			{taskId:'@id'}, 
			{	
				update: {method: 'PUT', url: config.API_URL+'/tasks/:taskId'},
			    query: {isArray: false}
			});
	}]
);