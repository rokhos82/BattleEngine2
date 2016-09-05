(function(){
	var app = angular.module("be2",[]);

	// FleetService - This service provides fleet functions and storage.
	app.factory("FleetService",["UnitService",function(UnitService) {
		var fleets = [];

		var _validate = function(obj) {
			var valid = true;

			if(!obj.name) {
				console.log("Invalid Fleet because of no name entered.");
				valid = false;
			}

			for(x in obj.units) {
				if(!UnitService.validate(obj.units[x])) {
					console.log("Invalid Fleet because of unit.");
					valid = false;
				}
			}

			return valid;
		};

		var _add = function(fleet) {
			if(_validate(fleet))
				fleets.push(fleet);
		}

		return {
			all: function() { return fleets;},
			add: _add,
			validate: _validate
		}
	}]);

	//UnitService - This service provides unit functions.
	app.factory("UnitService",function() {
		var unit = {};

		var _validate = function(obj) {
			var valid = true;
			if(obj.unit) {
				if(!obj.unit.name || !obj.unit.type) {
					console.log("Invalid Unit due to no name or type.");
					valid = false;
				}			
			}
			else {
				console.log("Invalid Unit due to no unit tag.");
				valid = false;
			}

			return valid;
		}

		var _parse = function(jsonStr) {
			var obj = JSON.parse(jsonStr);
			if(_validate(obj)) {
				obj = null;
			}
			return obj;
		};

		return {
			validate: _validate,
			parse: _parse
		}
	});

	// be2MainController - Main controller for BattleEngine2.
	app.controller("be2MainController",["$scope","FleetService","UnitService",function($scope,FleetService,UnitService){
		$scope.states = {
			combat: "combat",
			fleets: "fleets",
			units: "units"
		};
		$scope.state = $scope.states.combat;

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
			},{
				"unit": {
					"name": "Scourge B",
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