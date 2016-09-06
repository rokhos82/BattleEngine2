var _log = "";
var _done = false;

function sleep(milliseconds) {
	var date = new Date();
	var curDate = null;

	do {
		curDate = new Date();
	} while (curDate - date < milliseconds)
}

function randomBetween(low,high) {
	return Math.floor((Math.random() * (high - low)) + low);
}

function initCombat(event) {
	var combatData = event.data;
	startCombat(combatData);
}

function startCombat(combatData) {
	logger("Starting Combat!");
	logger("Fleets: ");
	for(var f in combatData.fleets) {
		var fleet = combatData.fleets[f];
		logger("  " + fleet.name + " - " + fleet.empire);
	}

	initCombatState(combatData);

	logger("");
	while(!combatData.state.done) {
		doCombatRound(combatData);
	}

	logger("Combat Finished");
	this.close();
}

function doCombatRound(combatData) {
	var state = combatData.state;
	var fleets = combatData.fleets;
	logger("Begin round " + state.round);
	var roundState = {
		round: state.round
	};
	state.rounds.push(roundState);

	// List fleets and combatants
	for(var f in fleets) {
		var fleet = fleets[f];
		var units = fleet.units;

		logger("Fleet: " + fleet.name);

		for(var u in units) {
			var unit = units[u];
			logger("  " + unit.unit.name + " - " + unit.unit.type);
		}
	}


	logger("");
	state.round++;
	if(state.round > 9)
		state.done = true;
}

function initCombatState(combatData) {
	var state = {};

	state.done = false;
	state.round = 1;
	state.rounds = [];

	combatData.state = state;
}

function selectTarget(combatants) {

}

function logger(entry) {
	_log = entry + "\n";
	syncLog();
}

function syncLog() {
	this.postMessage({log:_log,done:_done});
}

this.addEventListener('message',initCombat,false);