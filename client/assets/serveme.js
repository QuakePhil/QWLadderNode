angular.module('quakephil.QGApp')
.filter('gt', function () {
    return function ( items, value ) {
return items;
        var filteredItems = []
        angular.forEach(items, function ( item ) {
            if ( item.stamp > value ) {
                filteredItems.push(item);
                }
            });
//console.log(items);
//console.log(filteredItems);
        return filteredItems;
        }
    })

.controller('ServemeController', ['$scope', '$websocket', 'wsServerPort', function($scope, $websocket, wsServerPort) {
	$scope.currentDateTime = Date.now();
	$websocket(wsServerPort).onMessage(function(message) {
		$scope.ServemeData = JSON.parse(message.data);
		for (var i = 0; i < $scope.ServemeData.length; ++i) if (!$scope.ServemeData[i]['map'])
			$scope.ServemeData[i]['map'] = '_notfound';
		$scope.stampCutoff = Date.now() - 1 * 60 * 60 * 1000; // 1 hour to live for a serveme message
		$scope.ServemeData.sort(function(a,b){
			return b.stamp - a.stamp;
			});
		});
	}]);
