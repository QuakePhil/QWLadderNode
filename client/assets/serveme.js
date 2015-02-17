//(function(){
//'use strict';

angular.module('LadderApp')
.controller('ServemeController', ['$scope', '$websocket', function($scope, $websocket) {
	$websocket('ws://192.168.1.105:8081').onMessage(function(message) {
		console.log("we're here");
		console.log(message.data);
		$scope.ServemeData = JSON.parse(message.data);
		});
	}]);

//})();
