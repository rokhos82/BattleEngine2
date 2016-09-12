(function(){
	var app = angular.module("be2",["ui.bootstrap","ngAnimate","ngTouch"]);

	var reservedNames = ["factions","factions","factionIndex","fleet","fleets","fleetIndex","list"];

	////////////////////////////////////////////////////////////////////////////////////////////////
	// ImportModal - this is the service object for a generic import modal.
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.service("be2ImportModal",["$uibModal",function($modal) {
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'templates/import-modal.html'
		};

		var modalOptions = {
			importType: "something"
		};

		this.showModal = function(customModalDefaults,customModalOptions) {
			if (!customModalDefaults) customModalDefaults = {};
			customModalDefaults.backdrop = 'static';
			return this.show(customModalDefaults,customModalOptions);
		};

		this.show = function(customModalDefaults,customModalOptions) {
			var tempModalDefaults = {};
			var tempModalOptions = {};

			angular.extend(tempModalDefaults,modalDefaults,customModalDefaults);
			angular.extend(tempModalOptions,modalOptions,customModalOptions);

			if(!tempModalDefaults.controller) {
				tempModalDefaults.controller = function($scope,$uibModalInstance) {
					$scope.modalOptions = tempModalOptions;
					$scope.modalOptions.ok = function(result) {
						$uibModalInstance.close(result);
					};
					$scope.modalOptions.close = function(result) {
						$uibModalInstance.dismiss('cancel');
					};
				}
			}

			return $modal.open(tempModalDefaults).result;
		};
	}]);

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

		// Creates a new faction from a dictionary on elements -------------------------------------
		var _create = function(elements) {
			var faction = {
				name: "",
				description: "",
				fleets: [],
				enemies: []
			};

			for(var e in elements) {
				faction[e] = elements[e];
			}

			_add(faction);
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

		// Detach fleet from a faction -------------------------------------------------------------
		var _detachFleet = function(faction,fleet) {
			if(_exists(faction) && FleetService.exists(fleet)) {
				var i = data.state.factions[faction].fleets.indexOf(fleet);
				data.state.factions[faction].fleets.splice(i,1);
			}
			else {
				_logger.error("Unable to detach fleet from a faction.  Either the fleet or the faction does not exist.");
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
			create: _create,
			detachFleet: _detachFleet,
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

		// Create a fleet from a give dictionary of elements ---------------------------------------
		var _create = function(elements) {
			var fleet = {
				name: "",
				nickname: "",
				description: "",
				units: []
			};

			for(var e in elements) {
				fleet[e] = elements[e];
			}

			_add(fleet);
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
			create: _create,
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
	// UnitTemplateService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("UnitTemplateService",["DataStore",function(data) {
		var _logger = {
			error: function(msg,caller) {if(data.ui.debug){console.log("UnitTemplateService: Error - " + msg);}},
			success: function(msg,caller) {if(data.ui.debug){console.log("UnitTemplateService: Success - " + msg);}},
			warning: function(msg,caller) {if(data.ui.debug){console.log("UnitTemplateService: Warning - " + msg);}}
		};

		var _baseTemplate = {
			unit: {
				name: "",
				id: "",
				type: ""
			},
			hull: {
				"base": 0,
				"max": 0
			},
			shield: {
				"max": 0
			},
			"direct-fire": [],
			"packet-fire": []
		};

		var _add = function(obj) {
			// Is it unique and valid
			if(_validate(obj) && !_exists(obj.unit.name)) {
				data.state.templates[obj.unit.name] = obj;
				data.state.templates.list.push(obj.unit.name);
				_logger.success("Added template '" + obj.unit.name + "'.");
			}
			else {
				_logger.error("Unable to add template.  Either template is invalid or already exists.");
			}
		};

		var _create = function(dict) {
			var template = {};
			/*for(var d in dict) {
				if(typeof(dict[d] === "object")) {
					angular.extend(template[d],_baseTemplate[d],dict[d]);
				}
				else {
					template[d] = dict[d];
				}
			}//*/
			angular.extend(template,_baseTemplate,dict);
			_add(template);
		};

		var _exists = function(name) {
			return (typeof(name) === "string" && typeof(data.state.templates[name]) === "object");
		};

		var _get = function(name) {
			return _exists(name) ? data.state.templates[name] : undefined;
		};

		var _getList = function() {
			return data.state.templates.list;
		};

		var _validate = function(obj) {
			var valid = true;
			// Is there a 'unit' component
			if(typeof(obj.unit) === "object") {
				// Is there a 'name' element and is it a non-empty string
				if(typeof(obj.unit.name) !== "string" || (obj.unit.name.length == 0)) {
					_logger.error("Template has no name.");
					valid = false;
				}

				// Is there a 'type' element and is it a non-empty string
				if(typeof(obj.unit.type) !== "string" || (obj.unit.type.length == 0)) {
					_logger.error("Template has no type.");
					valid = false;
				}

				// Is the name not in the restricted list
				for(var i in reservedNames) {
					if(!valid) {
						break;
					}
					if(obj.unit.name === reservedNames[i]) {
						_logger.error("The template name is in the restricted names list.");
						valid = false;
						break;
					}
				}
			}
			else {
				_logger.error("Template has no 'unit' component.");
				valid = false;
			}

			// Is the a 'hull' component
			if(typeof(obj.hull) === "object" && valid) {
				// Is there a 'base' element and is it non-zero
				if(typeof(obj.hull.base) !== "number" || (obj.hull.base == 0)) {
					_logger.error("Template has no base hull.");
					valid = false;
				}

				// Is there a 'max' element and is it non-zero
				if(typeof(obj.hull.max) !== "number" || (obj.hull.max == 0)) {
					_logger.error("Template has no max hull.")
					valid = false;
				}
			}
			else {
				_logger.error("Template has no 'hull' component.");
				valid = false;
			}

			if(valid)
				_logger.success("Template is valid.");

			return valid;
		};

		return {
			add: _add,
			create: _create,
			exists: _exists,
			get: _get,
			getList: _getList,
			validate: _validate
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
					_logger.success("Data loaded from localStorage.");
				}
				else {
					_logger.warning("No data in localStorage.")
				}
			}
			else {
				_logger.warning("Browser does not support localStorage.");
			}
		};

		var _save = function() {
			if(typeof(localStorage) !== "undefined") {
				var json = JSON.stringify(data.state);
				localStorage.setItem(_key,json);
				_logger.success("Data stored in localStorage.");
			}
			else {
				_logger.warning("Browser does not support localStorage.");
			}
		};

		var _clear = function() {
			if(typeof(localStorage) !== "undefined") {
				localStorage.removeItem(_key);
				_logger.warning("Data was purged from localStorage.");
			}
			else {
				_logger.warning("Browser does not support localStorage.");
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
	app.controller("be2FactionController",["$rootScope","$scope","FactionService","FleetService","UnitService","DataStore",function($rootScope,$scope,FactionService,FleetService,UnitService,data){
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

		this.detachFleet = function(faction,fleet) {
			if(confirm("Do you wish to detach this fleet?")) {
				FactionService.detachFleet(faction,fleet);
			}
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

		this.createFaction = function() {
			var faction = ui.newFaction.name;
			FactionService.add({"name":faction,"description":ui.newFaction.description,"fleets":[]});
			this.closeCreateFaction();
			ui.fleets[faction] = FactionService.getFleets(faction);
			ui.state.show[faction] = true;
		};

		this.getFaction = FactionService.get;

		// Set the first fleet in the list to active!
		for(var i in ui.factions) {
			var faction = ui.factions[i];
			var fleets = $scope.getFleetList(faction);
			ui.activeFleet[faction] = fleets ? fleets[0] : undefined;
		}

		// Custom Event Handlers -------------------------------------------------------------------
		$rootScope.$on('factionCreated',function(event,data) {
			var faction = data.faction;
			ui.state.show[faction] = true;
			ui.fleets[faction] = $scope.getFleetList(faction);
		});

		this.initState();
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2CreateFactionController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2CreateFactionController",["$rootScope","$scope","FactionService","DataStore",function($rootScope,$scope,FactionService,data) {
		var ui = {
			name: "",
			description: "",
			modal: $("#factionCreateModal")
		};

		$scope.ui = ui;

		// Eventer handler for show the modal ------------------------------------------------------
		ui.modal.on('show.bs.modal',function(event) {
			ui.name = "";
			ui.description = "";
			$scope.$apply();
		});

		$scope.create = function() {
			var name = $('#inputFactionName').val();
			var description = $('#inputFactionDescription').val();
			FactionService.create({"name":name,"description":description});
			ui.modal.modal('hide');
			$rootScope.$broadcast("factionCreated",{faction:name});
		};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2AttachFleetController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2AttachFleetController",["$scope","FactionService","FleetService","DataStore",function($scope,FactionService,FleetService,data) {
		var ui = {
			faction: "",
			fleets: [],
			modal: $("#attachFleetModal")
		};
		
		$scope.ui = ui;

		// Event handler for showing the modal -----------------------------------------------------
		ui.modal.on('show.bs.modal',function(event) {
			var button = $(event.relatedTarget);
			var faction = button.data('faction');
			ui.faction = faction;
			ui.fleets = FleetService.getList();
			$scope.$apply();
		});

		// Attach the fleet to the faction ---------------------------------------------------------
		$scope.attach = function() {
			var faction = ui.faction;
			var fleet = $("#attachFleetName").val();
			FactionService.attachFleet(faction,fleet);
			ui.modal.modal('hide');
		};
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
	// be2CreateFleetController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2CreateFleetController",["$scope","FleetService","DataStore",function($scope,FleetService,data) {
		var ui = {
			name: "",
			nickname: "",
			description: "",
			modal: $("#fleetCreateModal")
		};

		$scope.ui = ui;

		// Eventer handler for show the modal ------------------------------------------------------
		ui.modal.on('show.bs.modal',function(event) {
			ui.name = "";
			ui.nickname = "";
			ui.description = "";
			$scope.$apply();
		});

		$scope.create = function() {
			var name = $('#inputFleetName').val();
			var nickname = $('#inputFleetNickname').val();
			var description = $('#inputFleetDescription').val();
			FleetService.create({"name":name,"nickname":nickname,"description":description});
			ui.modal.modal('hide');
		};
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
	// be2UnitTemplateController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2UnitTemplateController",["$rootScope","$scope","UnitTemplateService","be2ImportModal","DataStore",function($rootScope,$scope,$be2Templates,ImportModal,data){
		var ui = data.ui.template;
		ui.state = {
			templates: $be2Templates.getList(),
			show: {}
		};
		$scope.ui = ui;

		$scope.hash = function(key) {
			return key.replace(" ","");
		};

		for(var template in ui.state.templates) {
			ui.state.show[template] = false;
		}

		// Service Mappings ------------------------------------------------------------------------
		this.getTemplateInfo = $be2Templates.get;

		// UI State Actions ------------------------------------------------------------------------
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

		this.toggleVisible = function(template) {
			ui.state.show[template] = !ui.state.show[template];
		}

		// Import Modal Functions ------------------------------------------------------------------
		ui.import = function() {
			var modalOptions = {
				importType: "Template"
			};
			console.log("Showing import modal");
			ImportModal.showModal({},modalOptions).then(function (result) {
				console.log(result);
				$be2Templates.create(JSON.parse(result));
			});
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
			transclude: true,
			replace: true,
			scope: true,
			controller: "be2CreateFactionController",
			templateUrl: 'templates/faction-create-panel.html'
		};
	});

	app.directive('fleetCreatePanel',function() {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: true,
			controller: "be2CreateFleetController",
			templateUrl: 'templates/fleet-create-panel.html'
		};
	});

	app.directive('unitTable',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/unit-table.html'
		};
	});

	app.directive('attachFleetModal',function() {
		return {
			restrict: 'E',
			transclude: true,
			replace: true,
			scope: true,
			controller: "be2AttachFleetController",
			templateUrl: "templates/attach-fleet-modal.html"
		}
	});
})();