var _log = "";
var _done = false;

var i = 0;

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

logger();