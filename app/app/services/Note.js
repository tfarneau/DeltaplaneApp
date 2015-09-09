angular.module('App')

.factory('Note', ['config', '$resource',
	function(config,$resource){
		return $resource(
			config.API_URL+'/notes/:noteId', 
			{noteId:'@id'}, 
			{	
				update: {method: 'PUT', url: config.API_URL+'/notes/:noteId'},
			    query: {isArray: false}
			});
	}]
);