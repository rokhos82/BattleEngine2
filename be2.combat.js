var _log = "";
var _done = false;

function sleep(milliseconds) {
	var date = new Date();
	var curDate = null;

	do {
		curDate = new Date();
	} while (curDate - date < milliseconds)
}

function initCombat(event) {
	var fleets = event.data;
	doCombat(fleets);
}

function doCombat(fleets) {
	logger("Starting Combat!");

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

		var targets = selectTargets(fleets);

		if(i > 9)
			_done=true;
		logger("");
	}

	logger("Combat Finished");
	this.close();
}

function buildTargetList(fleets) {

}

function selectTargets(fleets) {
	var targets = {};

	for(var f in fleets) {
		var fleet = fleets[f];
		logger("Selecting targets for fleet: " + fleet.name);
		for(var u in fleet.units) {

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