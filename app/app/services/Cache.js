angular.module('App')

.factory('Cache', ['$cacheFactory', function($cacheFactory) {
	return $cacheFactory('mainCache');
}]);