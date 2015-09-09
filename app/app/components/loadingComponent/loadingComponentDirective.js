angular.module('App')

.directive('loadingComponent', [function() {
    return {
        restrict: 'A',
        templateUrl: 'components/loadingComponent/loading.html'
    };
}]);