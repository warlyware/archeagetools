//###############################
//# /services/authentication.js #
//###############################

myApp.factory('Authentication', ['$firebaseAuth', '$rootScope', '$firebaseObject', '$location', 'FIREBASE_URL', function($firebaseAuth, $rootScope, $firebaseObject, $location, FIREBASE_URL) {
	
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref); 

	// Watch login and logout for change, update currentUser
	auth.$onAuth(function(authUser) {
		// Login
		if(authUser) {
			var ref = new Firebase(FIREBASE_URL + 'users/' + authUser.uid);
			var user = $firebaseObject(ref);
			$rootScope.currentUser = user;
		// Logout
		} else {
			$rootScope.currentUser = '';
		}
	});

	// Authentication functions
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
				var firebaseUsers = new Firebase(FIREBASE_URL + 'users');
				console.log('Server: ' + user.server);
				console.log('Guild: ' + user.guild);				
				firebaseUsers.child('/' + regUser.uid).set({
					created: Firebase.ServerValue.TIMESTAMP,
					userID: regUser.uid,
					mainChar: user.mainChar,
					server: user.server.name,
					guild: user.guild.name,
					email: user.email
				});
			});
		},
		logout: function(user) {
			return auth.$unauth();
		},
		//Require authentication
		requireAuth: function() {
			return auth.$requireAuth();
		},
		//Wait for authentication
		waitForAuth: function() {
			return auth.$waitForAuth();
		}
		
	}

	return myObject;
}]);