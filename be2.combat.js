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
	doCombat(combatData);
}

function doCombat(combatData) {
	logger("Starting Combat!");
	var fleets = combatData.fleets;

	for(var f in fleets) {
		var fleet = fleets[f];
		logger("Fleet: " + fleet.name + " (" + fleet.empire + ")");

		for(var u in fleet.units) {
			var unit = fleet.units[u];
			logger(": " + unit.unit.name);
		}
	}
	logger("");
	var i = 0;
	while(!_done) {
		i++
		logger("Starting round: " + i);

		var targets = selectTargets(combatData);

		if(i > 9)
			_done=true;
		logger("");
	}

	logger("Combat Finished");
	this.close();
}

function selectTargets(combatData) {
	var targets = {};
	var fleets = combatData.fleets;
	var index = combatData.index;

	for(var f in fleets) {
		var fleet = fleets[f];
		logger("Selecting targets for fleet " + fleet.name + " from " + fleet.enemy);
		var i = index[fleet.enemy];
		var enemy = fleets[i];
		var units = fleet.units;

		for(var u in units) {
			var l = enemy.units.length;
			var t = randomBetween(0,l);
			var target = enemy.units[t];
			var unit = units[u];
			logger(": " + unit.unit.name + " fires at " + target.unit.name);
		}
	}

	return targets;
}

function logger(entry) {
	_log = entry + "\n";
	syncLog();
}

function syncLog() {
	this.postMessage({log:_log,done:_done});
}

this.addEventListener('message',initCombat,false);