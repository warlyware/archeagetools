var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'uiRouterStyles', 'appCtrl', 'firebase', 'timer', 'angular.filter', 'ngScrollSpy', 'xeditable']);

var appCtrl = angular.module('appCtrl', ['firebase'])
	.constant('FIREBASE_URL', 'https://wixiw.firebaseio.com/');


myApp.run(['$rootScope', '$location', 'editableOptions', function($rootScope, $location, editableOptions) {
	$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
		if (error === 'AUTH_REQUIRED') {
			$rootScope.message = 'you are not logged in';
			$location.path('/tlm');
		}
	});
	editableOptions.theme = 'bs3'; // bootstrap3 theme
}]);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// For any unmatched url, redirect to...
	$urlRouterProvider.otherwise("login");

	// States
	$stateProvider
    .state('login', {
		url: '/login',
		resolve: {
			Authentication: 'Authentication'
		},
		controller: 'RegistrationCtrl',
		templateUrl: 'views/login.html'
	})
    .state('register', {
// 		url: '/invite=a8t7houtbgle3hb5ybgo8iuhoihgiyh84',
		url: '/register',
		resolve: {
			Authentication: 'Authentication'
		},
		controller: 'RegistrationCtrl',
		templateUrl: 'views/register.html'
	})	
    .state('properties', {
		url: '/properties',
		controller: 'PropCtrl',
		templateUrl: 'views/properties.html',
		data: {
			css: 'css/style.css'
		},
		resolve: {
			currentAuth: ['Authentication', function(Authentication) {
				return Authentication.requireAuth();
			}
		]}		
	});
	
}]);