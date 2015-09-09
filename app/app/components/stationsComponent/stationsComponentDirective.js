angular.module('App')

.directive('stationsComponent', [function() {
    return {
        restrict: 'A',
        templateUrl: 'components/stationsComponent/stationsComponent.html'
    };
}]);