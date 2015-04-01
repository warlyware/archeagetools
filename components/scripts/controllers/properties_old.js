// //##############################
// //# /controllers/properties.js #
// //##############################

// myApp.controller('PropCtrl', ['$scope', '$rootScope', '$state', '$stateParams', 'FIREBASE_URL', function($scope, $rootScope, $state, $stateParams, FIREBASE_URL) {



// 	var ref = new Firebase(FIREBASE_URL); // base url
// 	var simpleLogin = $firebaseSimpleLogin(ref); // run simpleLogin on url 
// 	$scope.window = $window;

// 	simpleLogin.$getCurrentUser().then(function(authUser) { // get current user then...

// 		if (authUser !== null) { // if passed in authUser exists then...

// 			var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/properties/'); 
// 			var propertiesInfo = $firebase(ref);
// 			var propertiesObj = $firebase(ref).$asObject(); 
// 			var propertiesArray = $firebase(ref).$asArray(); 

// 			var charRef = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/characters/'); 
// 			var userCharactersArray = $firebase(charRef).$asArray();
// 			var userCharactersObj = $firebase(charRef).$asObject();

// 			var counterRef = new Firebase(FIREBASE_URL + '/packscounter/');
// 			var counterInfo = $firebase(counterRef);
// 			var counterObj = $firebase(counterRef).$asObject();

// 			counterObj.$loaded().then(function() {
// 				$rootScope.howManyPacks = counterObj.counter; // load array into rootscope		
// 			});

// 			counterObj.$watch(function(event) {
// 				$rootScope.howManyPacks = counterObj.counter; // load array into rootscope		
// 			});

// 			userCharactersObj.$loaded().then(function(data) { // wait til properties object is loaded then...
// 				$scope.characters = userCharactersObj; // load object into scope
// 			}); 

// 			propertiesObj.$loaded().then(function(data) { // wait til properties object is loaded then...


// 				$timeout(function () {
// 					statusCheck();
// 				}, 100);

// 			}); 

// 			propertiesArray.$loaded().then(function(data) {
// 				$scope.properties = propertiesArray; // load object into scope	
// 				$rootScope.howManyProperties = propertiesArray.length; // load array into rootscope
// 			}); 

// 			propertiesArray.$watch(function(event) { // watch array for changes
// 				$rootScope.howManyProperties = propertiesArray.length; // update prop number
// 			}); 

// 			var whichProperty;
// 			var whichPropStatus;


// 			var statusCheck = function() {

// 				console.log("status check");
// 				angular.forEach(propertiesArray, function (property, key) {
// 					angular.forEach(property, function (val, key) {
// 						if (val!==null){
// 							if (val.propowner!==undefined) {
// 								whichOwner = val.propowner;
// 								whichProperty = key;

// 	 							var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/properties/' + whichOwner + '/' + whichProperty + '/'); 
// 								var whichPropInfo = $firebase(ref);
// 								var whichPropObj = whichPropInfo.$asObject();
// 								var whichPropArray = whichPropInfo.$asArray();
			
// 								var packRef = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/properties/' + whichOwner + '/' + whichProperty + '/packs/');
// 								var packInfo = $firebase(packRef);
// 								var packObj = $firebase(packRef).$asObject();						
// 								var packArray = $firebase(packRef).$asArray();

// 								whichPropObj.$loaded().then(function() {
// 									$scope.propObj = whichPropObj;
// 									// console.log($scope.propObj);

// 									$scope.propObj.$loaded().then(function(){
// 										$scope.packObj = packObj;
// 										$scope.packs = packArray;

// 										var dueunix;
// 										var nowunix;

// 										dueunix = $scope.propObj.propduemoment;
// 										nowunix = moment().unix().toString();

// 										var oldduedate = whichPropObj.propduedateiso;
// 										var demodate = moment(oldduedate).add(7, 'days');
// 										var demodateiso = moment(demodate).toISOString();
// 										var demodateformatted = moment(demodate).format('ddd, MMM Do [at] h:mm a');

// 										var timeBetween = dueunix-nowunix;

// 											//Set status to overdue
// 									    if (nowunix > dueunix) {
// 											whichPropInfo.$update({ propstatus: 'overdue' });
// 											whichPropInfo.$update({ propdemodateformatted: demodateformatted });
// 											whichPropInfo.$update({ propdemodate: demodateiso });
// 										} else if (timeBetween < 86400 && timeBetween > 0) { // Set due soon												
// 											whichPropInfo.$update({ propstatus: 'duesoon' });
// 									    } else  if (timeBetween < 0) { //Or set paid
// 											whichPropInfo.$update({ propdemodate: '' });
// 											whichPropInfo.$update({ propstatus: 'paid' });
// 									    }
// 									});
// 								});
// 							}
// 						}
// 					});
// 				});
// 			}

			
// 			$interval(function () {
// 				statusCheck();
// 				console.log("checked!");
// 			}, 900000);

