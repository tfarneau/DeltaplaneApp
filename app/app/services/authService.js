angular.module('App')

.factory('authService', ['$http', '$localStorage', 'config', function ($http, $localStorage, config) {
   function urlBase64Decode(str) {
       var output = str.replace('-', '+').replace('_', '/');
       switch (output.length % 4) {
           case 0:
               break;
           case 2:
               output += '==';
               break;
           case 3:
               output += '=';
               break;
           default:
               throw 'Illegal base64url string!';
       }
       return window.atob(output);
   }

   function getClaimsFromToken() {
       var token = $localStorage.token;
       var user = {};
       if (typeof token !== 'undefined') {
           var encoded = token.split('.')[1];
           user = JSON.parse(urlBase64Decode(encoded));
       }
       return user;
   }

   // var tokenClaims = getClaimsFromToken(); // Uncomment to active auth

   return {
       signin: function (data, success, error) {
          $http.post(config.API_URL + '/users/token', data).success(success).error(error)
       },
       logout: function (success) {
           tokenClaims = {};
           delete $localStorage.token;
           success();
       },
       getTokenClaims: function () {
           return tokenClaims;
       },
       testAuth: function (success,error) {
          $http.get(config.API_URL+"/projects").success(success).error(error);
        }
   };
}]);