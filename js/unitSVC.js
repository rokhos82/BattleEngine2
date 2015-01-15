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
			var size = subtags.shift();
			this.dat.hull.size = size;
		}
		else if(type == "beam")
			var size = subtags.shift();
			var beam = new be2.weaponDAT(size,0,0,0);
			this.dat.beam.push(beam);
		}
		else if(type == "shield") {
		}
		else if(type == "missile") {
		}
		else if(type == "flag") {
		}
		else if(type == "command") {
		}
		else {
			this.dat.type = type;
		}
	}
	be2.log("be2.unitSVC.buildUnitFromUDL","End Building Unit",be2.debugLevelInfo);
};