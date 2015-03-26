//###############################
//# /services/authentication.js #
//###############################

myApp.factory('Authentication', ['$firebaseAuth', '$location', 'FIREBASE_URL', function($firebaseAuth, $location, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref); 
	
	var myObject = {
		
		login: function(user) {
			return auth.$authWithPassword({
				email: user.email,
				password: user.password
			});
		},

		register: function(user) {
			return auth.$createUser({
				email: user.email,
				password: user.password
			}).then(function(regUser) {
				var firebaseUsers = new Firebase(FIREBASE_URL + 'testusers');
				firebaseUsers.child('/' + regUser.uid).set({
					created: Firebase.ServerValue.TIMESTAMP,
					userID: regUser.uid,
					mainChar: user.mainChar,
					email: user.email
				});
			});
		}
	}

	return myObject;
}]);