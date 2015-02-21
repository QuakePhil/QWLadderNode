//(function(){
//'use strict';

angular.module('LadderApp')
.controller('ServemeController', ['$scope', '$websocket', function($scope, $websocket) {
	$websocket('ws://192.168.1.105:8081').onMessage(function(message) {
		$scope.ServemeData = JSON.parse(message.data);
		for (var i = 0; i < $scope.ServemeData.length; ++i) if (!$scope.ServemeData[i]['map'])
			$scope.ServemeData[i]['map'] = '_notfound';
		});
	}]);

//})();
