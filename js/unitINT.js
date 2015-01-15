be2.unitINT = function(svc) {
	be2.log("be2.unitINT","Constructing object",be2.debugLevelVerbose);
	this.svc = (svc == null) ? new be2.unitSVC(this) : svc;
	this.parent = null;
	this.dom = null;
	this.children = {};
	this.cssClass = be2.cssClass + "UNIT_";

	this.initialize();
};

// Nexus Channels
// UNIT_UDL - For handling updates to the Unit Description Line

// initialize --------------------------------------------------------------------------------------
be2.unitINT.prototype.initialize = function() {
	be2.log("be2.unitINT","Calling initialize",be2.debugLevelVerbose);
	this.dom = document.createElement("div");
	this.dom.ui = this;
	this.dom.className = this.cssClass + "INFO";

	var b = new rokhos.ui.button("Get UDL");
	b.setCallback(this,this.getUDL);
	this.dom.appendChild(b.dom);
	
	this.nexus = new rokhos.nexus();
};

// setParent ---------------------------------------------------------------------------------------
be2.unitINT.prototype.setParent = function(parent) {
	be2.log("be2.unitINT","Calling setParent",be2.debugLevelVerbose);
	if(this.parent === null) {
		this.parent = parent;
		this.parent.appendChild(this);
	}
	else {
		this.parent.removeChild(this);
		this.parent = parent;
		this.parent.appendChild(this);
	}
};

// clearParent -------------------------------------------------------------------------------------
be2.unitINT.prototype.clearParent = function() {
	be2.log("be2.unitINT","Calling clearParent",be2.debugLevelVerbose);
	if(this.parent) {
	}
};


// appendChild -------------------------------------------------------------------------------------
be2.unitINT.prototype.appendChild = function(child) {
	be2.log("be2.unitINT","Calling appendChild",be2.debugLevelVerbose);
	this.dom.appendChild(child.dom);
};

// removeChild -------------------------------------------------------------------------------------
be2.unitINT.prototype.removeChild = function(child) {
	be2.log("be2.unitINT","Calling removeChild",be2.debugLevelVerbose);
	this.dom.removeChild(child.dom);
};

// updateUDL ---------------------------------------------------------------------------------------
be2.unitINT.prototype.updateUDL = function(udlText) {
	be2.log("be2.unitINT.updateUDL","Function Call",be2.debugLevelVerbose);
	be2.log("be2.unitINT.updateUDL","New UDL: " + udlText,be2.debugLevelInfo);
	this.svc.parseUDL(udlText);
	this.nexus.refreshChannel("UNIT_UDL");
};

// drawUDL -----------------------------------------------------------------------------------------
be2.unitINT.prototype.drawUnit = function() {
	be2.log("be2.unitINT.drawUnit","Function Call",be2.debugLevelVerbose);
};

// getUDL ------------------------------------------------------------------------------------------
be2.unitINT.prototype.getUDL = function() {
	be2.log("be2.unitINT.getUDL","Function Call",be2.debugLevelVerbose);
	var udl = prompt("Enter a UDL");
	this.updateUDL(udl);
};