//############################
//# /controllers/redirect.js #
//############################

myApp.controller('RedirectCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$location', 'FIREBASE_URL', function($scope, $rootScope, $state, $stateParams, $location, FIREBASE_URL) {

	if ($rootScope.currentUser) {
		$location.path('/properties');
	}
	
}]);