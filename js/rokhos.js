var rokhos = {};

rokhos.deepCopy = function() {	
};

// Runtime Logging ---------------------------------------------------------------------------------
rokhos.log = function(parent) {
	this.parent = null;
	this.dom = null;
	this.logArray = new Array();
	this.display = null;

	this.initialize(parent);
};

rokhos.log.prototype.initialize = function(parent) {
	if(this.dom == null) {
		this.dom = document.createElement("div");
		this.dom.className = "rokhos_log_main";
	}
	if(this.parent == null) {
		this.parent = parent;
		this.parent.appendChild(this.dom);
	}
	else {
		this.parent.removeChild(this.dom);
		this.parent = parent;
		this.parent.appendChild(this.dom);
	}
};

rokhos.log.prototype.refreshView = function() {
	if(this.display != null) {
		this.dom.removeChild(this.display);
	}

	this.display = document.createElement("div");
	this.dom.appendChild(this.display);
	for(var i in this.logArray) {
		var p = document.createElement("p");
		p.className = "rokhos_log_entry";
		var e = this.logArray[i];
		p.appendChild(document.createTextNode(e.title + " - " + e.text));
		this.display.insertBefore(p,this.display.childNodes[0]);
	}
};

rokhos.log.prototype.add = function(entry) {
	this.logArray.push(entry);
	this.refreshView();
};

rokhos.logEntry = function(title,text,level) {
	this.title = title;
	this.text = text;
	this.level = level;
};

// UI Elements -------------------------------------------------------------------------------------
rokhos.ui = {};

rokhos.ui.textField = function() {
	this.dom = null;

	this.initialize();
};

rokhos.ui.textField.prototype.initialize = function() {
	this.dom = document.createElement("input");
	this.dom.setAttribute("type","text");
	this.dom.ui = this;
	this.dom.setAttribute("onblur","this.ui.onblur();");
};

rokhos.ui.textField.prototype.setData = function(obj,key) {
	this.data = {};
	this.data.obj = obj;
	this.data.key = key;
};

rokhos.ui.textField.prototype.onblur = function() {
	this.data.obj[this.data.key] = this.dom.value;
};