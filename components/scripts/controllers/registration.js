//################################
//# /controllers/registration.js #
//################################

myApp.controller('RegistrationCtrl', ['$scope', '$rootScope', '$timeout', '$firebaseAuth', '$location', '$state', '$stateParams', 'Authentication', 'FIREBASE_URL', function($scope, $rootScope, $timeout, $firebaseAuth, $location, $state, $stateParams, Authentication, FIREBASE_URL) {
	
	// [ Variables ]
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);
	// Registered servers and guilds
	$scope.servers = [
		{name: 'Inoch', guilds: [
			{name: 'Waterdeep'}
		]},
		{name: 'Ezi'},
		{name: 'Ollo'},
	]
	
	// [ Functions ]
	// login()
	$scope.login = function() {
		Authentication.login($scope.user)
		.then(function(user) {
			$location.path('/properties');
		}).catch(function(error) {
			$scope.message = error.message;
			console.log(error.message);
		});
	}; // /login()

	// register()
	$scope.register = function() {
		Authentication.register($scope.user)
		.then(function(user) {
			console.log('User created!');
			Authentication.login($scope.user);
			$timeout(function () {
				$location.path('/properties');
			}, 500);
		}).catch(function(error) {
			$scope.regMessage = error.message;
			console.log($scope.regMessage);
		});
	}; //  /register()
	
	$scope.regRequest = function() {
		$scope.regRequested = true;
		console.log('Requested');
	}
}]);