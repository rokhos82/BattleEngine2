var _log = "";
var _done = false;

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

function initCombat(event) {
	var state = event.data;
	startCombat(state);
}

function startCombat(state) {
	logger("Starting Combat!");
	logger("Fleets: ");
	for(var f in state.fleets) {
		var fleet = state.fleets[f];
		logger("  " + fleet.name + " - " + fleet.empire);
	}

	initCombatState(state);

	logger("");
	while(!state.state.done) {
		doCombatRound(state);
	}

	logger("Combat Finished");
	this.close();
}

function doCombatRound(combatData) {
	var state = combatData.state;
	var fleets = combatData.fleets;
	var units = combatData.units;
	var roundState = {
		round: state.round
	};
	state.rounds.push(roundState);

	logger("Begin round " + state.round);

	// List fleets and combatants
	for(var f in fleets) {
		var fleet = fleets[f];
		var unitList = fleet.units;

		logger("Fleet: " + fleet.name);

		for(var u in unitList) {
			var unit = units[unitList[u]];
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