angular.module('App')

.directive('ngConfirmClick', [
  function(){
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    }
  }
])

.directive('html', [ function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.html(attrs.html);
    }
  }
}]);

// .directive('ngLeftkeypress', function () {
//     return function (scope, element, attrs) {
//         window.bind("keydown keypress", function (event) {
//             if(event.which === 37) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.ngEnter);
//                 });

//                 event.preventDefault();
//             }
//         });
//     };
// })

// .directive('ngRightkeypress', function () {
//     return function (scope, element, attrs) {
//         window.bind("keydown keypress", function (event) {
//             if(event.which === 39) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.ngEnter);
//                 });

//                 event.preventDefault();
//             }
//         });
//     };
// });