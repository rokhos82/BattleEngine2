(function(){
	var app = angular.module("be2",[]);

	var reservedNames = ["factions","factions","factionIndex","fleet","fleets","fleetIndex"];

	////////////////////////////////////////////////////////////////////////////////////////////////
	// FactionService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("FactionService",["FleetService",function(FleetService) {
		var factions = [];
		var factionIndex = {};
		var _errorHeader = "FactionService: Error - ";
		var _successHeader = "FactionService: Success - ";

		// Validate that the passed object is a proper Faction object ------------------------------
		var _validate = function(faction) {
			var valid = true;

			// Does the faction have a name?
			if(typeof(faction.name) != "string") {
				console.log(_errorHeader + "Faction does not have a valid name entry.");
				valid = false;
			}
			else {
				// Check against the list of reserved faction names
				for(var i in reservedNames) {
					if(faction.name === reservedNames[i]) {
						valid = false;
						console.log(_errorHeader + "Faction name is in the reserved list.");
						break;
					}
				}
			}

			// Does the faction of an array of fleets (Optional)
			if(typeof(faction.fleets) != "array" && typeof(faction.fleets) != "undefined") {
				console.log(_errorHeader + "Faction has an improper fleets entry.  The fleets entry must be absent or an Array.");
				valid = false;
			}

			// Return the valid flag.
			return valid;
		};

		// Adds a Faction to the array -------------------------------------------------------------
		var _add = function(faction) {
			if(_validate(faction)) {
				var l = factions.push(faction);
				factionIndex[faction.name] = l-1;
				console.log(_successHeader + "Successfully add faction: " + faction.name);
			}
			else {
				console.log(_errorHeader + "Unable to add faction.  See previous errors.");
			}
		};

		// Add a fleet to a given faction name -----------------------------------------------------
		var _addFleet = function(faction,fleet) {
			if(typeof(factionIndex[faction]) == "number") {
				var i = factionIndex[faction];
				if(Array.isArray(fleet)) {
					for(var i in fleet) {
						var obj = FleetService.add(fleet[i]);
					}
				}
				else if(typeof(fleet) == "object") {
					var obj = FleetService.add(fleet);
				}
				else {}
			}
			else {
				console.log(_errorHeader + "Faction '" + faction + "' does not exist");
			}
		};

		// Load factions from a JSON string --------------------------------------------------------
		var _simpleLoad = function(jsonStr) {
			var obj = JSON.parse(jsonStr);

			for(var i in obj) {
				var faction = obj[i];
				_add(faction);
			}
		};

		// Load deep faction information from a JSON string ----------------------------------------
		var _deepLoad = function(jsonStr) {
		};

		// Return top level factions object --------------------------------------------------------
		var _all = function() {
			return factions;
		};

		// Return true if the faction exists -------------------------------------------------------
		var _exists = function(faction) {
			return (typeof(faction) == "string" && typeof(factionIndex[faction]) == "number");
		};

		// Attach an existing fleet to an existing faction -----------------------------------------
		var _attachFleet = function(faction,fleet) {
			if(_exists(faction) && FleetService.exists(fleet)) {
				var i = factionIndex[faction];
				var faction = factions[i];
				var fleet = FleetService.getFleet(fleet);
				if(!Array.isArray(faction.fleets))
					faction.fleets = [];
				if(typeof(faction.fleetIndex) != "object")
					faction.fleetIndex = {};
				var l = faction.fleets.push(fleet);
				faction.fleetIndex[fleet.name] = l - 1;
			}
			else {
				console.log(_errorHeader + "Unable to attach fleet to a faction.  Either the fleet or the faction does not exist.");
			}
		};

		// Get a list of fleets assigned to a faction ----------------------------------------------
		var _getFactionFleets = function(faction) {
			var fleets = [];
			if(_exists(faction)) {
				var faction = factions[factionIndex[faction]];
				for(var i in faction.fleetIndex) {
					fleets.push(i);
				}
			}
			return fleets;
		};

		// Get a list of factions ------------------------------------------------------------------
		var _getFactionList = function() {
			var arr = [];
			for(var i in factionIndex) {
				arr.push(i);
			}
			return arr;
		};

		// Get a specific faction ------------------------------------------------------------------
		var _getFaction = function(faction) {
			return _exists(faction) ? factions[factionIndex[faction]] : undefined;
		};

			return {
			add: _add,
			addFleet: _addFleet,
			attachFleet: _attachFleet,
			getFaction: _getFaction,
			getFactionFleets: _getFactionFleets,
			getFactionList: _getFactionList,
			validate: _validate,
			load: _simpleLoad,
			loadFactionsInfo: _deepLoad,
			all: _all
		};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// FleetService - This service provides fleet functions and storage
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("FleetService",["UnitService",function(UnitService) {
		var fleets = [];
		var fleetIndex = {};
		var _errorHeader = "FleetService: Error - ";
		var _successHeader = "FleetService: Success - ";

		// Validate that the object is a proper Fleet object ---------------------------------------
		var _validate = function(obj) {
			var valid = true;

			if(typeof(obj.name) != "string") {
				console.log(_errorHeader + "Fleet does not have a proper name entry");
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

		// Add a fleet object to the dictionary ----------------------------------------------------
		var _add = function(fleet) {
			var ret = undefined;
			if(_validate(fleet)) {
				var l = fleets.push(fleet);
				fleetIndex[fleet.name] = l-1;
				ret = fleet;
				console.log(_successHeader + "Loaded fleet " + fleet.name);
			}
			return ret;
		};

		// Add a unit to the specific fleet --------------------------------------------------------
		var _addUnit = function(name,unit) {
			var i = fleetIndex[name];
			var fleet = fleets[i];
			var success = false;
			if(UnitService.validate(unit)) {
				success = true;
				fleet.units.push(unit);
			}
		}

		// Load basic fleet info from a JSON string ------------------------------------------------
		var _simpleLoad = function(jsonStr) {
			var obj = JSON.parse(jsonStr);
			return _add(obj);
		};

		// Verify that the fleet exists ------------------------------------------------------------
		var _exists = function(fleet) {
			return (typeof(fleet) == "string" && typeof(fleetIndex[fleet]) == "number");
		};

		// Return a specific fleet object ----------------------------------------------------------
		var _getFleet = function(fleet) {
			return _exists(fleet) ? fleets[fleetIndex[fleet]] : undefined;
		};

		return {
			all: function() { return fleets;},
			add: _add,
			exists: _exists,
			getFleet: _getFleet,
			validate: _validate,
			load: _simpleLoad,
			combatInfo: function() {return {"fleets":fleets,"index":fleetIndex}}
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// UnitService - This service provides unit functions
	////////////////////////////////////////////////////////////////////////////////////////////////
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

	////////////////////////////////////////////////////////////////////////////////////////////////
	// PlayerService
	////////////////////////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////////////////////////
	// CombatService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("CombatService",["$q",function($q) {
		var _worker = undefined;
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2MainController - Main controller for BattleEngine2
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2MainController",["$scope","FactionService","FleetService","UnitService",function($scope,factions,fleets,units){
		$scope.states = {
			combat: "combat",
			factions: "factions",
			fleets: "fleets",
			units: "units"
		};
		$scope.state = $scope.states.factions;
		
		factions.load("[{\"name\":\"Torr Combine High Command\"},{\"name\":\"Ancient Machine Race\"}]");
		fleets.add({"name":"The Heavy","empire":"Torr Combine"});
		fleets.add({"name":"The Scourge","empire":"New Haven Commmonwealth"});
		factions.attachFleet("Torr Combine High Command","The Heavy");
		factions.attachFleet("Torr Combine High Command","The Scourge");
		fleets.add({"name":"Machine Planetoid BG12ZK","empire":"Ancient Machine Race"});
		fleets.add({"name":"Machine Ship ZZF1","empire":"Ancient Machine Race"});
		factions.attachFleet("Ancient Machine Race","Machine Planetoid BG12ZK");
		factions.attachFleet("Ancient Machine Race","Machine Ship ZZF1")

		$scope.fleets = fleets.all();
		$scope.factions = factions.all();
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2FactionController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2FactionController",["$scope","FactionService",function($scope,FactionService){
		$scope.ui = {
			factions: []
		};

		var factions = FactionService.getFactionList();
		for(var i in factions) {
			var _fleets = FactionService.getFactionFleets(factions[i]);
			var obj = {
				name: factions[i],
				fleets: _fleets,
				activeFleet: _fleets[0]
			};
			$scope.ui.factions.push(obj);
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2CombatController - Combat controller for BattleEngine2
	////////////////////////////////////////////////////////////////////////////////////////////////
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

	app.directive('factionPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/faction-panel.html'
		};
	});
})();