(function() {
	"use strict";

	// Load libraries for the worker thread.
	self.importScripts("js/underscore.js");
	self.importScripts("be2.combat.help.js");

	function buildTargetLists(obj) {
		if(!_.isObject(obj.units) || _.isArray(obj.units) || _.isString(obj.units))
			obj.units = {};

		// Create attacker target list
		obj.units.attackers = _.chain(obj.attackers)
			.map(function(ele){return _.values(this.fleets[ele].units);},obj.state)
			.flatten()
			.filter(function(unit){ return !_.contains(obj.status.destroyed,unit.uuid); })
			.pluck("uuid")
			.value();

		// Create defender target list
		obj.units.defenders = _.chain(obj.defenders)
			.map(function(ele){return _.values(this.fleets[ele].units);},obj.state)
			.flatten()
			.filter(function(unit){ return !_.contains(obj.status.destroyed,unit.uuid); })
			.pluck("uuid")
			.value();
	}

	function initializeCombatState(initialState) {
		// Setup the state object
		var state = initialState;

		// Build Target Lists
		buildTargetLists(state);

		// Setup event queue for round actions
		state.queue = [];

		// Check for tags that need to be processed on turn 0.

		// Return a deep copy of the state object.
		return state;
	}

	function doCombat(event) {
		// Initialize Combat State
		var state = initializeCombatState(event.data);

		// Do Combat Rounds

		// Cleanup Combat State, etc.
	}

	self.addEventListener('message',doCombat,false);

	/*function doRound(event) {
		var data = event.data;

		simulator.initialize(data);

		var round = {
			uuid: data.uuid,
			units: {},
			status: {
				fleeing: [],
				fled: [],
				destroyed: data.status.destroyed ? data.status.destroyed : [],
				finished: false,
				round: data.status.round + 1,
			},
			attackers: data.attackers,
			defenders: data.defenders,
			state: data.state,
			specials: []
		};
		
		_.each(data.attackers,function(uuid,index,list){
			var fleet = data.state.fleets[uuid];
			_.chain(fleet.units).each(function(unit,key,list){
				var lhits = simulator.fireLongWeapons(unit,data.units.defenders);
				var nhits = simulator.fireWeapons(unit,data.units.defenders);

				var hits = _.union(lhits,nhits);
				round.units[key] = {
					"hits": hits,
					"damage": []
				};
			});
		});
		
		_.each(data.defenders,function(uuid,index,list){
			var fleet = data.state.fleets[uuid];
			_.chain(fleet.units).each(function(unit,key,list){
				var lhits = simulator.fireLongWeapons(unit,data.units.attackers);
				var nhits = simulator.fireWeapons(unit,data.units.attackers);

				var hits = _.union(lhits,nhits);
				round.units[key] = {
					"hits": hits,
					"damage": []
				};
			});
		});

		_.each(round.units,function(unit,key) {
			_.each(unit.hits,function(hit){
				var damage = simulator.resolveHit(hit,key,data.state.units);
				//round.units[hit.target].damage.push(damage);
			});
		});

		_.each(round.state.units,simulator.combatCleanup,round);

		simulator.endOfCombat(round);
		
		self.postMessage(round);
	}

	self.addEventListener('message',doRound,false);*/
})();