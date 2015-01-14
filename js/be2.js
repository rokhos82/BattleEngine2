var be2 = {};

be2.bootstrap = function() {
	be2.root = document.getElementById("BE2_Root");

	var welcome = document.createTextNode("Welcome to the BattleEngine2!");

	be2.root.appendChild(welcome);
};