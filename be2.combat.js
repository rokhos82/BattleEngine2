(function(){
	var _log = "";
	var _done = false;
	var state = undefined;
	var angular = undefined;

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

	function logger(entry) {
		_log = entry + "\n";
		syncLog();
	}

	function syncLog() {
		this.postMessage({log:_log,done:_done});
	}

	function initCombat(event) {
		// Save the state sent to the worker thread
		state = event.data.state;

		// Get the reference to angular sent to the worker thread
	}

	this.addEventListener('message',initCombat,false);
})();