//##############################
//# /controllers/properties.js #
//##############################

myApp.controller('PropCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$firebaseObject', '$firebaseArray', '$timeout', 'FIREBASE_URL', function($scope, $rootScope, $state, $stateParams, $firebaseObject, $firebaseArray, $timeout, FIREBASE_URL) {

	var userID = $rootScope.currentUser.$id;

	var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties');
	var propertiesArr = $firebaseArray(ref);

	$scope.properties = propertiesArr;
	
	propertiesArr.$loaded().then(function() {
		statusCheck();
	});



	var statusCheck = function() {
		console.log("Status check starting...");
		angular.forEach(propertiesArr, function (property, key) {
			angular.forEach(property, function (val, key) {
				if (val!==null){
					if (val.propowner!==undefined) {
						whichOwner = val.propowner;
						whichProperty = key;
						var ref = new Firebase(FIREBASE_URL + '/users/' + userID + '/properties/' + whichOwner + '/' + whichProperty + '/');
						var whichPropObj = $firebaseObject(ref);
						whichPropObj.$loaded().then(function() {
							var dueunix;
							var nowunix;
							dueunix = whichPropObj.propduemoment;
							nowunix = moment().unix().toString();
							var oldduedate = whichPropObj.propduedateiso;
							var demodate = moment(oldduedate).add(7, 'days');
							var demodateiso = moment(demodate).toISOString();
							var demodateformatted = moment(demodate).format('ddd, MMM Do [at] h:mm a');
							var timeBetween = dueunix-nowunix;

							//Set status to overdue
						    if (nowunix > dueunix) {
								whichPropObj.propstatus = 'overdue';
								whichPropObj.propdemodateformatted = demodateformatted;
								whichPropObj.propdemodate = demodateiso;
							} else if (timeBetween < 86400 && timeBetween > 0) { // Set due soon												
								whichPropObj.propstatus = 'duesoon';
						    } else  if (timeBetween < 0) { //Or set paid
								whichPropObj.propdemodate = '';
								whichPropObj.propstatus = 'paid';
						    }
						});
					}
				}
			});
		});
		console.log("Checked!");

	}

	$scope.selectProperty = function(key, property) {
		$scope.owner = property.propowner
		$scope.proptype = property.proptype
		console.log(key + ', ' + property.propowner);
	}	

	// $timeout(function () {
	// 	console.log("Status check!");
	// }, 500);

}]);