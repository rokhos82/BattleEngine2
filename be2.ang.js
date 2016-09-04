(function(){
	var app = angular.module("be2",[]);

	// FleetService - This service provides fleet functions and storage.
	app.factory("FleetService",function() {
		var fleets = [];

		return {
			all: function() { return fleets;},
			add: function(f) { fleets.push(f); },
			infoAll: function() {
				var info = [];
				for(var f in fleets) {
					info.push(fleets[f].name);
				}
				return info;
			}
		}
	});

	app.controller("be2MainController",["$scope","FleetService",function($scope,FleetService){
		$scope.states = {
			combat: "combat",
			fleets: "fleets",
			units: "units"
		};
		$scope.state = $scope.states.combat;

		// Where is the git exec for GitHub?

		FleetService.add({
			"name": "The Heavy",
			"empire": "Torr Combine",
			"units": [{
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
			},{
				"unit": {
					"name": "Kaylee Gwenyth",
					"type": "fighter",
					"defense": 45
				}
			}]
		});

		FleetService.add({
			"name": "The Scourge",
			"empire": "Torr Combine",
			"units": [{
				"unit": {
					"name": "Scourge A",
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
			}]
		});


		$scope.fleets = FleetService.all();
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