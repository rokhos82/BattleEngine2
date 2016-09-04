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
	this.nexus.addElement("UNIT_UDL",this,this.drawUnit);
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

	if(this.hasOwnProperty("unitInterface")) {
		this.dom.removeChild(this.unitInterface);
		delete this.unitInterface;
	}
	this.unitInterface = document.createElement("div");
	this.dom.appendChild(this.unitInterface);

	var def = this.svc.getDefinition();
	var name = this.svc.getName();

	var ui = new rokhos.ui.simpleText("Name: " + name);
	this.unitInterface.appendChild(ui.dom);

	for(var k in def) {
		be2.log("be2.unitINT.drawUnit","Drawing Interface for Component:" + k,be2.debugLevelInfo);
		if(k == "udl" || k == "udlText") {
			continue;
		}
		var component = def[k];
		if(!be2.unit.interface[k]) {
			be2.log("be2.unitINT.drawUnit","No Defined Interface for Component: " + k,be2.debugLevelWarning);
		}

		var interface = be2.unit.interface[k];
		for(var i in interface) {
			var intDef = interface[i];
			var type = intDef.shift();
			var info = intDef.shift();
			
			if(typeof info == "object") {
				var ui = new rokhos.ui[type](info.label);
				if(rokhos.isArray(info.key)) {
				}
				else {
					ui.setData(component,info.key);
				}
				this.unitInterface.appendChild(ui.dom);
			}
			else {
				var ui = new rokhos.ui[type](info);
				this.unitInterface.appendChild(ui.dom);
			}
		}

		be2.log("be2.unitINT.drawUnit","Done Drawing Component Interface",be2.debugLevelInfo);
	}
};

// getUDL ------------------------------------------------------------------------------------------
be2.unitINT.prototype.getUDL = function() {
	be2.log("be2.unitINT.getUDL","Function Call",be2.debugLevelVerbose);
	var udl = prompt("Enter a UDL");
	this.updateUDL(udl);
};