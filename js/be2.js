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
be2.unit.generics = {
	"volley": "dat.volley = parseInt(tags.shift());",
	"target": "dat.target = parseInt(tags.shift());",
	"yield": "dat.yield = parseInt(tags.shift());",
	"ecm": "dat.ecm = parseInt(tags.shift()); dat.ecmQaulity = parseInt(tags.shift());",
	"eccm": "dat.eccm = parseInt(tags.shift()); dat.ecmQaulity = parseInt(tags.shift());",
	"defense": "dat.defense = parseInt(tags.shift());",
	"resist": "dat.resist = parseInt(tags.shift());",
	"flicker": "dat.resist = parseInt(tags.shift());"
};
be2.unit.components = {
	"hull": {
		"base": "dat.base = parseInt(tags.shift());",
		"max": "dat.max = parseInt(tags.shift());",
		"current": "dat.current = parseInt(tags.shift());",
		"defense": be.unit.generics["defense"],
		"target": be2.unit.generics["target"],
		"resist": be2.unit.generics["resist"]
	},
	"starship": {
		"defense": be2.unit.generics["defense"],
		"target": be2.unit.generics["target"],
		"ecm": be2.unit.generics["ecm"],
		"eccm": be2.unit.generics["eccm"]		
	},
	"beam": {
		"volley": be2.unit.generics["volley"],
		"target": be2.unit.generics["target"],
		"yield": be2.unit.generics["yield"],
		"eccm": be2.unit.generics["eccm"],
		"link": "dat.link = tags.shift();"
	},
	"missile": {
		"volley": be2.unit.generics["volley"],
		"target": be2.unit.generics["target"],
		"yield": be2.unit.generics["yield"],
		"eccm": be2.unit.generics["eccm"]
	},
	"shield": {
		"max": "",
		"current": "",
		"ecm": be2.unit.generics["ecm"],
		"resist": be2.unit.generics["resist"],
		"flicker": be2.unit.generics["flicker"]
	}
};

be2.unit.interface = {
	"name" : {
		"name": ["simpleText",{"label":"Name: ","key":"name"}]
	},
	"starship": {
		"type": ["simpleText","Type: Starship"],
		"ecm": ["simpleText",{"label":"ECM: ","key":"ecm"}],
		"defense": ["simpleText",{"label":"Defense: ","key":"defense"}],
		"totalDefense": ["simpleText",{"label":"Total Defense: ","key":["ecm","defense"]}],
		"eccm": ["simpleText",{"label":"ECCM: ","key":"eccm"}],
		"target": ["simpleText",{"label":"Target: ","key":"target"}],
		"totalTarget": ["simpleText",{"label":"Total Target: ","key":["eccm","target"]}]
	}
};