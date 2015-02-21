//(function(){
//'use strict';

angular.module('LadderApp')
.controller('ServemeController', ['$scope', '$websocket', 'wsServerPort', function($scope, $websocket, wsServerPort) {
	$websocket(wsServerPort).onMessage(function(message) {
console.log("Received message: " + message.data);
		$scope.ServemeData = JSON.parse(message.data);
		for (var i = 0; i < $scope.ServemeData.length; ++i) if (!$scope.ServemeData[i]['map'])
			$scope.ServemeData[i]['map'] = '_notfound';
		$scope.ServemeData.sort(function(a,b){
			return b.stamp - a.stamp;
			});
		});
	}]);

//})();
