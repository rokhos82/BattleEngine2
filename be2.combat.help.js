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
simulator.objects.damage = function(uuid,dmg,crit) {
	this.source = uuid;
	this.damage = dmg;
	this.crit = {};
};

simulator.getTarget = function(targetList) {
	var index = _.random(0,targetList.length-1);
	return targetList[index];
};

simulator.buildTargetList = function(fleets) {
};

simulator.fire = function(unit) {
	var targetUnit = unit.target;

	var target = _.chain(unit).filter(function(obj){ return _.has(obj,"target");}).pluck("target").reduce(function(sum,num){return sum+num;},0).value();
	var log = {};

	// Roll Hit
	var direct = unit["direct-fire"];
	log.hits = [];
	_.map(direct,function(ele,index,list){
		var hitRoll = simulator.hitRoll(target + (ele.target ? ele.target : 0));
		var damageRoll = 0;
		if(hitRoll > simulator.setup.toHit) {
			damageRoll = _.random(1,100);
		}
		var damage = parseInt(ele.volley * (damageRoll / 100));
		log.hits.push({"target":targetUnit,"hitRoll":hitRoll,"damageRoll":damageRoll,"damage":damage});
	});

	// Roll Damage

	// Log the combat results into the unit's combat array
	if(!_.isArray(unit.combat)) {
		unit.combat = [];
	}
	unit.combat.push(log);
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