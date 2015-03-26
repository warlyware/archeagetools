var myApp = angular.module('myApp', ['ui.router', 'appCtrl', 'firebase', 'timer', 'angular.filter']);

var appCtrl = angular.module('appCtrl', ['firebase'])
	.constant('FIREBASE_URL', 'https://wixiw.firebaseio.com/');

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// For any unmatched url, redirect to...
	$urlRouterProvider.otherwise("/tlm");

	// States
	$stateProvider
    .state('home', {
		url: '/home',
		controller: 'HomeCtrl',
		templateUrl: 'views/home.html'
	})
    .state('login', {
		url: '/login',
		resolve: {
			Authentication: 'Authentication'
		},
		controller: 'RegistrationCtrl',
		templateUrl: 'views/login.html'
	})
    .state('register', {
		url: '/register',
		resolve: {
			Authentication: 'Authentication'
		},
		controller: 'RegistrationCtrl',
		templateUrl: 'views/register.html'
	})	
    .state('tlm', {
		url: '/tlm',
		controller: 'RegistrationCtrl',
		templateUrl: 'views/tlm.html'
	})	
    .state('properties', {
		url: '/properties',
		controller: 'PropCtrl',
		templateUrl: 'views/properties.html'
	});
	
}]);