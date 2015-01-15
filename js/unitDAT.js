be2.unitDAT = function() {
	this.version = be2.unitDAT.currentVersion;
	this.udl = [];
	this.udlText = "";
	this.definition = {
		"hull": {},
		"beam": [],
		"shield": {},
		"missile": []
	};
	this.name = "";
};

be2.unitDAT.currentVersion = "201501131650";
be2.unitDAT.upgrade = function() {
};