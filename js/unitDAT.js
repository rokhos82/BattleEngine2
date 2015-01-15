be2.unitDAT = function() {
	this.version = be2.unitDAT.currentVersion;
	this.type = "starship";
	this.udl = new Array();
	this.udlText = "";
	this.hull = {
		size: 0
	};
	this.beam = new Array();
	this.shield = {};
	this.missile = new Array();
	this.name = "";
	this.type = "";
};

be2.unitDAT.currentVersion = "201501131650";
be2.unitDAT.upgrade = function() {
};