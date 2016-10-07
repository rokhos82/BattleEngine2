var simulator = {};

simulator.getTarget = function(targetList) {
	var index = _.random(0,targetList.length);
	return targetList[index];
};