var be2 = {};

be2.bootstrap = function(root) {
	be2.root = root;
	be2.logHandler = new rokhos.log(root);
};

be2.cssClass = "BE2_";

be2.debug = true;
be2.debugLevel = 1;
be2.debugLevelVerbose = 0;
be2.debugLevelInfo = 1;
be2.debugLevelWarning = 2;
be2.debugLevelCritical = 3;

be2.log = function(title,text,level) {
	if(level >= be2.debugLevel) {
		var e = new rokhos.logEntry(title,text,level);
		be2.logHandler.add(e);
	}
};