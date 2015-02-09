var LadderApp = angular.module('LadderApp', ['ui.router', 'ui.bootstrap'] );

LadderApp.controller('PopupController', ['$scope', '$http', '$modalInstance', function($scope, $http, $modalInstance) {
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
}]);

LadderApp.controller('LadderController', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
	$scope.login = {};

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
	});
}]);

LadderApp.config(
['$stateProvider', '$urlRouterProvider', '$locationProvider',
function($stateProvider, $urlRouterProvider, $locationProvider) {
	$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode(true);

	$stateProvider

	.state('search', {
		url: '/',
		templateUrl: '/assets/search.html',
	})

	.state('rankings', {
		url: '/rankings',
		templateUrl: '/assets/rankings.html',
	})

	.state('about', {
		url: '/about',
		templateUrl: '/assets/about.html',
	});
}]);