// //Character

// 			userCharactersObj.$loaded().then(function(data) { // wait til properties object is loaded then...
// 				$rootScope.userCharactersObj = userCharactersObj; // load object into scope
// 			}); //properties object loaded


// 			userCharactersArray.$loaded().then(function(data) {
// 				$rootScope.howManyCharacters = userCharactersArray.length; // load array into rootscope
// 			}); //properties array loaded

// 			userCharactersArray.$watch(function(event) { // watch array for changes
// 				$rootScope.howManyCharacters = userCharactersArray.length; // load array into rootscope
// 			}); // prop number update
							


// 			$scope.addProperty = function() { // add addProperty() to scope

// 				var compiledDuedate = '2015-'+$scope.propduemonth+'-'+$scope.propdueday+'T'+$scope.propduehour+':'+$scope.propduemin+':'+'00';
				
// 				var duedate = moment(compiledDuedate).local();
// 				var duedateunix = moment(duedate).unix();
// 				var duedateiso = moment(duedate).toISOString();
// 				var duedatestring = duedateunix.toString();

// 				var compiledMomentDate = moment(duedate).format("ddd, MMM Do");
// 				var compiledMomentTime = moment(duedate).format("h:mm a");

// 				var compiledMomentDateString = compiledMomentDate.toString();
// 				var compiledMomentTimeString = compiledMomentTime.toString();

// 				var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/properties/' + $scope.propowner);
// 				var saveInfo = $firebase(ref);

// 					var out = $scope.housetype;
// 					console.log(out);
// 					saveInfo.$push({ // push info below as object to db
// 							propowner: $scope.propowner,
// 							howmanypacks: 0,
// 							proplocation: $scope.proplocation,
// 							proptaxamount: $scope.proptaxamount,
// 							propduedate: compiledMomentDateString,
// 							propduemoment: duedatestring,
// 							propduedateiso: duedateiso,
// 							propduetime: compiledMomentTimeString,
// 							propstatus: 'paid',
// 							proptype: $scope.proptype,
// 							propcategory: $scope.proptypes,
// 							user: authUser.uid,
// 							created: Firebase.ServerValue.TIMESTAMP
// 					})
// 					.then(function() { // once data is saved to db...
// 						console.log('added, checking status');
// 						$timeout(function () {						
// 							statusCheck();
// 						}, 500);
// 					});


// 			}// add property

// 			$scope.deleteProperty = function(key,property) { // add deleteProperty to scope
// 				var r = confirm('are you sure you want to delete this property?');
// 				if (r == true) {
// 					console.log(key);
// 					var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/properties/' + property.propowner + '/');
// 					var saveInfo = $firebase(ref);

// 					saveInfo.$remove(key); // remove key of base property item clicked on, deleteing obj from db
// 				}
// 			}

// 			$scope.go = function(path) {
// 				$location.path(path);
// 			}

// //			"$location.path('/propstats/' + property.user + '/' + property.propowner + '/' + key)"

// 			$scope.payTaxes = function(key,property) { 

// 				var r = confirm('press OK to pay taxes');
// 				if (r == true) {

// 					var ref = new Firebase(FIREBASE_URL + '/users/' + authUser.uid + '/properties/' + property.propowner + '/' + key);
// 					var whichPropInfo = $firebase(ref);
// 					var whichPropObj = whichPropInfo.$asObject();


// 					whichPropObj.$loaded().then(function() {
// 						var oldduedate = whichPropObj.propduedateiso;
// 						var duedate = moment(oldduedate).add(7, 'days');
		
// 						var compiledMomentDate = moment(duedate).format("ddd, MMM Do");
// 						var compiledMomentTime = moment(duedate).format("h:mm a");

// 						var compiledMomentDateString = compiledMomentDate.toString();
// 						var compiledMomentTimeString = compiledMomentTime.toString();
		
// 						var duedateunix = moment(duedate).unix();
// 						var duedateiso = moment(duedate).toISOString();
// 						var duedatestring = duedateunix.toString();


// 						whichPropInfo.$update({
// 							propduedate: compiledMomentDateString,
// 							propduemoment: duedatestring,
// 							propduedateiso: duedateiso,
// 							propduetime: compiledMomentTimeString,
// 							propstatus: 'paid'
// 						}).then(function () {
// 						console.log('paid, checking status');
// 							$timeout(function () {						
// 								statusCheck();
// 							}, 500);
// 						});						
						



// 					});

		
// 				}

// 			}




// 		}// user exists



// 	});//getCurrentUser




// }]);