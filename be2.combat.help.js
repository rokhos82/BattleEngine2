var simulator = {};

simulator.setup = {
	"toHit": 50,
	"maxHit": 100,
	"minHit": 10
};

simulator.objects = {};
simulator.objects.hit = function(uuid,hit,dmgRoll,dmg,dmgMax) {
	this.target = uuid;
	this.hitRoll = hit;
	this.damageRoll = dmgRoll;
	this.damage = dmg;
	this.damageMax = dmgMax;
};
simulator.objects.damage = function(uuid) {
	this.source = uuid;
	this.damage = 0;
	this.crit = {};
	this.damageRoll = 0;
	this.protection = "";
};

simulator.getTarget = function(targetList) {
	var index = _.random(0,targetList.length-1);
	return targetList[index];
};

simulator.buildTargetList = function(fleets) {
};

simulator.fireWeapons = function(unit,targetList) {
	var stack = [];
	_.each(unit.combat["direct-fire"],function(weapon){
		var t = simulator.getTarget(targetList);
		var hit = new simulator.objects.hit(t);
		hit.hitRoll = _.random(1,100) + weapon.target;
		hit.damageRoll = _.random(1,100) + weapon.yield;
		hit.damageMax = weapon.volley;
		hit.damage = Math.round(hit.damageMax * hit.damageRoll / 100);
		this.push(hit);
	},stack);
	return stack;
};

simulator.resolveHit = function(hit,source,unitList) {
	var target = unitList[hit.target];
	var damage = new simulator.objects.damage(source);
	
	var hasShields = (target.shield.current > 0);
	var barrier = hasShields ? target.combat.shield : target.combat.hull;
	damage.protection = hasShields ? "shield" : "hull";
	var hitRoll = hit.hitRoll - barrier.defense;
	hitRoll = Math.min(hitRoll,100);
	hitRoll = Math.max(hitRoll,10);
	hit.hitRoll = hitRoll;
	damage.hitRoll = hitRoll;

	if(hitRoll > simulator.setup.toHit) {
		damage.hitRoll = hitRoll;
		var damageRoll = hit.damageRoll - barrier.resist;
		damage.deflect = barrier.deflect;
		var dmg = Math.round(hit.damageMax * damageRoll / 100);
		dmg -= barrier.deflect;
		dmg = Math.max(dmg,0);
		dmg = Math.min(dmg,hit.damageMax);
		damage.damage = dmg;
		hit.damage = dmg;
		damage.damageRoll = damageRoll;
		hit.damage = dmg;
	}

	if(hasShields) {
		target.shield.current -= damage.damage;
	}
	else {
		target.hull.current -= damage.damage;
	}

	return damage;
};

simulator.combatCleanup = function(unit) {
	unit.shield.current = Math.max(unit.shield.current,0);
	unit.hull.current = Math.max(unit.hull.current,0);
};

simulator.hitRoll = function(target) {
	var roll = _.random(1,100) + target;
	roll = Math.min(roll,simulator.setup.maxHit);
	roll = Math.max(roll,simulator.setup.minHit);
	return roll;
};

simulator.initialize = function(obj) {
	obj.units = {};
	obj.units.attackers = _.chain(obj.attackers).map(function(ele){ return _.keys(this.fleets[ele].units); },obj.state).flatten().value();
	obj.units.defenders = _.chain(obj.defenders).map(function(ele){ return _.keys(this.fleets[ele].units); },obj.state).flatten().value();
};