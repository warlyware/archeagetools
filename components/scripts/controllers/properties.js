//##############################
//# /controllers/properties.js #
//##############################

myApp.controller('PropCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$firebaseObject', '$firebaseArray', '$timeout', 'FIREBASE_URL', function($scope, $rootScope, $state, $stateParams, $firebaseObject, $firebaseArray, $timeout, FIREBASE_URL) {

	var userID = $rootScope.currentUser.$id;

	var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties');
	var propertiesObj = $firebaseObject(ref);
	var propertiesArr = $firebaseArray(ref);

	
	$scope.properties = propertiesArr;
	
	propertiesObj.$loaded().then(function() {
		console.log(propertiesObj);
	});

			$timeout(function () {
				console.log("bing!");
			}, 5000);

}]);