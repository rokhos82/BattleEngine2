var be2 = {};

be2.bootstrap = function(root) {
	be2.root = root;
	be2.logHandler = new rokhos.log(root);
};

be2.cssClass = "BE2_";

be2.debug = true;
be2.debugLevel = 0;
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

be2.unit = {};
be2.unit.components = {
	"hull": {
		"base": "dat.base = parseInt(tags.shift());",
		"max": "dat.max = parseInt(tags.shift());",
		"current": "dat.current = parseInt(tags.shift());",
		"defense": "dat.defense = parseInt(tags.shift());",
		"target": "dat.target = parseInt(tags.shift());",
		"resist": "dat.resist = parseInt(tags.shift());"
	},
	"starship": {
		"defense": "dat.defense = parseInt(tags.shift());",
		"target": "dat.target = parseInt(tags.shift());",
		"ecm": "dat.ecm = parseInt(tags.shift()); dat.ecmQaulity = parseInt(tags.shift());",
		"eccm": "dat.eccm = parseInt(tags.shift()); dat.ecmQaulity = parseInt(tags.shift());",
	},
	"beam": {
		"volley": "dat.volley = parseInt(tags.shift());",
		"target": "dat.target = parseInt(tags.shift());",
		"yield": "dat.yield = parseInt(tags.shift());",
		"eccm": "dat.eccm = parseInt(tags.shift());",
		"link": "dat.link = tags.shift();"
	}
};