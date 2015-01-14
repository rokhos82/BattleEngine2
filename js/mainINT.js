be2.mainINT = function(svc) {
	be2.log("be2.mainINT","Constructing object",be2.debugLevelInformation);
	this.svc = (svc == null) ? new be2.mainSVC() : svc;
	this.dom = null;
	this.parent = null;
	this.children = {};
};

// initialize -------------------------------------------------------------------------------------
be2.mainINT.prototype.initialize = function() {
	be2.log("be2.mainINT","Calling initialize",be2.debugLevelInformation);
	this.dom = document.createElement("div");
	this.newUnit();
};

// setParent ---------------------------------------------------------------------------------------
be2.mainINT.prototype.setParent = function(parent) {
	be2.log("be2.mainINT","Calling setParent",be2.debugLevelInformation);
	if(this.parent === null) {
		this.parent = parent;
		this.parent.appendChild(this.dom);
	}
	else {
		this.parent.removeChild(this.dom);
		this.parent = parent;
		this.parent.appendChild(this.dom);
	}
};

// appendChild -------------------------------------------------------------------------------------
be2.mainINT.prototype.appendChild = function(child) {
	be2.log("be2.mainINT","Calling appendChild",be2.debugLevelInformation);
	if(!this.children[child]) {
		this.children[child] = true;
		this.dom.appendChild(child.dom);
	}
};

// removeChild -------------------------------------------------------------------------------------
be2.mainINT.prototype.removeChild = function(child) {
	be2.log("be2.mainINT","Calling removeChild",be2.debugLevelInformation);
	if(this.children[child]) {
		delete this.children[child];
		this.dom.removeChild(child.dom);
	}
};

be2.mainINT.prototype.newUnit = function() {
	be2.log("be2.mainINT","Calling newUnit",be2.debugLevelInformation);
	var unit = new be2.unitINT();
	unit.setParent(this);
	this.svc.addUnit(unit.svc);
}