//###############################
//# /services/authentication.js #
//###############################

myApp.factory('Authentication', ['$firebaseAuth', '$rootScope', '$firebaseObject', '$firebaseArray', '$location', 'FIREBASE_URL', function($firebaseAuth, $rootScope, $firebaseObject, $firebaseArray, $location, FIREBASE_URL) {
	
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
				firebaseUsers.child('/' + regUser.uid).set({
					created: Firebase.ServerValue.TIMESTAMP,
					userID: regUser.uid,
					mainChar: user.mainChar,
					server: user.server.name,
					guild: user.guild.name,
					email: user.email
				});
				var ref = new Firebase(FIREBASE_URL + 'users/' + regUser.uid + '/characters/'); // Get ref of characters
				var saveLocation = $firebaseArray(ref); // Create array from ref
				saveLocation.$add({ // Take character data and add it to array as new record
					charname: user.mainChar, // Name
					charlvl: 1 // Level
				}).then(function() {
					$location.path('/properties');
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