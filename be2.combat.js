var _log = "";
var _done = false;

var i = 0;

function logger() {
	i++;
	var newLog = "[" + i + "] Test Entry\n";
	console.log(newLog);

	_log += newLog;


	if(i > 10)
		_done = true;

	postMessage({log:_log,done:_done});

	if(!_done)
		setTimeout("logger()",2000);
}

logger();