(function() {
	"use strict";

	// Load libraries for the worker thread.
	self.importScripts("js/underscore.js");
	self.importScripts("be2.combat.help.js");

	function doRound(event) {
		var data = event.data;

		simulator.initialize(data);

		/*var attackers = data.fleets[data.fleets.list[0]];
		var defenders = data.fleets[data.fleets.list[1]];

		attackers.targets = defenders.units;
		defenders.targets = attackers.units;

		// Select targets
		_.mapObject(attackers.units,function(obj) {
			obj.target = simulator.getTarget(_.pluck(attackers.targets,"uuid"));
			return obj;
		});
		_.mapObject(defenders.units,function(obj) {
			obj.target = simulator.getTarget(_.pluck(defenders.targets,"uuid"));
			return obj;
		});

		_.each(attackers.units,simulator.fire);
		_.each(defenders.units,simulator.fire);
		
		var results = {
			"defenders": defenders,
			"attackers": attackers
		};*/
		
		self.postMessage(data);
	}

	self.addEventListener('message',doRound,false);
})();