be2.mainSVC = function(dat) {
	be2.log("be2.mainSVC","Constructing object",be2.debugLevelInformation);
	this.dat = (dat == null) ? new be2.mainDAT() : dat;	
};

be2.mainSVC.prototype.addUnit = function(svc) {
	be2.log("be2.mainSVC","Calling addUnit",be2.debugLevelInformation);
	this.dat.units.push(svc.dat);
};