be2.unitSVC = function() {
	this.dat = new be2.unitDAT();
};

// parseJSON ---------------------------------------------------------------------------------------
be2.unitSVC.prototype.parseJSON = function(jsonText) {
	var data = JSON.parse(jsonText);
	for(var key in data) {
		this.dat[key] = data[key];
	}
};

// stringifyJSON -----------------------------------------------------------------------------------
be2.unitSVC.prototype.stringifyJSON = function() {
	var jsonText = JSON.stringify(this.dat);
	return jsonText;
};

// parseUDL ----------------------------------------------------------------------------------------
be2.unitSVC.prototype.parseUDL = function(udl) {
	var tags = udl.split("[");
	this.dat.udl = tags;
	this.dat.udlText = udl;
};

be2.unitSVC.prototype.getDataObj = function() {
	return this.dat;
};