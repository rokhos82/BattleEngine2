(function(){
	var _log = "";
	var state = undefined;
	
	function sleep(milliseconds) {
		var date = new Date();
		var curDate = null;

		do {
			curDate = new Date();
		} while ((curDate - date) < milliseconds)
	}

	function randomBetween(low,high) {
		return Math.floor((Math.random() * (high - low)) + low);
	}

	function chooseCombatant(faction) {
		var c = undefined;
		
		// Get a list of enemies for the faction
		var enemies = state.combatant[faction].enemies;
		if(enemies.length > 0) {
			// Select a random enemy faction to attack
			var k = randomBetween(0,enemies.length - 1);
			c = enemies[k];
		}
		else {
			break;
		}
		
		return c;
	};

	function selectTarget() {
		for(var c in state.combatants) {
			var faction = state.combatants[c];
			var fleets = faction.fleets;

			// Which enemy faction do we pick from?
			var targetFaction = chooseCombatant(faction.name);

			// Get a list of targets from the faction
			var targets = state.combatants[targetFaction].units;
		}
	}

	function doRound(event) {
		state = event.data.state;

		// Select targets

		// Resolve hits

		// Change values in state depending on targets & hits

		// Transmit the state back to the main application
		this.postMessage(state);
	}

	this.addEventListener('message',doRound,false);
})();