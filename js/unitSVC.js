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

	this.parseComponents();
};

// getDataObj --------------------------------------------------------------------------------------
be2.unitSVC.prototype.getDataObj = function() {
	be2.log("be2.unitSVC","Calling getDataObj",be2.debugLevelVerbose);
	return this.dat;
};

// parseComponents ---------------------------------------------------------------------------------
be2.unitSVC.prototype.parseComponents = function() {
	be2.log("be2.unitSVC.parseComponents","Function Call",be2.debugLevelVerbose);
	var components = this.dat.udl;
	this.dat.name = components.shift();
	be2.log("be2.unitSVC.parseComponents","Parsing Unit: " + this.dat.name,be2.debugLevelInfo);
	while(components.length > 0) {
		var component = components.shift().toLowerCase();
		var tags = component.split(" ");
		var type = tags.shift();
		be2.log("be2.unitSVC.parseComponents","Processing Component: " + type,be2.debugLevelInfo);
		if(be2.unit.components[type]) {
			if(!this.dat.hasOwnProperty(type))
				this.dat[type] = {};
			if(rokhos.isArray(this.dat[type])) {
				var dat = {};
				this.parseTags(dat,be2.unit.components[type],tags);
				this.dat[type].push(dat);
			}
			else {
				this.parseTags(this.dat[type],be2.unit.components[type],tags);
			}
			be2.log("be2.unitSVC.parseComponents","Done Processing Component",be2.debugLevelInfo);
		}
		else {
			be2.log("be2.unitSVC.parseComponents","Unknown Component: " + type,be2.debugLevelWarning);
		}
	}
	be2.log("be2.unitSVC.parseComponents","Done Parsing Unit",be2.debugLevelInfo);
};

// parseTags ---------------------------------------------------------------------------------------
be2.unitSVC.prototype.parseTags = function(dat,proc,tags) {
	be2.log("be2.unitSVC.parseTags","Function Call",be2.debugLevelVerbose);
	while(tags.length > 0) {
		var t = tags.shift();
		be2.log("be2.unitSVC.parseTags","Processing Tag: " + t,be2.debugLevelInfo);
		if(proc[t]) {
			eval(proc[t]);
		}
		else {
			be2.log("be2.unitSVC.parseTags","Unknown Tag: " + t,be2.debugLevelWarning);
		}
	}
};