(function(){
	var app = angular.module("be2",[]);

	var reservedNames = ["factions","factions","factionIndex","fleet","fleets","fleetIndex","list"];

	////////////////////////////////////////////////////////////////////////////////////////////////
	// DataStore - this is the main data store for the entire application.
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("DataStore",[function() {
		var _data = {
			state: {
				factions: {
					list: []
				},
				fleets: {
					list: []
				},
				units: {
					list: []
				},
				templates: {
					list: []
				},
				entities: {
					list: []
				}
			},
			ui: {
				faction: {},
				fleet: {},
				unit: {},
				template: {},
				entity: {},
				main: {},
				debug: true
			},
			combat: {}
		};

		return _data;
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// FactionService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("FactionService",["FleetService","DataStore",function(FleetService,data) {
		var factions = [];
		var factionIndex = {};
		var _errorHeader = "FactionService: Error - ";
		var _successHeader = "FactionService: Success - ";
		var _logger = {
			error: function(msg) {if(data.ui.debug){console.log("FactionService: Error - " + msg);}},
			success: function(msg) {if(data.ui.debug){console.log("FactionService: Success - " + msg);}},
			warning: function(msg) {if(data.ui.debug){console.log("FactionService: Warning - " + msg);}}
		};

		// Validate that the passed object is a proper Faction object ------------------------------
		var _validate = function(faction) {
			var valid = true;

			// Is the faction an object and not an array?
			if(typeof(faction) === "object" && !Array.isArray(faction)){
				// Does the faction have a name
				if(typeof(faction.name) === "string") {
					// Is the name in the reserved list?
					for(var i in reservedNames) {
						if(faction.name === reservedNames[i]) {
							_logger.error("Faction name '" + faction.name + "' is on the reserved list");
							valid = false;
							break;
						}
					}
				}
				else {
					valid = false;
				}

				// Does the faction have an array of fleets
				if(typeof(faction.fleets) !== "undefined" && !Array.isArray(faction.fleets)) {
					_logger.error("Faction has a fleet list that is not an array");
					valid = false;
				}
			}
			else {
				valid = false;
				_logger.error("Faction is not an dictionary");
			}

			// Return the valid flag.
			return valid;
		};

		// Adds a Faction to the array -------------------------------------------------------------
		var _add = function(faction) {
			if(_validate(faction) && !_exists(faction)) {
				data.state.factions[faction.name] = faction;
				var l = data.state.factions.list.push(faction.name);
				_logger.success("Added Faction " + faction.name + ".  " + l + " faction(s) currently in system.");
			}
			else {
				_logger.error("Unable to Add Faction.  Faction may already exist.");
			}
		};

		// Return true if the faction exists -------------------------------------------------------
		var _exists = function(faction) {
			return (typeof(faction) === "string" && typeof(data.state.factions[faction]) === "object");
		};

		// Attach an existing fleet to an existing faction -----------------------------------------
		var _attachFleet = function(faction,fleet) {
			if(_exists(faction) && FleetService.exists(fleet)) {
				var f = data.state.factions[faction];
				if(!Array.isArray(f.fleets))
					f.fleets = [];
				f.fleets.push(fleet);
				_logger.success("Attached fleet '" + fleet + "'' to faction '" + faction + "'.");
			}
			else {
				_logger.error("Unable to attach fleet to a faction.  Either the fleet or the faction does not exist.");
			}
		};

		// Get a list of fleets assigned to a faction ----------------------------------------------
		var _getFleets = function(faction) {
			return data.state.factions[faction].fleets;
		};

		// Get a list of factions ------------------------------------------------------------------
		var _getList = function() {
			return data.state.factions.list;
		};

		// Get a specific faction ------------------------------------------------------------------
		var _get = function(faction) {
			return _exists(faction) ? data.state.factions[faction] : undefined;
		};

		// Remove a faction ------------------------------------------------------------------------
		var _remove = function(faction) {
			if(_exists(faction)) {
				console.log("Removing " + faction);
				var i = factionIndex[faction];
				delete factions[i];
				_buildIndex();
			}
		}

		return {
			add: _add,
			attachFleet: _attachFleet,
			get: _get,
			getFleets: _getFleets,
			getList: _getList,
			validate: _validate,
			remove: _remove
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

		// Attach a unit to a fleet ----------------------------------------------------------------
		var _attachUnit = function(fleet,unit) {
			if(_exists(fleet) && UnitService.exists(unit)) {
				var f = fleetIndex[fleet];
				var fleet = fleets[f];
				var unit = UnitService.getUnit(unit);
				if(!Array.isArray(fleet.units))
					fleet.units = [];
				if(typeof(fleet.unitIndex) != "object")
					fleet.unitIndex = {};
				var l = fleet.units.push(unit);
				fleet.unitIndex[unit.unit.name] = l - 1;
			}
		};

		// Get all the units from the passed fleet object ------------------------------------------
		var _getUnits = function(fleet) {
			return fleet.units;
		};

		return {
			all: function() { return fleets;},
			add: _add,
			attachUnit: _attachUnit,
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
		var units = [];
		var unitIndex = {};
		var _errorHeader = "UnitService: Error - ";
		var _successHeader = "UnitService: Success - ";

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
			if(_validate(_unit)) {
				var l = units.push(_unit);
				unitIndex[_unit.unit.name] = l - 1;
				console.log(_successHeader + "Loaded unit " + _unit.unit.name);
			}
		}

		// Validate that a unit exists -------------------------------------------------------------
		var _exists = function(unit) {
			return (typeof(unit) == "string" && typeof(unitIndex[unit]) == "number");
		};

		// Get a specific unit ---------------------------------------------------------------------
		var _getUnit = function(unit) {
			return _exists(unit) ? units[unitIndex[unit]] : undefined;
		};

		return {
			validate: _validate,
			parse: _parse,
			stringify: _stringify,
			add: _add,
			exists: _exists,
			getUnit: _getUnit
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
	// StorageService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("StorageService",["DataStore",function(data) {
		var _key = "be2.datastore";
		var _logger = {
			error: function(msg) { console.log("StorageService: Error - " + msg); },
			success: function(msg) { console.log("StorageService: Success - " + msg); },
			warning: function(msg) { console.log("StorageService: Warning - " + msg); }
		};

		var _load = function() {
			if(typeof(localStorage) !== "undefined") {
				var json = localStorage.getItem(_key);
				if(typeof(json) === "string") {
					data.state = JSON.parse(json);
				}
				else {
					_logger.warning("No data in localStorage")
				}
			}
			else {
				_logger.warning("Browser does not support localStorage");
			}
		};

		var _save = function() {
			if(typeof(localStorage) !== "undefined") {
				var json = JSON.stringify(data.state);
				localStorage.setItem(_key,json);
			}
			else {
				_logger.warning("Browser does not support localStorage");
			}
		};

		return {
			save: _save,
			load: _load
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2MainController - Main controller for BattleEngine2
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2MainController",["$scope","FactionService","FleetService","UnitService","StorageService","DataStore",function($scope,factions,fleets,units,storage,data){
		var ui = data.ui.main;
		ui.states = {
			combat: "combat",
			factions: "factions",
			fleets: "fleets",
			units: "units",
			entities: "entities",
			templates: "templates"
		};
		ui.state = ui.states.factions;
		$scope.ui = ui;
		
		factions.add({"name":"Torr Combine High Command","description":"Combined New Haven/Torr Combine Federate"});
		factions.add({"name":"Ancient Machine Race","description":"Horrible Threat!"});
		
		fleets.add({"name":"The Heavy","empire":"Torr Combine"});
		fleets.add({"name":"The Scourge","empire":"New Haven Commmonwealth"});
		factions.attachFleet("Torr Combine High Command","The Heavy");
		factions.attachFleet("Torr Combine High Command","The Scourge");
		
		fleets.add({"name":"Machine Planetoid BG12ZK","empire":"Ancient Machine Race"});
		fleets.add({"name":"Machine Ship ZZF1","empire":"Ancient Machine Race"});
		factions.attachFleet("Ancient Machine Race","Machine Planetoid BG12ZK");
		factions.attachFleet("Ancient Machine Race","Machine Ship ZZF1")

		units.add({"unit": {"name": "Emma Rose","type": "Starship","defense": 30},"hull": {"base": 20,"max": 1200},"shield": {"max": 60},"direct-fire": [],"packet-fire": []});
		units.add({"unit": {"name": "Iron Maiden","type": "Starship","defense": 30},"hull": {"base": 20,"max": 1200},"shield": {"max": 60},"direct-fire": [],"packet-fire": []});
		units.add({"unit": {"name": "Jagermeister","type": "Starship","defense": 30},"hull": {"base": 10,"max": 15},"shield": {"max": 30},"direct-fire": [],"packet-fire": []});
		units.add({"unit": {"name": "Machine Planetoid BG12ZK","type": "Base","defense": 30},"hull": {"base": 10,"max": 1200},"shield": {"max": 60},"direct-fire": [],"packet-fire": []});
		units.add({"unit": {"name": "Machine Ship ZZF1","type": "Starship","defense": 30},"hull": {"base": 100,"max": 1200},"shield": {"max": 60},"direct-fire": [],"packet-fire": []});
		
		fleets.attachUnit("The Heavy","Emma Rose");
		fleets.attachUnit("The Heavy","Iron Maiden");
		fleets.attachUnit("The Scourge","Jagermeister");
		fleets.attachUnit("Machine Planetoid BG12ZK","Machine Planetoid BG12ZK");
		fleets.attachUnit("Machine Ship ZZF1","Machine Ship ZZF1");

		this.saveData = storage.save;
		this.loadData = storage.load;
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2FactionController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2FactionController",["$scope","FactionService","FleetService",function($scope,FactionService,FleetService){
		$scope.ui = {
			factions: [],
			newFaction: {
				name: "",
				description: ""
			}
		};

		this.initFactions = function() {
			var factions = FactionService.getList();
			$scope.ui.factions = [];
			for(var i in factions) {
				var _fleets = FactionService.getFleets(factions[i]);
				var obj = {
					name: factions[i],
					fleets: _fleets,
					activeFleet: _fleets[0]
				};
				$scope.ui.factions.push(obj);
			}
		}

		this.getUnits = function(faction) {
			var fleet = FleetService.getFleet($scope.ui.factions[faction].activeFleet);
			return typeof(fleet) == "undefined" ? [] : fleet.units;
		};

		this.closeCreateFaction = function() {
			$scope.ui.newFaction.name = "";
			$scope.ui.newFaction.description = "";
			$("#factionCreateModal").modal('hide');
		};

		this.createFaction = function() {
			FactionService.add({"name":$scope.ui.newFaction.name,"description":$scope.ui.newFaction.description});
			console.log($scope.ui.newFaction.name);
			console.log($scope.ui.newFaction.description);
			this.closeCreateFaction();
			this.initFactions();
		};

		this.removeFaction = function(i) {
			var faction = $scope.ui.factions[i];
			FactionService.remove(faction.name);
			this.initFactions();
		};

		this.initFactions();
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

	app.directive('entityPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/entity-panel.html'
		};
	});

	app.directive('templatePanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/template-panel.html'
		};
	});

	app.directive('factionCreatePanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/faction-create-panel.html'
		};
	});
})();