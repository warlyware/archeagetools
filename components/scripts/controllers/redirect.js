//############################
//# /controllers/redirect.js #
//############################

myApp.controller('RedirectCtrl', ['$scope', '$rootScope', '$window', '$timeout', '$state', '$stateParams', '$location', 'FIREBASE_URL', function($scope, $rootScope, $window, $timeout, $state, $stateParams, $location, FIREBASE_URL) {

	var redirect = function(){
		console.log('Trying to redirect...');
		$window.location = "#/properties";
	}
	
	$(document).ready(function() {
		console.log('loaded');

		$timeout(function () { // Wait a moment for changes to database
			redirect();
		}, 500);			

	/** this is come when complete page is fully loaded, including all frames, objects and images **/
	});
	
// 	scope.$apply(function() { $location.path("/property"); });


	
// 	redirect();
	
}]);