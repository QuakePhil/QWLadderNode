// ladder interface
angular.module('quakephil.QGApp')
.controller('PopupController', ['$scope', '$http', '$modalInstance', function($scope, $http, $modalInstance) {
	$scope.QNetAuth = function() {
		console.log($scope.login);
		$http
		.post('/api/v1/secured', {  })
		.success(function (response) {
			console.log(response);
		})
		.error(function (error) {
			console.log("error:");
			console.log(error);
		});
	};
}])

.controller('QGController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
	$scope.login = {};

/*
	$http
	.post('/api/v1/secured', { })
	.success(function (response) {
		console.log(response);
		if (response.error) $modal.open({
			templateUrl: '/assets/login.html',
			controller: 'PopupController'
		})
	})
	.error(function (error) {
		console.log("error:");
		console.log(error);
	}); */
}]);
