(function(){
	var app = angular.module("be2",[]);

	app.controller("be2MainController",["$scope",function($scope){
		$scope.states = {
			combat: "combat",
			fleets: "fleets",
			units: "units"
		};
		$scope.state = $scope.states.units;
		$scope.udl = "{name: \"\"}";

		var units = [];
		$scope.units = units;
		// Some example units
		units.push({
			"name": "GTVA Wasp",
			"type": "fighter",
			"beam": 1,
			"missile": 4,
			"shield": 0,
			"hull": 1
		});
	}]);

	app.directive('unitPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/unit-panel.html'
		};
	});

	app.directive('fleetPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/fleet-panel.html'
		};
	});
})();