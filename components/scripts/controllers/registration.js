//################################
//# /controllers/registration.js #
//################################

myApp.controller('RegistrationCtrl', ['$scope', '$rootScope', '$firebase', '$firebaseAuth', '$location', '$state', '$stateParams', 'Authentication', 'FIREBASE_URL', function($scope, $rootScope, $firebase, $firebaseAuth, $location, $state, Authentication, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);
	
	$scope.login = function() {
		Authentication.login($scope.user)
		.then(function(user) {
			$location.path('/properties');
		}).catch(function(error) {
			$scope.message = error.message;
		});
	}

	
	$scope.register = function() {
		alert($scope.user.email)
		$location.path('/properties');
	}
	
	
}]);