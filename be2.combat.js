var _log = "";
var _done = false;

var i = 0;

var fleets = undefined;

function getCombatSetup(event) {
	fleets = event.data;
	combat();
}

function combat() {
	_log += "Starting Combat\n";

	for(var f in fleets) {
		var fleet = fleets[f];
		_log += "Fleet: " + fleet.name + " (" + fleet.empire + ")\n";

		for(var u in fleet.units) {
			var unit = fleet.units[u];
			_log += ": " + unit.unit.name + "\n";
		}
	}

	_log += "Combat Finished!";

	this.postMessage({log:_log,done:true});
	this.close();
}

function selectTarget() {
}

function logger() {
	i++;
	var newLog = "[" + i + "] Test Entry\n";

	_log += newLog;


	if(i > 9)
		_done = true;

	if(!_done) {
		this.postMessage({log:_log,done:_done});
		setTimeout("logger()",500);
	}
	else {
		_log += "Combat Finished!";
		this.postMessage({log:_log,done:_done});
		this.close();
	}
}

this.addEventListener('message',getCombatSetup,false);