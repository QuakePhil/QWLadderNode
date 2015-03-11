angular.module('quakephil.QGApp', ['ui.router', 'ui.bootstrap', 'ngWebSocket'] )

.constant('wsServerPort', 'ws://52.0.31.38:8081')

.config(
['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider', 
function($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|qw):/);

	$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode(true);

	$stateProvider

	.state('index', {
		url: '/',
		templateUrl: '/assets/index.html',
	})
	.state('totalizator', {
		url: '/totalizator',
		templateUrl: '/assets/totalizator.html',
	})
	.state('serveme', {
		url: '/serveme',
		templateUrl: '/assets/serveme.html',
	})
	.state('search', {
		url: '/search',
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
