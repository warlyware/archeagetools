//################################
//# /controllers/registration.js #
//################################

myApp.controller('RegistrationCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$location', '$state', '$stateParams', 'Authentication', 'FIREBASE_URL', function($scope, $rootScope, $firebaseAuth, $location, $state, $stateParams, Authentication, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);
	
	$scope.login = function() {
		Authentication.login($scope.user)
		.then(function(user) {
			$location.path('/properties');
		}).catch(function(error) {
			$scope.message = error.message;
			console.log(error.message);
		});
	}

	$scope.register = function() {
		Authentication.register($scope.user)
			.then(function(user) {
				Authentication.login($scope.user);
				$location.path('/properties');
			}).catch(function(error) {
				$scope.regMessage = error.message;
			});
	}
	
	
}]);