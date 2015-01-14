be2.unitINT = function(svc) {
	be2.log("be2.unitINT","Constructing object",be2.debugLevelInformation);
	this.svc = (svc == null) ? new be2.unitSVC() : svc;
	this.parent = null;
	this.dom = null;
	this.children = {};

	this.initialize();
};

// initialize --------------------------------------------------------------------------------------
be2.unitINT.prototype.initialize = function() {
	this.dom = document.createElement("div");
	this.dom.appendChild(document.createTextNode("BE2 Unit Interface"));
	this.dom.ui = this;

	var udl = new rokhos.ui.textField();
	udl.setData(this.svc.getDataObj(),"udlText");
	this.appendChild(udl);
};

// setParent ---------------------------------------------------------------------------------------
be2.unitINT.prototype.setParent = function(parent) {
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
	if(this.parent) {
	}
};


// appendChild -------------------------------------------------------------------------------------
be2.unitINT.prototype.appendChild = function(child) {
	this.dom.appendChild(child.dom);
};

// removeChild -------------------------------------------------------------------------------------
be2.unitINT.prototype.removeChild = function(child) {
	this.dom.removeChild(child.dom);
};