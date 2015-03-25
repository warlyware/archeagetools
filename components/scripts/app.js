var myApp = angular.module('myApp', ['ui.router', 'appCtrl', 'firebase']);

var appCtrl = angular.module('appCtrl', ['firebase'])
	.constant('FIREBASE_URL', 'https://wixiw.firebaseio.com/');

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// For any unmatched url, redirect to...
	$urlRouterProvider.otherwise("/home");

	// States
	$stateProvider
    .state('home', {
		url: '/home',
		controller: 'HomeCtrl',
		templateUrl: 'views/home.html'
	});
}]);