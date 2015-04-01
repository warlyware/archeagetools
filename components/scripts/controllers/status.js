myApp.controller('StatusCtrl', ['$scope', '$rootScope', '$location', '$state', '$stateParams', 'FIREBASE_URL', 'Authentication', function($scope, $rootScope, $location, $state, $stateParams, FIREBASE_URL, Authentication) {
	
	$scope.logout = function() {
		Authentication.logout();
		$location.path('/tlm');
	}

}]);