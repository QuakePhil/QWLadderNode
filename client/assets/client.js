angular.module('LadderApp', ['ui.router', 'ui.bootstrap', 'ngWebSocket'] )

.constant('wsServerPort', 'ws://192.168.1.104:8081')

.config(
['$stateProvider', '$urlRouterProvider', '$locationProvider', '$compileProvider', 
function($stateProvider, $urlRouterProvider, $locationProvider, $compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|qw):/);

	$urlRouterProvider.otherwise("/");
	$locationProvider.html5Mode(true);

	$stateProvider

	.state('serveme', {
		url: '/',
		templateUrl: '/assets/serveme.html',
	});
/*
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
*/
}]);
