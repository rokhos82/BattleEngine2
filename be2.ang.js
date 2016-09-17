(function(){
	var app = angular.module("be2",["ui.bootstrap","ngAnimate","ngTouch","ngResource"]);

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
	// be2QueryModal - this is the service object for a generic import modal.
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.service("be2QueryModal",["$uibModal",function($modal) {
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'templates/query-modal.html'
		};

		var modalOptions = {
			headerText: "This is the query modal"
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
	// be2SelectModal - this is the service object for a generic import modal.
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.service("be2SelectModal",["$uibModal",function($modal) {
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'templates/select-modal.html'
		};

		var modalOptions = {
			headerText: "This is the select modal",
			options: ["Option1","Option2"]
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

		// check that the unit is a valid unit -----------------------------------------------------
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

		// Create a unit from a passed dictionary --------------------------------------------------
		var _create = function(dict) {};

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

		// Return the list of units in the data store ----------------------------------------------
		var _getList = function() {
			return data.state.units.list;
		};

		return {
			validate: _validate,
			add: _add,
			exists: _exists,
			get: _getUnit,
			getList: _getList,
			getMultiple: _getMultiple
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// UnitTemplateService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("UnitTemplateService",["UnitService","DataStore",function($be2Units,data) {
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
				"max": 0,
				"current": 0
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
			angular.merge(template,_baseTemplate,dict);
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
			console.log(obj);
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

		_deploy = function(template,name) {
			if(_exists(template) && typeof(name) === "string" && !$be2Units.exists(name)) {
				var temp = {};
				angular.copy(data.state.templates[template],temp);
				temp.unit.name = name;
				temp.unit.template = template;
				$be2Units.add(temp);
			}
			else {
				_logger.error("Unable to deploy unit '" + name + "' from template '" + template + "'.");
			}
		};

		return {
			add: _add,
			create: _create,
			deploy: _deploy,
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
		//var _worker = new WebWorker("be2.combat.js");

		var _eventListener = function(event) {};

		var _start = function(combatants) {
			// Setup combat data.
		};

		/*
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
			var temp = {
				state: {}
			};
			angular.copy($data.state,temp.state);
			worker.postMessage(temp);

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
		};*/

		return {
			start: _start
		};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// StorageService
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.factory("StorageService",["$resource","DataStore",function($resource,data) {
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
		};

		var _export = function() {
			var json = localStorage.getItem(_key);
			console.log(json);
		};

		function cloneState(state,src) {
			// Preserve the original list array
			var arr = state.list;
			
			// Clear out all of the old objects (except the list array)
			for(var s in state) {
				if(s === "list") {
					delete state[s];
				}
			}
			
			// Do a shallow copy of the src object to the state object.
			for(var v in src) {
				state[v] = src[v];
			}
			
			// Clear out the list array and copy in the src list array.
			arr.length = 0;
			for(var i in src.list) {
				arr.push(src.list[i]);
			}

			// Reassign the list array to the state object.
			state.list = arr;
		}

		var _example = function() {
			$resource('examples.json').get(function(d) {
				cloneState(data.state.templates,d.templates);
				cloneState(data.state.units,d.units);
				cloneState(data.state.entities,d.entities);
				cloneState(data.state.fleets,d.fleets);
				cloneState(data.state.factions,d.factions);
			});
		};

		return {
			save: _save,
			load: _load,
			clear: _clear,
			export: _export,
			example: _example
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2MainController - Main controller for BattleEngine2
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2MainController",["$rootScope","$scope","FactionService","FleetService","UnitService","StorageService","DataStore",function($rootScope,$scope,factions,fleets,units,storage,data){
		var ui = data.ui.main;
		ui.states = {
			combat: "combat",
			factions: "factions",
			fleets: "fleets",
			units: "units",
			entities: "entities",
			templates: "templates",
			mothballs: "mothballs",
			logs: "logs"
		};
		ui.state = ui.states.factions;
		$scope.ui = ui;

		this.saveData = storage.save;
		this.loadData = storage.load;
		this.purgeData = storage.clear;
		this.exportData = storage.export;
		this.loadExampleData = function() {
			storage.example();
			$rootScope.$broadcast('be2.init.ui.state');
		};

		this.importData = function() {};

		this.loadData();
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2FactionController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2FactionController",["$rootScope","$scope","FactionService","FleetService","UnitService","DataStore",function($rootScope,$scope,FactionService,FleetService,UnitService,data){
		var ui = data.ui.faction;
		ui.factions = [];
		ui.fleets = {};
		ui.units = {};
		ui.unitCount = 0;
		ui.state = {
			show: {
				factions: {},
				fleets: {}
			}
		};
		ui.activeFleet = {};
		ui.newFaction = {
				name: "",
				description: ""
		};

		var _initState = function() {
			ui.factions = FactionService.getList();
			for(var i in ui.factions) {
				var faction = ui.factions[i];
				var fleets = FactionService.getFleets(faction);
				ui.state.show.factions[faction] = false;
				ui.fleets[faction] = fleets;
				ui.units[faction] = {};
				ui.state.show.fleets[faction] = {};
				for(var f in fleets) {
					var fleet = fleets[f];
					ui.units[faction][fleet] = [];
					ui.state.show.fleets[faction][fleet] = false;
					var units = FleetService.getUnits(fleet);
					ui.units[faction][fleet] = units;
				}
			}
			$scope.ui = ui;			
		};

		this.initState = _initState;

		$rootScope.$on('be2.init.ui.state',function(event,args) {
			_initState();
		});

		$scope.countUnits = function(faction) {
			return _.reduce(ui.units[faction],function(memo,arr){return memo+arr.length;},0);
		};

		this.toggleVisible = function(faction) {
			ui.state.show.factions[faction] = !ui.state.show.factions[faction];			
		};

		this.toggleFleetVisible = function(faction,fleet) {
			ui.state.show.fleets[faction][fleet] = !ui.state.show.fleets[faction][fleet];
		};

		this.showAll = function() {
			for(var i in ui.state.show.factions) {
				ui.state.show.factions[i] = true;
			}
		};

		this.hideAll = function() {
			for(var i in ui.state.show.factions) {
				ui.state.show.factions[i] = false;
			}
		};

		this.showAllFleets = function(faction) {
			for(var f in ui.state.show.fleets[faction]) {
				ui.state.show.fleets[faction][f] = true;
			}
		};

		this.hideAllFleets = function(faction) {
			for(var f in ui.state.show.fleets[faction]) {
				ui.state.show.fleets[faction][f] = false;
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
			ui.state.show.factions[faction] = true;
		};

		this.getFaction = FactionService.get;
		$scope.getMultiple = UnitService.getMultiple;

		// Set the first fleet in the list to active!
		for(var i in ui.factions) {
			var faction = ui.factions[i];
			var fleets = $scope.getFleetList(faction);
			ui.activeFleet[faction] = fleets ? fleets[0] : undefined;
		}

		// Custom Event Handlers -------------------------------------------------------------------
		$rootScope.$on('factionCreated',function(event,data) {
			var faction = data.faction;
			ui.state.show.factions[faction] = true;
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
	app.controller("be2FleetController",["$scope","FactionService","FleetService","UnitService","be2SelectModal","DataStore",function($scope,FactionService,FleetService,UnitService,SelectModal,data){
		var ui = data.ui.fleet;
		ui.fleets = FleetService.getList();
		ui.state = {
			show: {}
		};
		ui.units = {};
		ui.newFleet = {
				name: "",
				description: "",
		};
		$scope.ui = ui;

		// Mappings to Service factories -----------------------------------------------------------
		this.getFleet = FleetService.get;
		$scope.getMultiple = UnitService.getMultiple;

		// UI State Actions ------------------------------------------------------------------------
		this.initState = function() {
			for(var i in ui.fleets) {
				var fleet = ui.fleets[i];
				ui.state.show[fleet] = false;
				ui.units[fleet] = [];
				var units = FleetService.getUnits(fleet);
				ui.units[fleet] = units;
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
		};

		this.attachUnit = function(fleet) {
			var modalOptions = {
				headerText: "Attach Unit",
				queryHelperText: "Select a unit to attach to fleet '" + fleet + "'.",
				queryLabelText: "Units",
				queryButtonText: "Attach",
				options: UnitService.getList()
			};
			SelectModal.showModal({},modalOptions).then(function (result) {
				FleetService.attachUnit(fleet,result);
			});
		};

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
	app.controller("be2CombatController",["$scope","CombatService","DataStore",function($scope,$combat,$data) {
		var ui = {
			combat: $data.combat,
			fleets: $data.state.fleets,
			factions: $data.state.factions
		};

		ui.combat.statuses = [
			"Uninitialized",
			"Initializing Combat",
			"Getting Combatants",
			"Running Combat Simulation",
			"Cleaning Up",
			"Finished"
		];

		ui.combat.max = ui.combat.statuses.length - 1;
		ui.combat.current = 0;
		ui.combat.status = ui.combat.statuses[ui.combat.current];
		ui.combat.progress = Math.ceil(ui.combat.current/ui.combat.max*100);
		
		$scope.ui = ui;

		$scope.startCombat = function() {
			ui.combat.current = 1;
			ui.combat.status = ui.combat.statuses[ui.combat.current];
			ui.combat.progress = Math.ceil(ui.combat.current/ui.combat.max*100);

			setTimeout(doCombat,1000);
		};

		function doCombat() {
			ui.combat.current++;
			ui.combat.progress = Math.ceil(ui.combat.current/ui.combat.max*100);
			ui.combat.status = ui.combat.statuses[ui.combat.current];
			$scope.$apply();

			if(ui.combat.current < ui.combat.max) {
				setTimeout(doCombat,1000);
			}
		}
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2UnitController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2UnitController",["$rootScope","$scope","UnitService","DataStore",function($rootScope,$scope,$be2Units,$be2Data){
		var ui = $be2Data.ui.unit;
		ui.units = $be2Units.getList();
		ui.state = {
			show: {}
		};
		for(var i in ui.units) {
			var unit = ui.units[i];
			ui.state.show[unit] = false;
		}
		$scope.ui = ui;

		// Service Mappings ------------------------------------------------------------------------
		this.getUnitInfo = $be2Units.get;

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

		this.toggleVisible = function(unit) {
			ui.state.show[unit] = !ui.state.show[unit];
		};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2UnitTemplateController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2UnitTemplateController",["$rootScope","$scope","UnitTemplateService","be2ImportModal","be2QueryModal","DataStore",function($rootScope,$scope,$be2Templates,ImportModal,QueryModal,data){
		var ui = data.ui.template;
		ui.templates = $be2Templates.getList();
		ui.state = {
			show: {}
		};
		
		for(var i in ui.templates) {
			var t = ui.templates[i];
			ui.state.show[t] = false;
		}

		$scope.ui = ui;

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
		};

		this.deploy = function(template) {
			var modalOptions = {
				headerText: "Deploy '" + template + "'",
				queryHelperText: "Please enter the name of the unit to be deployed.",
				queryLabelText: "Unit Name",
				queryButtonText: "Deploy",
				queryPlaceholderText: template
			};
			QueryModal.showModal({},modalOptions).then(function (result) {
				$be2Templates.deploy(template,result);
			});
		};


		// Import Modal Functions ------------------------------------------------------------------
		ui.import = function() {
			var modalOptions = {
				importType: "Template"
			};
			ImportModal.showModal({},modalOptions).then(function (result) {
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

	app.directive('mothballPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/mothball-panel.html'
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