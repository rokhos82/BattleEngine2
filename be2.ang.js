(function(){
	var app = angular.module("be2",["ui.bootstrap","ngAnimate","ngTouch","ngResource","gg.editableText"]);

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
	// be2MultiModal - this is the service object for a generic import modal.
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.service("be2MultiModal",["$uibModal",function($modal) {
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'templates/multi-modal.html'
		};

		var modalOptions = {
			headerText: "This is the select modal",
			options: [{key:1,checked:false,label:"Checkbox 1"},{key:2,checked:false,label:"Checkbox 2"}]
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
					$scope.modalOptions.ok = function() {
						$uibModalInstance.close(_.filter(tempModalOptions.options,function(option){return option.checked;}));
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
	// be2InfoModal - this is the service object for a generic import modal.
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.service("be2InfoModal",["$uibModal",function($modal) {
		var modalDefaults = {
			backdrop: true,
			keyboard: true,
			modalFade: true,
			templateUrl: 'templates/info-modal.html'
		};

		var modalOptions = {
			headerText: "This is the information modal",
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

		var _factionDefaults = {
			"fleets": {},
			"enemies": {},
			"name": "",
			"description": "",
			"notes": ""
		};

		// Creates a new faction from a dictionary on elements -------------------------------------
		var _create = function(elements) {
			var faction = angular.copy(_factionDefaults);
			angular.merge(faction,elements);
			_add(faction);
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
				if(typeof(faction.fleets) !== "object") {
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
				var id = window.uuid.v4();
				data.state.factions[id] = faction;
				faction.uuid = id;
				var l = data.state.factions.list.push(id);
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
				f.fleets[fleet] = data.state.fleets[fleet];
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
			return _exists(faction) ? data.state.factions[faction].fleets : undefined;
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
				_logger.warning("Removing faction '" + faction + "'");
				delete data.state.factions[faction];
				var i = data.state.factions.list.indexOf(faction);
				data.state.factions.list.splice(i,1);
			}
		};

		// Purge all factions from the data store --------------------------------------------------
		var _purge = function() {
			data.state.factions.list.length = 0;
			data.state.factions = {};
			data.state.factions.list = [];
		};

		return {
			add: _add,
			attachFleet: _attachFleet,
			create: _create,
			detachFleet: _detachFleet,
			get: _get,
			getFleets: _getFleets,
			getList: _getList,
			validate: _validate,
			remove: _remove,
			purge: _purge
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
				var id = window.uuid.v4();
				fleet.uuid = id;
				data.state.fleets[id] = fleet;
				var l = data.state.fleets.list.push(id);
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
				orders: "",
				notes: "",
				units: {}
			};

			angular.merge(fleet,elements);

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
				var u = data.state.units[unit];
				if(!_.isObject(f.units)) {
					f.units = {};
				}
				f.units[unit] = u;
				_logger.success("Attached unit '" + u.unit.name + "'' to fleet '" + f.name + "'.");
			}
			else {
				_logger.error("Unable to attach unit to a fleet.  Either the unit or the fleet does not exist.");
			}
		};

		// Get all the units from the passed fleet object ------------------------------------------
		var _getUnits = function(fleet) {
			return _exists(fleet) ? data.state.fleets[fleet].units : undefined;
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
				var id = window.uuid.v4();
				unit.uuid = id;
				data.state.units[id] = unit;
				var l = data.state.units.list.push(id);
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
				_logger.warning("Unit list must be an array");
			}
			return arr;
		};

		// Return the list of units in the data store ----------------------------------------------
		var _getList = function() {
			return data.state.units.list;
		};

		var _getOptions = function() {
			return _.chain(data.state.units.list).map(function(uuid){
				return {"key":uuid,"label":this[uuid].unit.name,"group":this[uuid].unit.type};
			},data.state.units).value();
		};

		return {
			validate: _validate,
			add: _add,
			exists: _exists,
			get: _getUnit,
			getList: _getList,
			getMultiple: _getMultiple,
			getOptions: _getOptions
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
			"unit": {
				"name": "",
				"id": "",
				"type": ""
			},
			"hull": {
				"max": 0,
				"current": 0
			},
			"shield": {
				"max": 0
			},
			"direct-fire": [],
			"packet-fire": []
		};

		// Adds a unit template object to the program state ----------------------------------------
		var _add = function(obj) {
			// Is it unique and valid
			if(_validate(obj) && !_exists(obj.unit.name)) {
				var id = window.uuid.v4();
				obj.uuid = id;
				data.state.templates[id] = obj;
				data.state.templates.list.push(id);
				_logger.success("Added template '" + obj.unit.name + "' " + id + ".");
			}
			else {
				_logger.error("Unable to add template.  Either template is invalid or already exists.");
			}
		};

		// Creates and adds a unit template object to the program state ----------------------------
		var _create = function(dict) {
			var template = angular.copy(_baseTemplate);
			angular.merge(template,dict);
			_add(template);
		};

		// Checks to see if the template exists ----------------------------------------------------
		var _exists = function(name) {
			return (typeof(name) === "string" && typeof(data.state.templates[name]) === "object");
		};

		// Returns the template object from the program state --------------------------------------
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
				if(typeof(obj.unit.size) !== "number" || (obj.unit.size == 0)) {
					_logger.error("Template has no base hull.");
					valid = false;
				}

				// Is there a 'max' element and is it non-zero
				if(typeof(obj.hull.max) !== "number" || (obj.hull.max == 0)) {
					_logger.error("Template has no max hull.");
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
			if(_exists(template) && typeof(name) === "string") {
				var temp = {};
				angular.copy(data.state.templates[template],temp);
				temp.unit.name = name;
				temp.template = data.state.templates[template];
				temp.hull.current = temp.hull.max;
				temp.shield.current = temp.shield.max;
				$be2Units.add(temp);
			}
			else {
				_logger.error("Unable to deploy unit '" + name + "' from template '" + template + "'.");
			}
		};

		_massDeploy = function(template,name,count) {
			for(var i = 1;i <= count;i++) {
				var n = name + i;
				_deploy(template,n);
			}
		};

		var _updateTemplates = function() {
			for(var t in data.state.templates) {
				if(t === "list") {
					continue;
				}
				var temp = angular.copy(_baseTemplate);
				angular.merge(temp,data.state.templates[t]);
				data.state.templates[t] = temp;
			}
		};

		return {
			add: _add,
			create: _create,
			deploy: _deploy,
			exists: _exists,
			get: _get,
			getList: _getList,
			massDeploy: _massDeploy,
			validate: _validate,
			update: _updateTemplates
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
					var flat = JSON.parse(json);
					data.state = _expand(flat);
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
				var dat = _flatten(data.state);
				var json = JSON.stringify(dat);
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

		// This function expands the stored arrays back into the nested object references ----------
		var _expand = function(flat) {
			_.map(flat.factions,function(value){value.fleets = _.mapObject(value.fleets,function(value,key){return this[key];},flat.fleets);});
			flat.factions.list = _.keys(flat.factions);
			_.map(flat.fleets,function(value){value.units = _.mapObject(value.units,function(value,key){return this[key];},flat.units)});
			flat.fleets.list = _.keys(flat.fleets);
			_.map(flat.units,function(value,key){value.template = this[value.template];},flat.templates);
			flat.units.list = _.keys(flat.units);
			return flat;
		};

		// This function flattens the data structure into arrays for storage -----------------------
		var _flatten = function(dat) {
			var dat = angular.copy(dat);
			delete dat.factions.list;
			_.map(dat.factions,function(faction,key){ if(key !== "list"){ _.mapObject(faction.fleets,function(faction,key){ return key; }); } });
			delete dat.fleets.list;
			_.map(dat.fleets,function(fleet,key){ if(key !== "list"){ _.mapObject(fleet.units,function(unit,uuid){ return uuid; }); } });
			delete dat.units.list;
			_.map(dat.units,function(unit){ if(_.isObject(unit.template)){ unit.template = unit.template.uuid; } });
			return dat;
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
	app.controller("be2MainController",["$rootScope","$scope","$window","FactionService","FleetService","UnitService","UnitTemplateService","StorageService","DataStore",function($rootScope,$scope,$window,factions,fleets,units,$templates,storage,data){
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
			$templates.update();
			$rootScope.$broadcast('be2.init.ui.state');
		};

		this.importData = function() {};

		this.loadData();

		this.dataDump = function() {
			console.log(data);
		};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2FactionController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2FactionController",["$rootScope","$scope","FactionService","FleetService","UnitService","DataStore","be2InfoModal",function($rootScope,$scope,FactionService,FleetService,UnitService,data,infoModal){
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

		ui.data = data.state;
		this.data = data.state;
		this.purge = function() {
			if(confirm("Do you wish to purge all faction information?")) {
				FactionService.purge();
				_initState();
			}
		};
		this.remove = function(faction) {
			if(confirm("Do you want to remove '" + data.state.factions[faction] + "'?")) {
				FactionService.remove(faction);
				_initState();
			}
		};

		_.each(ui.factions,function(key){
			this[key] = false;
			console.log(key);
			_.each(ui.fleets[key],function(f){
				console.log(f);
			},ui.state.show.fleets);
		},ui.state.show.factions);

		var _initState = function() {
			ui.factions = FactionService.getList();
			for(var i in ui.factions) {
				var faction = ui.factions[i];
				var fleets = FactionService.getFleets(faction);
				//ui.state.show.factions[faction] = false;
				ui.fleets[faction] = fleets;
				ui.units[faction] = {};
				ui.state.show.fleets[faction] = {};
				for(var f in fleets) {
					var fleet = fleets[f];
					ui.units[faction][fleet.uuid] = [];
					//ui.state.show.fleets[faction][fleet.uuid] = false;
					var units = FleetService.getUnits(fleet.uuid);
					ui.units[faction][fleet.uuid] = units;
				}
			}
			$scope.ui = ui;			
		};

		this.initState = _initState;

		$scope.$watch('ui.data.factions',this.initState,true);

		$rootScope.$on('be2.init.ui.state',function(event,args) {
			_initState();
		});

		this.fleetInfo = function(fleet) {
			return {
				unitCount: _.keys(fleet.units).length
			};
		};

		this.countFleets = function(faction) {
			return _.keys(ui.fleets[faction]).length;
		};

		$scope.countUnits = function(faction) {
			return _.chain(ui.fleets[faction]).map(function(fleet){return _.keys(fleet.units).length;}).reduce(function(memo,count){return memo + count;},0).value();
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

		ui.export = function() {
			var modalOptions = {
				headerText: "Factions Export",
				infoText: btoa(JSON.stringify(data.state.factions)),
				infoTextPlain: JSON.stringify(data.state.factions)
			};
			infoModal.showModal({},modalOptions).then(function (result) {});
		};

		this.editable = false;
		this.toggleEdit = function() {
			this.editable = !this.editable;
		};
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

		ui.data = data.state;
		
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
	app.controller("be2FleetController",["$scope","FactionService","FleetService","UnitService","be2SelectModal","DataStore","be2InfoModal","be2MultiModal",function($scope,FactionService,FleetService,UnitService,SelectModal,data,infoModal,multiModal){
		var ui = data.ui.fleet;
		ui.fleets = FleetService.getList();
		ui.state = {
			show: {}
		};
		ui.data = data.state;
		ui.units = {};
		ui.newFleet = {
				name: "",
				description: ""
		};
		$scope.ui = ui;

		_.chain(ui.fleets).each(function(key){ this[key] = false; },ui.state.show);

		this.data = data.state;

		// Mappings to Service factories -----------------------------------------------------------
		this.getFleet = FleetService.get;
		$scope.getMultiple = UnitService.getMultiple;

		// UI State Actions ------------------------------------------------------------------------
		this.initState = function() {
			for(var i in ui.fleets) {
				var fleet = ui.fleets[i];
				ui.units[fleet] = data.state.fleets[fleet].units;
			}
		}

		$scope.$watch('ui.data.fleets',this.initState,true);

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
				queryHelperText: "Select a unit to attach to fleet '" + data.state.fleets[fleet].name + "'.",
				queryLabelText: "Units",
				queryButtonText: "Attach",
				options: UnitService.getOptions()
			};
			SelectModal.showModal({},modalOptions).then(function (result) {
				FleetService.attachUnit(fleet,result);
			});
		};

		this.attachUnitMass = function(fleet) {
			var modalOptions = {
				headerText: "Attach Units",
				queryHelperText: "Select the units to attach to fleet '" + data.state.fleets[fleet].name + "'.",
				queryButtonText: "Attach",
				options:UnitService.getOptions()
			};
			_.each(modalOptions.options,function(element){ element.checked=false; });
			multiModal.showModal({},modalOptions).then(function (result) {
				_.map(result,function(option){FleetService.attachUnit(fleet,option.key)});
			})
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
		//this.initState();

		ui.export = function() {
			var modalOptions = {
				headerText: "Factions Export",
				infoText: btoa(JSON.stringify(data.state.fleets)),
				infoTextPlain: JSON.stringify(data.state.fleets)
			};
			infoModal.showModal({},modalOptions).then(function (result) {});
		};

		this.editable = false;
		this.toggleEdit = function() { this.editable = !this.editable; console.log(this.editable); };

		this.countUnits = function(fleet) { return _.keys(ui.units[fleet]).length;}
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
	app.controller("be2CombatController",["$scope","CombatService","DataStore",function($scope,$combat,data) {
		var ui = {
			combat: data.combat,
			fleets: data.state.fleets,
			factions: data.state.factions
		};

		ui.combat.statuses = [
			"Uninitialized",
			"Initializing Combat",
			"Getting Combatants",
			"Running Combat Simulation",
			"Cleaning Up",
			"Finished"
		];

		this.timeout = undefined;
		this.webworker = undefined;

		ui.combat.max = ui.combat.statuses.length - 1;
		ui.combat.current = 0;
		ui.combat.status = ui.combat.statuses[ui.combat.current];
		ui.combat.progress = Math.ceil(ui.combat.current/ui.combat.max*100);
		ui.combat.paused = false;
		
		$scope.ui = ui;

		this.startCombat = function() {
			this.webworker = new Worker("be2.combat.js");
			this.webworker.onmessage = function(event) {
				console.log(event.data);
			};
			this.webworker.postMessage(data.state);
		};

		this.stopCombat = function() {};

		this.pauseCombat = function() {};

		this.resetCombat = function() {};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2UnitController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2UnitController",["$rootScope","$scope","UnitService","DataStore","be2InfoModal",function($rootScope,$scope,$be2Units,$be2Data,$infoModal){
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

		this.data = $be2Data.state;

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

		ui.export = function() {
			var modalOptions = {
				headerText: "Factions Export",
				infoText: btoa(JSON.stringify($be2Data.state.units)),
				infoTextPlain: JSON.stringify($be2Data.state.units)
			};
			$infoModal.showModal({},modalOptions).then(function (result) {});
		};
	}]);

	////////////////////////////////////////////////////////////////////////////////////////////////
	// be2UnitTemplateController
	////////////////////////////////////////////////////////////////////////////////////////////////
	app.controller("be2UnitTemplateController",["$rootScope","$scope","UnitTemplateService","be2ImportModal","be2QueryModal","DataStore","be2InfoModal",function($rootScope,$scope,$be2Templates,ImportModal,QueryModal,data,infoModal){
		var ui = data.ui.template;
		ui.templates = $be2Templates.getList();
		ui.state = {
			show: {}
		};

		this.data = data.state;
		
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

		this.massDeploy = function(template) {
			var modalOptions = {
				headerText: "Deploy '" + template + "'",
				queryHelperText: "Please enter the name of the unit to be deployed.",
				queryLabelText: "Unit Name",
				queryButtonText: "Deploy",
				queryPlaceholderText: template
			};
			QueryModal.showModal({},modalOptions).then(function (result) {
				var count = prompt("How many to deploy?");
				$be2Templates.massDeploy(template,result,count);
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

		ui.export = function() {
			var modalOptions = {
				headerText: "Factions Export",
				infoText: btoa(JSON.stringify(data.state.units)),
				infoTextPlain: JSON.stringify(data.state.units)
			};
			infoModal.showModal({},modalOptions).then(function (result) {});
		};

		// Test functions --------------------------------------------------------------------------
		this.test = function() {
			var arrExpandTest = {
				"factions":{
					"FX001":{"uuid":"FX001","fleets":{"FL001":"FL001","FL003":"FL003"}},
					"FX002":{"uuid":"FX002","fleets":{"FL002":"FL002","FL004":"FL004","FL005":"Fl005"}}
				},
				"fleets": {
					"FL001":{"uuid":"FL001","units":{"U000":"U000","U003":"U003"}},
					"FL002":{"uuid":"FL002","units":{"U002":"U002"}},
					"FL003":{"uuid":"FL003","units":{"U004":"U004"}},
					"FL004":{"uuid":"FL004","units":{"U007":"U007"}},
					"FL005":{"uuid":"FL005","units":{"U001":"U001"}}
				},
				"units": {
					"U000":{"uuid":"U000","template":"T000"},
					"U001":{"uuid":"U001","template":"T001"},
					"U002":{"uuid":"U002","template":"T000"},
					"U003":{"uuid":"U003","template":"T002"},
					"U004":{"uuid":"U004","template":"T002"},
					"U005":{"uuid":"U005","template":"T001"},
					"U006":{"uuid":"U006","template":"T000"},
					"U007":{"uuid":"U007","template":"T002"},
					"U008":{"uuid":"U008","template":"T001"}
				},
				"templates": {
					"T000":{"uuid":"T000"},
					"T001":{"uuid":"T001"},
					"T002":{"uuid":"T002"},
					"T003":{"uuid":"T003"}
				}
			};

			_.map(arrExpandTest.factions,function(value){value.fleets = _.mapObject(value.fleets,function(value,key){return this[key];},arrExpandTest.fleets);});
			_.map(arrExpandTest.fleets,function(value){value.units = _.mapObject(value.units,function(value,key){return this[key];},arrExpandTest.units)});
			_.map(arrExpandTest.units,function(value,key){value.template = this[value.template];},arrExpandTest.templates);

			console.log(arrExpandTest);
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