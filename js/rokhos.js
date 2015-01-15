var rokhos = {};

rokhos.deepCopy = function() {	
};

rokhos.trim = function(str,x) {
	return str.substr(0,str.length-x);
};

rokhos.isArray = function(obj) {
	if(typeof obj === "object" && obj.hasOwnProperty("length")) {
		return true;
	}
	else {
		return false;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Runtime Logging
////////////////////////////////////////////////////////////////////////////////////////////////////
rokhos.log = function(parent) {
	this.parent = null;
	this.dom = null;
	this.logArray = [];
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

////////////////////////////////////////////////////////////////////////////////////////////////////
// UI Elements
////////////////////////////////////////////////////////////////////////////////////////////////////
rokhos.ui = {};

// Generic UI Functions ----------------------------------------------------------------------------
rokhos.ui.func = {};
rokhos.ui.func.setData = function(obj,key) {
	this.data = {};
	this.data.obj = obj;
	this.data.key = key;
};

rokhos.ui.func.refreshValue = function() {
	if(this.data) {
		var obj = this.data.obj;
		var key = this.data.key;
		this.dom.value = obj[key];
	}
};

rokhos.ui.func.refreshInner = function() {
	if(this.data) {
		var obj = this.data.obj;
		var key = this.data.key;
		this.dom.innerHTML = this.text + obj[key];
	}
};

rokhos.ui.func.className = function(klass) {
	this.dom.className = klass;
};

rokhos.ui.func.setCallback = function(obj,func) {
	this.callback = {};
	this.callback.obj = obj;
	this.callback.func = func;
};

rokhos.ui.func.envokeCallback = function() {
	if(this.callback) {
		var obj = this.callback.obj;
		var func = this.callback.func;
		var value = this.dom.value;
		func.call(obj,value);
	}
};

// textField ---------------------------------------------------------------------------------------
rokhos.ui.textField = function() {
	this.dom = null;

	this.initialize();
};

rokhos.ui.textField.prototype.setCallback = rokhos.ui.func.setCallback;
rokhos.ui.textField.prototype.setData = rokhos.ui.func.setData;
rokhos.ui.textField.prototype.refresh = rokhos.ui.func.refreshValue;
rokhos.ui.textField.prototype.className = rokhos.ui.func.className;
rokhos.ui.textField.prototype.onblur = rokhos.ui.func.envokeCallback;

rokhos.ui.textField.prototype.initialize = function() {
	this.dom = document.createElement("input");
	this.dom.setAttribute("type","text");
	this.dom.ui = this;
	this.dom.setAttribute("onblur","this.ui.onblur();");
};

// simpleText --------------------------------------------------------------------------------------
rokhos.ui.simpleText = function(text) {
	this.text = text;
	this.dom = null;

	this.initialize();
};

rokhos.ui.simpleText.prototype.setData = rokhos.ui.func.setData;
rokhos.ui.simpleText.prototype.className = rokhos.ui.func.className;
rokhos.ui.simpleText.prototype.refresh = rokhos.ui.func.refreshInner;

rokhos.ui.simpleText.prototype.initialize = function() {
	this.dom = document.createElement("span");
	if(this.text) {
		this.dom.appendChild(document.createTextNode(this.text));
	}
	this.dom.ui = this;
};

// button ------------------------------------------------------------------------------------------
rokhos.ui.button = function(text) {
	this.dom = null;
	this.text = text;

	this.initialize();
};

rokhos.ui.button.prototype.className = rokhos.ui.func.className;
rokhos.ui.button.prototype.setCallback = rokhos.ui.func.setCallback;
rokhos.ui.button.prototype.refresh = rokhos.ui.func.refreshInner;
rokhos.ui.button.prototype.onClick = rokhos.ui.func.envokeCallback;

rokhos.ui.button.prototype.initialize = function() {
	this.dom = document.createElement("button");
	this.dom.innerHTML = this.text;
	this.dom.ui = this;
	this.dom.setAttribute("onclick","this.ui.onClick();");
};

////////////////////////////////////////////////////////////////////////////////////////////////////
// UI Linking
////////////////////////////////////////////////////////////////////////////////////////////////////
rokhos.nexus = function() {
	this.channels = {};
};

rokhos.nexus.prototype.addElement = function(channel,object,func) {
	if(!this.channels[channel]) {
		this.channels[channel] = [];
	}
	this.channels[channel].push([object,func]);
};

rokhos.nexus.prototype.refreshChannel = function(channel) {
	if(this.channels[channel]) {
		var c = this.channels[channel];
		for(var i in c) {
			var e = c[i];
			var obj = e[0];
			var func = e[1];
			func.call(obj);
		}
	}
};