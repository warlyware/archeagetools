var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'uiRouterStyles', 'appCtrl', 'firebase', 'timer', 'angular.filter']);

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
		controller: 'RedirectCtrl',
		templateUrl: 'views/tlm.html',
		data: {
			css: 'css/tlm.css'
		}
	})	
    .state('properties', {
		url: '/properties',
		controller: 'PropCtrl',
		templateUrl: 'views/properties.html',
		resolve: {
			currentAuth: ['Authentication', function(Authentication) {
				return Authentication.requireAuth();
			}
		]}		
	});
	
}]);