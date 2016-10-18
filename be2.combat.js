(function() {
	"use strict";

	// Load libraries for the worker thread.
	self.importScripts("js/underscore.js");
	self.importScripts("be2.combat.help.js");

	function doRound(event) {
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
				round: data.status.round + 1
			},
			attackers: data.attackers,
			defenders: data.defenders,
			state: data.state
		};
		
		_.each(data.attackers,function(uuid,index,list){
			var fleet = data.state.fleets[uuid];
			_.chain(fleet.units).each(function(unit,key,list){
				var hits = simulator.fireWeapons(unit,data.units.defenders);
				round.units[key] = {
					"hits": hits,
					"damage": []
				};
			});
		});
		
		_.each(data.defenders,function(uuid,index,list){
			var fleet = data.state.fleets[uuid];
			_.chain(fleet.units).each(function(unit,key,list){
				var hits = simulator.fireWeapons(unit,data.units.attackers);
				round.units[key] = {
					"hits": hits,
					"damage": []
				};
			});
		});

		_.each(round.units,function(unit,key) {
			_.each(unit.hits,function(hit){
				var damage = simulator.resolveHit(hit,key,data.state.units);
				round.units[hit.target].damage.push(damage);
			});
		});

		_.each(round.state.units,simulator.combatCleanup,round);

		simulator.endOfCombat(round);
		
		self.postMessage(round);
	}

	self.addEventListener('message',doRound,false);
})();