angular.module('App')

.controller('loginController', ['$scope','$rootScope','authService','$localStorage','$location','$state', function($scope,$rootScope,authService,$localStorage,$location,$state) {
	
	authService.testAuth(
		function(res){
			$state.go('projects');
		},
		function(){
			console.log("User is not auth");
		}
	);

	$scope.doLogin = function(event){

		event.preventDefault();

		var error = null;

		if($scope.loginForm !== undefined){
			if($scope.loginForm.name === undefined || $scope.loginForm.name.length <= 1){ error = "Remplissez l'identifiant pour vous connecter."; }
			if($scope.loginForm.password === undefined || $scope.loginForm.password.length <= 1){ error = "Renseignez un mot de passe pour vous connecter."; }
		}else{
			error = "Remplissez l'identifiant et le mot de passe pour vous connecter.";
			$scope.loginForm = {};
		}

		if(error === null){

			$scope.loginForm.alert = false;
			console.log("Processing signin");

			var authData = {
				username : $scope.loginForm.name,
				password : $scope.loginForm.password
			};

			authService.signin(authData, 
				function(res){
					$localStorage.token = res.data.token;
					$location.path('/projects');
				},
				function (res) {
               		$scope.loginForm.alert = "Identifiants incorrects.";
           		}
           	);

		}else{
			$scope.loginForm.alert = error;
		}
	};

}]);