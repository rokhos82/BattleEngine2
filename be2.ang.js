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
							_logger.error("Faction name '" + faction.name + "' is on the reserved list.");
							valid = false;
							break;
						}
					}
				}
				else {
					_logger.error("Faction does not have a name.");
					valid = false;
				}

				// Does the faction have an array of fleets (Optional)
				if(typeof(faction.fleets) !== "undefined" && !Array.isArray(faction.fleets)) {
					_logger.error("Faction has a fleet list that is not an array");
					valid = false;
				}
			}
			else {
				valid = false;
				_logger.error("Faction is not a dictionary.");
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
	app.factory("FleetService",["UnitService","DataStore",function(UnitService,data) {
		var _logger = {
			error: function(msg) {if(data.ui.debug){console.log("FleetService: Error - " + msg);}},
			success: function(msg) {if(data.ui.debug){console.log("FleetService: Success - " + msg);}},
			warning: function(msg) {if(data.ui.debug){console.log("FleetService: Warning - " + msg);}}
		};

		// Validate that the object is a proper Fleet object ---------------------------------------
		var _validate = function(fleet) {
			var valid = true;

			// Is the fleet an object and not an array?
			if(typeof(fleet) === "object" && !Array.isArray(fleet)) {
				// Does the fleet have a name?
				if(typeof(fleet.name) === "string") {
					// Is the name in the reserved list.
					for(var i in reservedNames) {
						if(fleet.name === reservedNames[i]) {
							_logger.error("Fleet name '" + fleet.name + "' is on the reserved list.");
							valid = false;
							break;
						}
					}
				}
				else {
					_logger.error("Fleet does not have a name.");
					valid = false;
				}

				// Does the fleet have an array of units (Optional)
				if(typeof(fleet.fleets) !== "undefined" && !Array.isArray(fleet.fleets)) {
					_logger.error("Fleet has a unit list that is not an array");
					valid = false;
				}
			}
			else {
				_logger.error("Fleet is not a dictionary.");
				valid = false;
			}

			return valid;
		};

		// Add a fleet object to the dictionary ----------------------------------------------------
		var _add = function(fleet) {
			if(_validate(fleet) && !_exists(fleet)) {
				data.state.fleets[fleet.name] = fleet;
				var l = data.state.fleets.list.push(fleet.name);
				_logger.success("Added Fleet " + fleet.name + ".  " + l + " fleet(s) currently in system.");
			}
			else {
				_logger.error("Unable to Add Fleet.  Fleet may already exist.");
			}
		};

		// Verify that the fleet exists ------------------------------------------------------------
		var _exists = function(fleet) {
			return (typeof(fleet) === "string" && typeof(data.state.fleets[fleet]) === "object");
		};

		// Return a specific fleet object ----------------------------------------------------------
		var _get = function(fleet) {
			return _exists(fleet) ? data.state.fleets[fleet] : undefined;
		};

		// Attach a unit to a fleet ----------------------------------------------------------------
		var _attachUnit = function(fleet,unit) {
			if(_exists(fleet) && UnitService.exists(unit)) {
				var f = data.state.fleets[fleet];
				if(!Array.isArray(f.units))
					f.units = [];
				f.units.push(unit);
				_logger.success("Attached unit '" + unit + "'' to fleet '" + fleet + "'.");
			}
			else {
				_logger.error("Unable to attach unit to a fleet.  Either the unit or the fleet does not exist.");
			}
		};

		// Get all the units from the passed fleet object ------------------------------------------
		var _getUnits = function(fleet) {
			return data.state.fleets[fleet].units;
		};

		var _getList = function() {
			return data.state.fleets.list;
		};

		return {
			all: function() { return fleets;},
			add: _add,
			attachUnit: _attachUnit,
			exists: _exists,
			get: _get,
			getList: _getList,
			validate: _validate,
			getUnits: _getUnits,
			combatInfo: function() {return {"fleets":fleets,"index":fleetIndex}}
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// UnitService - This service provides unit functions
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("UnitService",["DataStore",function(data) {
		var _logger = {
			error: function(msg) {if(data.ui.debug){console.log("UnitService: Error - " + msg);}},
			success: function(msg) {if(data.ui.debug){console.log("UnitService: Success - " + msg);}},
			warning: function(msg) {if(data.ui.debug){console.log("UnitService: Warning - " + msg);}}
		};

		var _validate = function(obj) {
			var valid = true;
			if(obj.unit) {
				if(!obj.unit.name || !obj.unit.type) {
					_logger.error("Invalid Unit due to no name or type.");
					valid = false;
				}			
			}
			else {
				_logger.error("Invalid Unit due to no unit tag.");
				valid = false;
			}
			return valid;
		}

		// Add a unit object to the dictionary ----------------------------------------------------
		var _add = function(unit) {
			if(_validate(unit) && !_exists(unit.unit.name)) {
				data.state.units[unit.unit.name] = unit;
				var l = data.state.units.list.push(unit.unit.name);
				_logger.success("Added unit " + unit.name + ".  " + l + " unit(s) currently in system.");
			}
			else {
				_logger.error("Unable to Add Fleet.  Fleet may already exist.");
			}
		};

		// Validate that a unit exists -------------------------------------------------------------
		var _exists = function(unit) {
			return (typeof(unit) === "string" && typeof(data.state.units[unit]) === "object");
		};

		// Get a specific unit ---------------------------------------------------------------------
		var _getUnit = function(unit) {
			return _exists(unit) ? data.state.units[unit] : undefined;
		};

		// Get a list of units ---------------------------------------------------------------------
		var _getMultiple = function(list) {
			var arr = [];
			if(Array.isArray(list)) {
				for(var i in list) {
					arr.push(_getUnit(list[i]));
				}
			}
			else {
				_logger.warning("List must be an array");
			}
			return arr;
		};

		return {
			validate: _validate,
			add: _add,
			exists: _exists,
			get: _getUnit,
			getMultiple: _getMultiple
		}
	}]);

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

		var _clear = function() {
			if(typeof(localStorage) !== "undefined") {
				localStorage.removeItem(_key);
			}
			else {
				_logger.warning("Browser does not support localStorage");
			}	
		}

		return {
			save: _save,
			load: _load,
			clear: _clear
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
		
		/*factions.add({"name":"Torr Combine High Command","description":"Combined New Haven/Torr Combine Federate"});
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
		fleets.attachUnit("Machine Ship ZZF1","Machine Ship ZZF1");*/

		this.saveData = storage.save;
		this.loadData = storage.load;
		this.purgeData = storage.clear;

		this.loadData();
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2FactionController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2FactionController",["$scope","FactionService","FleetService","UnitService","DataStore",function($scope,FactionService,FleetService,UnitService,data){
		var ui = data.ui.faction;
		ui.factions = FactionService.getList();
		ui.fleets = {};
		ui.state = {
			show: {}
		};
		ui.activeFleet = {};
		ui.newFaction = {
				name: "",
				description: ""
		};
		$scope.ui = ui;

		this.initState = function() {
			for(var i in ui.factions) {
				var faction = ui.factions[i];
				ui.state.show[faction] = false;
				ui.fleets[faction] = FactionService.getFleets(faction);
			}			
		};

		this.toggleVisible = function(faction) {
			ui.state.show[faction] = !ui.state.show[faction];			
		};

		this.showAll = function() {
			for(var i in ui.state.show) {
				ui.state.show[i] = true;
			}
		};

		this.hideAll = function() {
			for(var i in ui.state.show) {
				ui.state.show[i] = false;
			}
		};

		this.attachFleet = function(faction) {
			var fleet = "1st Vanguard Fleet";
			FleetService.add({"name":fleet,"nickname":"The Heavy","description":"All about the battleships baby!"});
			FactionService.attachFleet(faction,fleet);
			ui.fleets[faction] = FactionService.getFleets(faction);
		};

		this.getFleet = FleetService.get;

		$scope.getFleetList = function(faction) {
			return FactionService.getFleets(faction);
		};

		$scope.activeFleet = function(faction) {
			return ui.activeFleet[faction];
		};

		$scope.setActiveFleet = function(faction,fleet) {
			ui.activeFleet[faction] = fleet;
		};

		$scope.getActiveUnits = function(faction) {
			var fleet = ui.activeFleet[faction];
			var arr = [];
			if(typeof(fleet) === "string") {
				arr = UnitService.getMultiple(FleetService.getUnits(fleet));
			}
			return arr;
		};

		this.closeCreateFaction = function() {
			ui.newFaction.name = "";
			ui.newFaction.description = "";
			$("#factionCreateModal").modal('hide');
		};

		this.createFaction = function() {
			FactionService.add({"name":ui.newFaction.name,"description":ui.newFaction.description});
			this.closeCreateFaction();
		};

		this.getFaction = FactionService.get;

		// Set the first fleet in the list to active!
		for(var i in ui.factions) {
			var faction = ui.factions[i];
			var fleets = $scope.getFleetList(faction);
			ui.activeFleet[faction] = fleets ? fleets[0] : undefined;
		}

		this.initState();
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2FleetController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2FleetController",["$scope","FactionService","FleetService","UnitService","DataStore",function($scope,FactionService,FleetService,UnitService,data){
		var ui = data.ui.fleet;
		ui.fleets = FleetService.getList();
		ui.state = {
			show: {}
		};
		ui.newFleet = {
				name: "",
				description: "",
		};
		$scope.ui = ui;

		// Mappings to Service factories -----------------------------------------------------------
		this.getFleet = FleetService.get;

		// UI State Actions ------------------------------------------------------------------------
		this.initState = function() {
			for(var i in ui.fleets) {
				var fleet = ui.fleets[i];
				ui.state.show[fleet] = false;
			}
		}

		this.showAll = function() {
			for(var i in ui.state.show) {
				ui.state.show[i] = true;
			}
		};

		this.hideAll = function() {
			for(var i in ui.state.show) {
				ui.state.show[i] = false;
			}
		};

		this.toggleVisible = function(fleet) {
			ui.state.show[fleet] = !ui.state.show[fleet];
		}

		// Fleet Creation Functions ----------------------------------------------------------------
		this.closeCreateFleet = function() {
			ui.newFleet.name = "";
			ui.newFleet.description = "";
			$("#fleetCreateModal").modal('hide');
		};

		this.createFleet = function() {
			FleetService.add({"name":ui.newFleet.name,"description":ui.newFleet.description});
			ui.state.show[ui.newFleet.name] = true;
			this.closeCreateFleet();
		};

		// Initialize the ui.state -----------------------------------------------------------------
		this.initState();
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

	////////////////////////////////////////////////////////////////////////////////////////////////
	// HTML Template Directives
	////////////////////////////////////////////////////////////////////////////////////////////////
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

	app.directive('fleetCreatePanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/fleet-create-panel.html'
		};
	});

	app.directive('unitTable',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/unit-table.html'
		};
	});
})();