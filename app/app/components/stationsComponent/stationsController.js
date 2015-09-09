angular.module('App')

.controller('stationsController', ['$scope','$rootScope','stationService','boxService','$stateParams','config', function($scope,$rootScope,stationService,boxService,$stateParams,config) {
	
	$scope.config = config;

	var boxId = $stateParams.boxId !== undefined ? $stateParams.boxId : -1;

	if(boxId == -1){
		$scope.readOnly = true;
	}

	var unbindChangeStations = $rootScope.$on('stationsComponent.changeStations',function(e,data){
		$scope.stations = data;
	});

	var unbindDeleteBox = $rootScope.$on('stationsComponent.deleteBox',function(e){
		$rootScope.$broadcast("notificationComponent.sendNotif",{ message: "La boîte a été réinitialisée, vous devez sauvegarder les modifications.", icon: "fa-trash-o"});
		for(var i in $scope.stations){

			if($scope.stations[i].schema != null){
				$rootScope.$broadcast('schemasComponent.droppedSchema',{
					schema_id : $scope.stations[i].schema.id,
						data : {
							delete_station_default : $scope.stations[i].id
						}
					}
				);
			}

			$scope.stations[i].schema = null;
			$scope.stations[i].message = null;

		}
	});

	var unbindBroadcastStations = $rootScope.$on('stationsComponent.broadcastStations',function(e){
		$rootScope.$broadcast("notificationComponent.sendNotif",{ message: "La nouvelle configuration a bien été diffusée aux tablettes.", icon: "fa-paper-plane-o"});
		stationService.editStations($scope.stations);
	});

	var unbindChangeMessage = $rootScope.$on('stationsComponent.changeMessage',function(data){
		for(var i in $scope.stations){
			for(var j in $scope.stations[i].schemas){
				console.log($scope.stations[i].schemas[j].id+" "+data.id)
				if($scope.stations[i].schemas[j].id == data.id){
					$scope.stations[i].schemas[j].message = data.message;
				}
			}
		}
	});

	/* Scope function */

	$scope.showStation = function($index){
		$rootScope.$broadcast('showModal',{
			type: "showStation",
			station: $scope.stations[$index],
			schema: $scope.stations[$index].schema !== undefined ? $scope.stations[$index].schema : null
		});
	};

	$scope.clearStation = function(index){

		var remove = false;
		if($scope.stations[index-1] !== undefined){
			if($scope.stations[index].isClone !== undefined && $scope.stations[index].schema == null){ remove = true; }
		}

		if(remove){ // Delete
			$scope.stations[index-1].isCloned = undefined;
			$scope.stations.splice(index, 1);
		}else{ // Remove schema and message

			if($scope.stations[index].schema != null){

				$rootScope.$broadcast('schemasComponent.droppedSchema',{
					schema_id : $scope.stations[index].schema.id,
						data : {
							delete_station_default : $scope.stations[index].id
						}
					}
				);

				$scope.stations[index].schema = null;
				$scope.stations[index].message = null;
			}
			
		}

	}

	$scope.cloneStation = function(index){
		
		if($scope.stations[index].isClone === undefined && $scope.stations[index].isCloned === undefined){

			$scope.stations[index].isCloned = true;

			var item = {
				id : $scope.stations[index].id,
				schema : null,
				message : null,
				isClone : true,
				role : 'slave'
			};

			$scope.stations.splice(index+1, 0, item);


		}
	}

	$scope.onDropComplete = function(data,event,index){

		var isValid = true;
		if($scope.stations[index-1] !== undefined ){
			if($scope.stations[index-1].schema != null){
				if($scope.stations[index-1].schema.id == data.id && $scope.stations[index-1].id == $scope.stations[index].id){ isValid = false; }
			}
		}

		if($scope.stations[index+1] !== undefined ){
			if($scope.stations[index+1].schema != null){
				if($scope.stations[index+1].schema.id == data.id && $scope.stations[index+1].id == $scope.stations[index].id){ isValid = false; }
			}
		}

		if(isValid){

			var dropData = {};

			if($scope.stations[index].schema != undefined && $scope.stations[index].schema != null){ 
				console.log("IS ANYTHING");
				console.log($scope.stations[index] )
				$scope.clearStation(index);
			}
			
			$scope.stations[index].schema_id = data.id;
			$scope.stations[index].schema = data;

			dropData.add_station_default = $scope.stations[index].id;

			$rootScope.$broadcast('schemasComponent.droppedSchema',{
				schema_id : data.id,
				data : dropData
			});
		}

	};

	$scope.$on('$destroy', function(){
		unbindChangeStations();
		unbindDeleteBox();
		// unbindSaveStations();
		unbindBroadcastStations();
		unbindChangeMessage();
	});

}]);