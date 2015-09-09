angular.module('App')

.directive('notificationComponent', [function() {
    return {
        restrict: 'A',
        templateUrl: 'components/notificationComponent/notificationComponent.html'
    };
}]);