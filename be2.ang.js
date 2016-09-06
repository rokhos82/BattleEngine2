(function(){
	var app = angular.module("be2",[]);

	// FleetService - This service provides fleet functions and storage.
	app.factory("FleetService",["UnitService",function(UnitService) {
		var fleets = [];
		var fleetNameIndex = {};

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
			if(_validate(fleet)) {
				var l = fleets.push(fleet);
				fleetNameIndex[fleet.name] = l-1;
			}
		};

		var _addUnit = function(name,unit) {
			var i = fleetNameIndex[name];
			var fleet = fleets[i];
			var success = false;
			if(UnitService.validate(unit)) {
				success = true;
				fleet.units.push(unit);
			}
		}

		return {
			all: function() { return fleets;},
			add: _add,
			validate: _validate,
			combatInfo: function() {return {"fleets":fleets,"index":fleetNameIndex}}
		}
	}]);

	// UnitService - This service provides unit functions.
	app.factory("UnitService",function() {
		var unitLibrary = {};

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

		var _stringify = function(obj) {
			var str = null;
			if(_validate(obj)) {
				str = JSON.stringify(obj);
			}
			return str;
		};

		var _add = function(_unit) {
			if(typeof(_unit) == "object" && _validate(_unit)) {
			}
			else if (typeof(_unit) == "string") {
				var obj = _stringify(_unit);
			}
			else {
				console.log("Unknown Unit format when adding to unit library.");
			}
		}

		return {
			validate: _validate,
			parse: _parse,
			stringify: _stringify,
			add: _add
		}
	});

	// PlayerService

	// CombatService - 
	app.factory("CombatService",["$q",function($q) {
		var _worker = undefined;
	}]);

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
			"enemy": "The Scourge",
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
			"enemy": "The Heavy",
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
			},{
				"unit": {
					"name": "Scourge C",
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
					"name": "Scourge D",
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

	app.controller("be2CombatController",["$scope","FleetService","UnitService",function($scope,FleetService,UnitService) {
		$scope.combat = {
			status: "uninitiated",
			log: "Combat results will be posted here!"
		};

		function workerCallback(event) {
			$scope.combat.log += event.data.log;
			if(event.data.done)
				$scope.combat.status = "finished";
			$scope.$apply();
		}

		this.startCombat = function() {
			$scope.combat.status = "started";
			$scope.combat.log = "";

			var worker = new Worker("be2.combat.js");

			worker.addEventListener("message",workerCallback,false);
			worker.postMessage(FleetService.combatInfo());

			$scope.worker = worker;
		};

		this.stopCombat = function() {
			$scope.combat.status = "stopped";

			$scope.worker.terminate();
			$scope.worker = undefined;
		};

		this.resetCombat = function() {
			$scope.combat.status = "uninitiated";
			$scope.combat.log = "";
		};
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