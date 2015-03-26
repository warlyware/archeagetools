//###############################
//# /services/authentication.js #
//###############################

myApp.factory('Authentication', ['$firebase', '$firebaseAuth', '$location', 'FIREBASE_URL', function($firebase, $firebaseAuth, $location, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref); 
	
	var myObject = {
		
		login: function(user) {
			return auth.$authWithPassword({
				email: user.email,
				password: user.password
			});
		}
		
	}
}]);