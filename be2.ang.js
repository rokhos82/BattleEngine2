(function(){
	var app = angular.module("be2",[]);

	app.controller("be2MainController",["$scope",function($scope){
		$scope.states = {
			combat: "combat",
			fleets: "fleets",
			units: "units"
		};
		$scope.state = $scope.states.units;
		$scope.udl = "{name: \"\"}";
	}]);

	app.directive('unitPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/unit-panel.html'
		};
	});

	app.directive('fleetPanel',function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/fleet-panel.html'
		};
	});
})();