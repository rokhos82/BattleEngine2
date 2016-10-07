(function() {
	"use strict";

	// Load libraries for the worker thread.
	self.importScripts("js/underscore.js");
	self.importScripts("be2.combat.help.js");

	function doRound(event) {
		var data = event.data;

		var attackers = data.fleets[data.fleets.list[0]];
		var defenders = data.fleets[data.fleets.list[1]];

		attackers.targets = defenders.units;
		defenders.targets = attackers.units;

		var target = simulator.getTarget(_.pluck(attackers.targets,"uuid"));
		
		var results = {
			"defenders": defenders,
			"attackers": attackers,
			"target": target
		};
		self.postMessage(results);
	}

	self.addEventListener('message',doRound,false);
})();