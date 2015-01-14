be2.unitINT = function(svc) {
	be2.log("be2.unitINT","Constructing object",be2.debugLevelVerbose);
	this.svc = (svc == null) ? new be2.unitSVC(this) : svc;
	this.parent = null;
	this.dom = null;
	this.children = {};

	this.initialize();
};

// initialize --------------------------------------------------------------------------------------
be2.unitINT.prototype.initialize = function() {
	be2.log("be2.unitINT","Calling initialize",be2.debugLevelVerbose);
	this.dom = document.createElement("div");
	var head = document.createElement("h1");
	head.appendChild(document.createTextNode("BE2 Unit Interface"));
	this.dom.appendChild(head);
	this.dom.ui = this;

	var udl = new rokhos.ui.textField();
	udl.setCallback(this,this.updateUDL);
	this.appendChild(udl);

	var tags = new rokhos.ui.textField();
	tags.setData(this.svc.getDataObj(),"udlText");
	this.appendChild(tags);

	this.nexus = new rokhos.nexus();
	this.nexus.addElement("UNIT_UDL",udl,udl.refresh);
	this.nexus.addElement("UNIT_UDL",tags,tags.refresh);
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

be2.unitINT.prototype.updateUDL = function(udlText) {
	be2.log("be2.unitINT","Calling updateUDL",be2.debugLevelVerbose);
	be2.log("be2.unitINT","updateUDL - " + udlText,be2.debugLevelInfo);
	this.svc.parseUDL(udlText);
	this.nexus.refreshChannel("UNIT_UDL");
};