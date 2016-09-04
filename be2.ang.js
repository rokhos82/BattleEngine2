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

		var fleets = {};
		$scope.fleets = fleets;
		
		var theHeavy = {};
		theHeavy.name = "The Heavy";
		theHeavy.units = [{
			"unit": {
				"name": "Emma Rose",
				"type": "starship",
				"defense": 15
			},
			"hull": {
				"base": 3,
				"max": 5
			},
			"shield": {
				"max": 1
			},
			"direct-fire": [{
				"volley": 4,
				"target": 15
			}]
		}];

		var theScourge = {};
		theScourge.name = "The Scourge";
		theScourge["Scourge A"] = {
			"unit": {
				"type": "starship",
				"defense": 15
			},
			"hull": {
				"base": 1,
				"max": 3
			},
			"direct-fire": [{
				"volley": 3,
				"target": 15
			}],
			"fire-packet": [{
				"packet": 2,
				"size": 1,
				"ammo": 1
			}]
		};

		$scope.fleets["The Heavy"] = theHeavy;
		//$scope.fleets["The Scourge"] = theScourge;
	}]);

	app.controller("be2CombatController",["$scope",function($scope){
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

	app.directive('combatPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/combat-panel.html'
		};
	});
})();