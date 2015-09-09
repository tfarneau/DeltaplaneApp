angular.module('App')

.factory('Project', ['config', '$resource',
	function(config,$resource){
		return $resource(
			config.API_URL+'/projects/:projectId', 
			{projectId:'@id'}, 
			{
			    query: {
			        isArray: false
			    }
			});
	}]
);