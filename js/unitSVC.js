be2.unitSVC = function(svc) {
	be2.log("be2.unitSVC","Constructing object",be2.debugLevelVerbose);
	this.dat = new be2.unitDAT();
	if(!svc) {
		be2.log("be2.unitSVC","CRITICAL: Constructor not given an interface object",be2.debugLevelCritical);
	}
	else {
		this.svc = svc;
	}
};

// parseJSON ---------------------------------------------------------------------------------------
be2.unitSVC.prototype.parseJSON = function(jsonText) {
	be2.log("be2.unitSVC.parseJSON","Function Call",be2.debugLevelVerbose);
	var data = JSON.parse(jsonText);
	for(var key in data) {
		this.dat[key] = data[key];
	}
};

// stringifyJSON -----------------------------------------------------------------------------------
be2.unitSVC.prototype.stringifyJSON = function() {
	be2.log("be2.unitSVC.stringifyJSON","Function Call",be2.debugLevelVerbose);
	var jsonText = JSON.stringify(this.dat);
	return jsonText;
};

// parseUDL ----------------------------------------------------------------------------------------
be2.unitSVC.prototype.parseUDL = function(udl) {
	be2.log("be2.unitSVC.parseUDL","Function Call",be2.debugLevelVerbose);
	udl = udl.toLowerCase();
	be2.log("be2.unitSVC.parseUDL","UDL Text: " + udl,be2.debugLevelInfo);
	var tags = udl.split("[");
	for(var i in tags) {
		tags[i] = rokhos.trim(tags[i],1);
	}
	be2.log("be2.unitSVC.parseUDL","Tags: " + tags.toString(),be2.debugLevelInfo);
	this.dat.udl = tags;
	this.dat.udlText = udl;

	this.buildUnitFromUDL();
};

// getDataObj --------------------------------------------------------------------------------------
be2.unitSVC.prototype.getDataObj = function() {
	be2.log("be2.unitSVC","Calling getDataObj",be2.debugLevelVerbose);
	return this.dat;
};

be2.unitSVC.prototype.buildUnitFromUDL = function() {
	be2.log("be2.unitSVC.buildUnitFromUDL","Function Call",be2.debugLevelVerbose);
	be2.log("be2.unitSVC.buildUnitFromUDL","Building Unit",be2.debugLevelInfo);
	var tags = this.dat.udl;
	this.dat.name = tags.shift();
	while(tags.length > 0) {
		var tag = tags.shift();
		var subtags = tag.split(" ");
		var type = subtags.shift();
		if(type == "hull") {
			be2.log("be2.unitSVC.buildUnitFromUDL","Processing Hull",be2.debugLevelInfo);
			var base = subtags.shift();
			var max = subtags.shift();
			this.dat.hull.base = base;
			this.dat.hull.max = max;
			be2.log("be2.unitSVC.buildUnitFromUDL","Hull: " + base + "(" + max + ")",be2.debugLevelInfo);
			this.buildFromTag(this.dat.hull,type,subtags);
		}
		else if(type == "beam") {
			be2.log("be2.unitSVC.buildUnitFromUDL","Processing Beam",be2.debugLevelInfo);
			var size = subtags.shift();
			var beam = new be2.weaponDAT(size,0,0,0);
			this.dat.beam.push(beam);
		}
		else if(type == "shield") {
			be2.log("be2.unitSVC.buildUnitFromUDL","Processing Shield",be2.debugLevelInfo);
		}
		else if(type == "missile") {
			be2.log("be2.unitSVC.buildUnitFromUDL","Processing Missile",be2.debugLevelInfo);
		}
		else if(type == "flag") {
		}
		else if(type == "command") {
		}
		else {
			be2.log("be2.unitSVC.buildUnitFromUDL","Processing Base Unit",be2.debugLevelInfo);
			this.dat.type = type;
			this.buildFromTag(this.dat,type,subtags);
		}
	}
	be2.log("be2.unitSVC.buildUnitFromUDL","End Building Unit",be2.debugLevelInfo);
};

be2.unitSVC.prototype.buildFromTag = function(obj,tag,subtags) {
	be2.log("be2.unitSVC.buildFromTag","Function Call",be2.debugLevelVerbose);
	while(subtags.length > 0) {
		var t = subtags.shift();
		be2.log("be2.unitSVC.buildFromTag","Processing Tag: " + t,be2.debugLevelInfo);
		be2.log("be2.unitSVC.buildFromTag","Code: " + be2.tags[t],be2.debugLevelInfo);
		eval(be2.tags[t]);
	}
};