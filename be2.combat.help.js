var simulator = {};

simulator.setup = {
	"toHit": 50,
	"maxHit": 100,
	"minHit": 10,
	"minDamage": 1
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
	_.each(unit.combat["packet-fire"],function(weapon){
		for(var i = 0;i < weapon.volley;i++) {
			if(weapon.ammo > 0) {
				var t = simulator.getTarget(targetList);
				var hit = new simulator.objects.hit(t);
				hit.hitRoll = _.random(1,100) + weapon.target;
				hit.damageRoll = _.random(1,100) + weapon.yield;
				hit.damageMax = weapon.packet;
				this.push(hit);
				weapon.ammo--;
			}
		}
	},stack);
	return stack;
};

simulator.resolveHit = function(hit,source,unitList) {
	var target = unitList[hit.target];
	var damage = new simulator.objects.damage(source);
	
	var hasShields = (target.shield.current && target.shield.current > 0);
	var barrier = hasShields ? target.combat.shield : target.combat.hull;
	damage.protection = hasShields ? "shields" : "hull";
	hit.protection = damage.protection;
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
		dmg = Math.max(dmg,simulator.setup.minDamage);
		dmg = Math.min(dmg,hit.damageMax);
		damage.damage = dmg;
		hit.damage = dmg;
		damage.damageRoll = damageRoll;
		hit.damage = dmg;
		hit.deflect = barrier.deflect;
	}

	if(hasShields) {
		target.shield.current -= damage.damage;
	}
	else {
		target.hull.current -= damage.damage;
	}

	hit.targetName = target.unit.name;
	damage.sourceName = unitList[damage.source].unit.name;

	return damage;
};

simulator.combatCleanup = function(unit) {
	if(unit.shield.regen) {
		unit.shield.current += unit.shield.regen;
	}
	if(unit.hull.regen) {
		unit.hull.current += unit.hull.regen;
	}

	unit.shield.current = Math.max(unit.shield.current,0);
	unit.hull.current = Math.max(unit.hull.current,0);

	if(unit.hull.current == 0) {
		this.status.destroyed.push(unit.uuid);
		unit.combat.status = "destroyed";
	}
	else if(unit.hull.current < unit.hull.max * unit.unit.breakOff) {
		this.status.fleeing.push(unit.uuid);
	}
};

simulator.initialize = function(obj) {
	obj.units = {};

	// Create attacker target list
	obj.units.attackers = _.chain(obj.attackers)
		.map(function(ele){return _.values(this.fleets[ele].units);},obj.state)
		.flatten()
		.filter(function(unit){ return !_.contains(obj.status.destroyed,unit.uuid); })
		.pluck("uuid")
		.value();

	// Create defender target list
	obj.units.defenders = _.chain(obj.defenders)
		.map(function(ele){return _.values(this.fleets[ele].units);},obj.state)
		.flatten()
		.filter(function(unit){ return !_.contains(obj.status.destroyed,unit.uuid); })
		.pluck("uuid")
		.value();
};

simulator.endOfCombat = function(round) {
	// Check to see what attacking units remain.
	var attackers = _.chain(round.attackers)
		.map(function(uuid){return _.keys(round.state.fleets[uuid].units);})
		.flatten()
		.difference(round.status.destroyed)
		.value();
	
	// Check to see what defending units remain.
	var defenders = _.chain(round.defenders)
		.map(function(uuid){return _.keys(round.state.fleets[uuid].units);})
		.flatten()
		.difference(round.status.destroyed)
		.value();

	// If one side is completely destroyed/fled, end combat.
	round.status.finished = (attackers.length <= 0 || defenders.length <= 0);
	//round.test = round.status.destroyed;

	// Cleanup units to exclude destroyed units.
	_.each(round.state.fleets,function(fleet){
		_.each(fleet.units,function(unit){
			var uuid = unit.uuid;
			if(_.contains(round.status.destroyed,uuid)) {
				delete fleet.units[unit.uuid];
				delete round.state.units[unit.uuid];
			}
		});
	});
};