(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var myApp = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'uiRouterStyles', 'appCtrl', 'firebase', 'timer', 'angular.filter', 'ngScrollSpy', 'xeditable']);

var appCtrl = angular.module('appCtrl', ['firebase'])
	.constant('FIREBASE_URL', 'https://wixiw.firebaseio.com/');


myApp.run(['$rootScope', '$location', 'editableOptions', function($rootScope, $location, editableOptions) {
	$rootScope.$on('$routeChangeError', function(event, next, previous, error) {
		if (error === 'AUTH_REQUIRED') {
			$rootScope.message = 'you are not logged in';
			$location.path('/tlm');
		}
	});
	editableOptions.theme = 'bs3'; // bootstrap3 theme
}]);

myApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

	// For any unmatched url, redirect to...
	$urlRouterProvider.otherwise("login");

	// States
	$stateProvider
    .state('login', {
		url: '/login',
		resolve: {
			Authentication: 'Authentication'
		},
		controller: 'RegistrationCtrl',
		templateUrl: 'views/login.html'
	})
    .state('register', {
// 		url: '/invite=a8t7houtbgle3hb5ybgo8iuhoihgiyh84',
		url: '/register',
		resolve: {
			Authentication: 'Authentication'
		},
		controller: 'RegistrationCtrl',
		templateUrl: 'views/register.html'
	})	
    .state('properties', {
		url: '/properties',
		controller: 'PropCtrl',
		templateUrl: 'views/properties.html',
		data: {
			css: 'css/style.css'
		},
		resolve: {
			currentAuth: ['Authentication', function(Authentication) {
				return Authentication.requireAuth();
			}
		]}		
	});
	
}]);
//############################
//# /controllers/redirect.js #
//############################

myApp.controller('HomeCtrl', ['$scope', 'FIREBASE_URL', function($scope, FIREBASE_URL) {

	
}]);
//##############################
//# /controllers/properties.js #
//##############################

myApp.controller('PropCtrl', ['$scope', '$compile', '$location', '$anchorScroll', '$rootScope', '$state', '$stateParams', '$firebaseObject', '$firebaseArray', '$timeout', 'FIREBASE_URL', function($scope, $compile, $location, $anchorScroll, $rootScope, $state, $stateParams, $firebaseObject, $firebaseArray, $timeout, FIREBASE_URL) {

	// [ Variables ]
    var userID = $rootScope.currentUser.$id;
    var propertiesRef = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties'); // Get currentUser properties ref
    var propertiesArr = $firebaseArray(propertiesRef); // Load properties into an array
	var charRef = new Firebase(FIREBASE_URL + '/users/' + userID + '/characters/');  // 
	var charArr = $firebaseArray(charRef); // Load characters into an array

    $scope.properties = propertiesArr; // Add properties array to scope
	$scope.characters = charArr;  // Add characters array to scope
	
    propertiesArr.$loaded().then(function() { // Once the properties array has loaded...
		statusCheck(); // Check status (tax due date) of properties
    });
	
	// [ Init Options ]
	
	// Initialize infobox
	$scope.status = {isFirstOpen: false}; // Set the infobox to closed
	$scope.topBoxCollapsed = true; // Set the topbox to closed
	$scope.topBoxCharCollapsed = true; // Set the topbox for add character to closed
	$scope.topBoxCharInfoCollapsed = true; // Set the topbox for character info to closed
	
	//Set form options
	$scope.levels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,48,50,51,52,53,54,55];

	$scope.proflvls = ['10k+', '20k+', '30k+', '40k+', '50k+', '60k+', '70k+', '80k+', '90k'];
	
	$scope.races = ['Elf', 'Nuian', 'Firran', 'Harani'];
	
	$scope.genders = ['Male', 'Female'];
	
	$scope.houseTypes = [
		{name: 'Cottage', type: 'house', icon: 'cottage'},
		{name: 'Thatched Farmhouse', type: 'house', icon: 'farmhouse'},
		{name: 'Swept-Roof Chalet', type: 'house', icon: 'srchalet'},
		{name: 'Manor', type: 'house', icon: 'manor'},
		{name: 'Swept-Roof Manor', type: 'house', icon: 'srmanor'},
		{name: 'Chalet', type: 'house', icon: 'chalet'},
		{name: 'Breezy Bungalow', type: 'house', icon: 'bungalow'},
		{name: 'Wind-Swept Mansion', type: 'house', icon: 'wsmansion'},
		{name: 'Mansion', type: 'house', icon: 'mansion'}
	];
	$scope.farmTypes = [
		{name: '8x8 Scarecrow', type: 'farm', icon: 'scarecrowsm'},
		{name: '16x16 Scarecrow', type: 'farm', icon: 'scarecrowlg'},
		{name: 'Gazebo', type: 'farm', icon: 'gazebo'}
	];
	$scope.workstationTypes = [
		{name: 'Private Loom', type: 'workstation', icon: 'loom'},
		{name: 'Private Carpentry Bench', type: 'workstation', icon: 'carpentry'},
		{name: 'Private Masonry Table', type: 'workstation', icon: 'masonry'},
		{name: 'Private Smelter', type: 'workstation', icon: 'smelter'}
	];
	$scope.locations = [
		{name: 'Two Crowns'}, 
		{name: 'Sanddeep'}, 
		{name: 'Marianople'},
		{name: 'White Arden'},
		{name: 'Dewstone'},
		{name: 'Karkasse'},
		{name: 'Hellswamp'},
		{name: 'Gweonid Forest'}
	];
	
	$scope.proficiencies = [
		{name: 'Farming'},
		{name: 'Fishing'},
		{name: 'Gathering'},
		{name: 'Alchemy'},
		{name: 'Cooking'},
		{name: 'Construction'},
		{name: 'Handicrafts'},
		{name: 'Husbandry'},
		{name: 'Logging'},
		{name: 'Machining'},
		{name: 'Metalwork'},
		{name: 'Printing'},
		{name: 'Mining'},
		{name: 'Masonry'},
		{name: 'Tailoring'},
		{name: 'Leatherwork'},
		{name: 'Carpentry'},
		{name: 'Larceny'},
		{name: 'Commerce'},
		{name: 'Artistry'}
	];
	
	$scope.months = [
		{month: 'January', val: '01'},
		{month: 'February', val: '02'},
		{month: 'March', val: '03'},
		{month: 'April', val: '04'},
		{month: 'May', val: '05'},
		{month: 'June', val: '06'},
		{month: 'July', val: '07'},
		{month: 'August', val: '08'},
		{month: 'September', val: '09'},
		{month: 'October', val: '10'},		
		{month: 'November', val: '11'},
		{month: 'December', val: '12'}
	];
	
	$scope.days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];	
	$scope.hours = ['00','01','02','03','04','05','06','07','08','09',10,11,12,13,14,15,16,17,18,19,20,21,22,23];
	$scope.minutes = ['00','01','02','03','04','05','06','07','08','09',10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,48,50,51,52,53,54,55,56,57,58,59];
	
	// Add responsiveness to affixed infobox
	$(function() {
		var $affixElement = $('div[affix]');  // Grab the infobox when affixed
		$affixElement.width($affixElement.parent().width()); // Set width of infobox to width of parent element
	});	
	
	
	// [ Functions ]
	
	// goToTopBox() (Go to topbox)
	$scope.goToTopBox = function() {
		$scope.topBoxCollapsed = !$scope.topBoxCollapsed;
		if (!$scope.topBoxCollapsed) { // If topbox is collapsed
			$location.hash('topboxgoto'); // Set hash to topbox location (currently in navbar)
			$anchorScroll(); // Scroll to topbox hash
		} // (Otherwise it will collapse topbox and not scroll to hash)
	}; // /goToTopBox()
	
	// goToCharTopBox() (Go to topbox)
	$scope.goToCharTopBox = function() {
		$scope.topBoxCharCollapsed = !$scope.topBoxCharCollapsed;
		if (!$scope.topBoxCharCollapsed) { // If topbox is collapsed
			$location.hash('topboxgoto'); // Set hash to topbox location (currently in navbar)
			$anchorScroll(); // Scroll to topbox hash
		}
	}; // /goToTopBox()
	
	// goToCharInfoBox / Select Character
	$scope.goToCharInfoTopBox = function(character) {
		if ($scope.topBoxCharInfoCollapsed) { // If topbox is collapsed
			$scope.topBoxCharInfoCollapsed = false;
			$location.hash('topboxgoto'); // Set hash to topbox location (currently in navbar)
			$anchorScroll(); // Scroll to topbox hash
		}
		console.log(character);
		$scope.selectedCharacter = character;
		var characterID = $scope.selectedCharacter.$id;
		var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/characters/' + characterID + '/prof/'); // Get ref of character
		var profObj = $firebaseObject(ref);
		profObj.$loaded().then(function() {
			$scope.selectedCharacterProf = profObj;
			console.log(profObj);			
		})
	};
	
 	// statusCheck() (Check property tax due status)
    var statusCheck = function() {
		console.log("Status check starting..."); // Tell console we started
		angular.forEach(propertiesArr, function (property, key) { // forEach over properties in the properties array
			angular.forEach(property, function (val, key) { // forEach over values in each property 
				if (val!==null){ // If the val has a value...
					if (val.propowner!==undefined) { // ... and that value is the owner of the property (propowner)...
						whichOwner = val.propowner; // Set owner to whichOwner var
						whichProperty = key; // Set whichProperty to the properties hash
						var ref = new Firebase(FIREBASE_URL + '/users/' + userID + '/properties/' + whichOwner + '/' + whichProperty + '/'); // Get property ref
						var whichPropObj = $firebaseObject(ref); // Asign property to an object
						whichPropObj.$loaded().then(function() { // Once property object has loaded...
	
							// Variables
							var dueunix = whichPropObj.propduemoment; // Get the current tax due date in unix format for status calculation
							var nowunix = moment().unix().toString(); // Get the current moment in unix format for status calculation
							var oldduedate = whichPropObj.propduedateiso; // Get the current tax due date in ISO format for demo date calculation
							var demodate = moment(oldduedate).add(7, 'days'); // Calculate the demo date by adding 7 days to the current due date, applied below
							var demodateiso = moment(demodate).toISOString(); // Reformat above demodate var to ISO format for saving to whichPropObj
							var demodateformatted = moment(demodate).format('ddd, MMM Do [at] h:mm a'); // Reformat above demodate var to human readable format for saving to whichPropObj
							var timeBetween = dueunix-nowunix; // Calculate difference between due date and now
							
							
							// Set status
							if (nowunix > dueunix) { // If the current date is greater than the due date...
								whichPropObj.propstatus = 'overdue'; // Set status to overdue
								whichPropObj.propdemodateformatted = demodateformatted;  // Save human readable demo date to whichPropObj
								whichPropObj.propdemodate = demodateiso; // Save ISO demo date to whichPropObj
							} else if (timeBetween < 86400 && timeBetween > 0) { // If there is less than 24 hours until taxes are due...                     
								whichPropObj.propstatus = 'duesoon'; // Set due soon
							} else { // Otherwise set status to paid
								whichPropObj.propdemodate = ''; // Clear propdemodate var on whichPropObj
								whichPropObj.propstatus = 'paid'; // Set status to paid
							}
							whichPropObj.$save().then(function() { // Save status to whichPropObj then...
								console.log("Checked!"); // Tell console we checked the status
							}); //  /whichPropObj.$save()
						}); //  /whichPropObj.$loaded()			
					} //  /If val is property owner
				} //  /If val has value
			}); //  /forEach property value
		}); //  /forEach property
	}; // /statusCheck()
	
	// selectProperty() (Select a property)
    $scope.selectProperty = function(key, property) {
		var $elementHome = $('#' + key); // Get element that houses propInfo for selected property and acts as button in UI
		$scope.status.propInfo = true; // Open the property info panel of infobox
		if ($('.currentElm')[0]){  // If .currentElm exists, we already have a selected property and need to replace it
			var $oldElementHome = $('.currentElm').attr('id').substring(4); // Get home of currentElm, since ID of currentElm = "prop" + ID of its $elementHome
			$('.currentElm').appendTo('#' + $oldElementHome); // Reattach currentElm to previous home
			$('#' + $oldElementHome).removeClass('selectedProperty'); // Remove .selectedProperty from currentElm...
			$('.currentElm').removeClass('currentElm').addClass('ng-hide'); // ... and then class currentElm
			$elementHome.addClass('selectedProperty'); // Add .selectedProperty to selected property element for UI change
		} else { // Otherwise there is no currently selected property, so...
			$elementHome.addClass('selectedProperty'); // Add .selectedProperty to selected property element for UI change
		}
		var $newElm = $('.' + key); // Since each property has a class of its hash/key, grab selected property stats for infobox
		$newElm.appendTo('#prop-infobox'); // Append property stats to infobox
		$newElm.addClass('currentElm').removeClass('ng-hide'); // Show the element containing stats of selected property
	}; // /selectProperty()
	
	// addProperty() (Add a property)
	$scope.addProperty = function() { 
		// Variables
		var compiledDuedate = '2015-'+$scope.propduemonth+'-'+$scope.propdueday+'T'+$scope.propduehour+':'+$scope.propduemin+':'+'00'; // Compile user inputs into tax due date
		var duedate = moment(compiledDuedate).local(); // Create usable due date in local timezone
		var duedateunix = moment(duedate).unix(); // UNIX formatted due date
		var duedateiso = moment(duedate).toISOString(); // ISO formatted due date
		var duedatestring = duedateunix.toString(); // String formatted due date
		console.log($scope.propduemonth, $scope.propdueday, $scope.propduehour, $scope.propduemin);
		var compiledMomentDate = moment(duedate).format("ddd, MMM Do"); // Human readable date
		var compiledMomentTime = moment(duedate).format("h:mm a"); // Human readable time
		var compiledMomentDateString = compiledMomentDate.toString(); // Human readable date as string 
		var compiledMomentTimeString = compiledMomentTime.toString(); // Human readable time as string
		var ref = new Firebase(FIREBASE_URL + '/users/' + userID + '/properties/' + $scope.propowner); // Get ref of property owner
		var saveLocation = $firebaseArray(ref); // Create array from ref for save location
		var chosenProptype = $scope.chosenProptype.name; // Get property type from user input
		var chosenPropIcon = $scope.chosenProptype.icon; // Get property type icon from user input
			saveLocation.$add({ // Take all the data and add it to array as new record
				propowner: $scope.propowner, // Owner
				howmanypacks: 0, // Number of packs on property (packs not yet implemented)
				proplocation: $scope.chosenLocation.name, // Location
				propduemoment: duedatestring, // UNIX due date as string
				propduedateiso: duedateiso, // ISO due date
				propduedate: compiledMomentDateString, // Human readable due date as string
				propduetime: compiledMomentTimeString, // Human readable due time as string
				proptype: chosenProptype, // Property type
				icon: chosenPropIcon, // Property type icon
				propcategory: $scope.proptypes, // Property type category (house/farm/workstation)
				user: userID, // ID of currentUser
				created: Firebase.ServerValue.TIMESTAMP // Creation timestamp
			}).then(function() { // once data is saved to db...
				var id = ref.key(); // Get the key of our new property
				console.log("Added record with id " + id); // Tell console we added property
				$scope.topBoxCollapsed = !$scope.topBoxCollapsed; // Close the topbox
				$timeout(function () { // Wait a moment for changes to database
					statusCheck(); // Recheck status of properties
				}, 500);
			}); //  /saveLocation.$add()
	}; // /addProperty()

	// deleteProperty() (Delete a property)
	$scope.deleteProperty = function(key, property) {
		var r = confirm('press OK to delete property'); // Confirm user wants to delete property (ugly, need to make modal)
		if (r == true) { // If answer yes...
			var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties/' + property.propowner + '/' + key + '/'); // Get ref of property
			var whichPropObj = $firebaseObject(ref); // Create object from ref
			whichPropObj.$loaded().then(function() { // Once object is loaded...
				whichPropObj.$remove().then(function () { // Remove the property then...
					console.log('Property removed + ' + key); // Tell console we removed property
				}); //  /whichPropObj.$remove()
			}); //  /whichPropObj.$loaded()
		} //  / Confirmation
	}; // /deleteProperty()	
	
	// payTaxes() (Pay taxes on property)
	$scope.payTaxes = function(key,property) { 
		var r = confirm('press OK to pay taxes'); // Confirm user wants to pay taxes (ugly, need to make modal)
		if (r == true) { // If answer yes...
			var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties/' + property.propowner + '/' + key + '/'); // Get ref of property
			var whichPropObj = $firebaseObject(ref); // Create object from ref
			whichPropObj.$loaded().then(function() { // Once object is loaded...
				// Variables
				var oldduedate = whichPropObj.propduedateiso; // Get the current tax due date
				var duedate = moment(oldduedate).add(7, 'days'); // Set the new tax due date by adding 7 to current date
				var compiledMomentDate = moment(duedate).format("ddd, MMM Do"); // Human readable date var
				var compiledMomentTime = moment(duedate).format("h:mm a"); // Human readable time var
				var compiledMomentDateString = compiledMomentDate.toString(); // Human readable date var as string
				var compiledMomentTimeString = compiledMomentTime.toString(); // Human readable time var as string
				var duedateiso = moment(duedate).toISOString(); // ISO formatted due date for saving to whichPropObj
				var duedateunix = moment(duedate).unix(); // UNIX formmatted duedate for duedatestring var
				var duedatestring = duedateunix.toString(); // Due date as string for saving to whichPropObj
				whichPropObj.propduedate = compiledMomentDateString; // Save date string	
				whichPropObj.propduetime = compiledMomentTimeString; // Save time string
				whichPropObj.propduedateiso = duedateiso; // Save date ISO
				whichPropObj.propduemoment = duedatestring; // Save date+time string
				whichPropObj.propstatus = 'paid'; // Set status to paid
				whichPropObj.$save().then(function() { // Save data to whichPropObj then...
					console.log('paid, checking status'); // Tell console we paid taxes
					$scope.$broadcast('timer-clear'); // Clear countdown timer
					$timeout(function () { // Wait for timer to be cleared...
						$('#proptimer').attr('end-time', '"' + duedateiso + '"'); // ...then set timer end time to the new due date
					}, 100);	
					$timeout(function () { // Wait for new due date to be set...
						$scope.$broadcast('timer-start'); // ...then restart the timer
					}, 100);
					$compile($('timer'))($scope); // Recompile timer
					statusCheck(); // Check the status of properties again to update properties
				}); //  /whichPropObj.$save()
			}); //  /whichPropObj.$loaded()
		} //  /Confirmation
	}; //  /payTaxes()
	
	// addCharacter() (Add a character)
	$scope.addCharacter = function(key) {
		var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/characters/'); // Get ref of characters
		var saveLocation = $firebaseArray(ref); // Create array from ref
		saveLocation.$add({ // Take character data and add it to array as new record
			charname: $scope.charactername, // Name
			charlvl: $scope.characterlevel, // Level
			gender: $scope.charactergender,
			race: $scope.characterrace
		}).then(function(){
			$scope.topBoxCharCollapsed = !$scope.topBoxCharCollapsed; // Close character topbox
			console.log('Added ' + $scope.charactername + ' at level ' +$scope.characterlevel); // Tell console we added a character
		}); //  /saveLocation.$add()
	}; //  /addCharacter() 
	
	// deleteCharacter() (Delete a character)
	$scope.deleteCharacter = function(selectedCharacter) {
		var r = confirm('press OK to delete character'); // Confirm user wants to delete character (ugly, need to make modal)
		if (r == true) { // If answer yes...
			var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/characters/' + selectedCharacter + '/'); // Get ref of character
			var characterObj = $firebaseObject(ref); // Create object from ref
			characterObj.$loaded().then(function() {  // Once the object is loaded...
				var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties/' + characterObj.charname + '/'); // Get ref of character's properties	
				var propertyObj = $firebaseObject(ref); // Create object from ref
				var character = characterObj.charname; // Set character name for feedback
				propertyObj.$loaded().then(function() { // Once propertyObj is loaded...
					propertyObj.$remove().then(function() { // Remove character properties then...
						console.log('Character properties removed for ' + character); // Tell console we removed character's properties						
					}); //  /propertyObj.$remove()
				}); //  /propertyObj.$loaded()
				characterObj.$remove().then(function () { // Remove the character then...
					$scope.topBoxCharInfoCollapsed = !$scope.topBoxCharInfoCollapsed; // Close character info box
					console.log('Character removed: ' + character); // Tell console we removed character
				}); //  /characterObj.$remove()
			}); //  /characterObj.$loaded()
		} //  /Confirmation
	}; //  /deleteCharacter()
	
	// updateCharacter() (Update a character)
	$scope.updateCharacter = function($data, updateType, key) {
		if (updateType === undefined) {
			updateType = $scope.updateType;
		}
		var characterID = $scope.selectedCharacter.$id;
		var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/characters/' + characterID + '/'); // Get ref of character
		var characterObj = $firebaseObject(ref); // Create object from ref
		characterObj.$loaded().then(function() {
			if (updateType == 'level') {
				console.log('we got level');
				characterObj.charlvl = $data;
				characterObj.$save().then(function() {
					console.log('Changed ' + updateType);				
				});	
			} else if (updateType == 'proficiency') {
				ref.child('/prof/' + key + '/').set(
					$data
				);
			} else if (updateType == 'proficiencyNew') {
				ref.child('/prof/' + $scope.proficiencytype.name + '/').set(
					$scope.proficiencylvl
				);
				$scope.proficiencytype.name = '';
				$scope.proficiencylvl = '';
			}
		});
	};
}]); //  /PropertyCtrl
//############################
//# /controllers/redirect.js #
//############################

myApp.controller('RedirectCtrl', ['$scope', '$rootScope', '$window', '$timeout', '$state', '$stateParams', '$location', 'FIREBASE_URL', function($scope, $rootScope, $window, $timeout, $state, $stateParams, $location, FIREBASE_URL) {

	

// 	var redirect = function(){
// 		console.log('Trying to redirect...');
// 		$window.location = "#/properties";
// 	}
	
// 	$(document).ready(function() {
// 		console.log('loaded');

// 		$timeout(function () { // Wait a moment for changes to database
// 			redirect();
// 		}, 500);			

// 	/** this is come when complete page is fully loaded, including all frames, objects and images **/
// 	});
	
// 	scope.$apply(function() { $location.path("/property"); });


	
// 	redirect();
	
}]);
//################################
//# /controllers/registration.js #
//################################

myApp.controller('RegistrationCtrl', ['$scope', '$rootScope', '$timeout', '$firebaseAuth', '$location', '$state', '$stateParams', 'Authentication', 'FIREBASE_URL', function($scope, $rootScope, $timeout, $firebaseAuth, $location, $state, $stateParams, Authentication, FIREBASE_URL) {
	
	$scope.races = ['Elf', 'Nuian', 'Firran', 'Harani'];
	$scope.genders = ['Male', 'Female'];	
	
	
	// [ Variables ]
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);
	
	// Registered servers and guilds
	$scope.servers = [
		{name: 'Inoch', guilds: [
			{name: 'Waterdeep'}
		]}
	]
	
	// [ Functions ]
	// login()
	$scope.login = function() {
		Authentication.login($scope.user)
		.then(function(user) {
			$location.path('/properties');
		}).catch(function(error) {
			$scope.message = error.message;
			console.log(error.message);
		});
	}; // /login()

	// register()
	$scope.register = function() {
		Authentication.register($scope.user)
		.then(function(user) {
			console.log('User created!');
			Authentication.login($scope.user);
			$timeout(function () {
				$location.path('/properties');
			}, 500);
		}).catch(function(error) {
			$scope.regMessage = error.message;
			console.log($scope.regMessage);
		});
	}; //  /register()
	
	$scope.regRequest = function() {
		$scope.regRequested = true;
		console.log('Requested');
	}
}]);
myApp.controller('StatusCtrl', ['$scope', '$rootScope', '$location', '$state', '$stateParams', 'FIREBASE_URL', 'Authentication', function($scope, $rootScope, $location, $state, $stateParams, FIREBASE_URL, Authentication) {
	
	$scope.logout = function() {
		Authentication.logout();
		$location.path('/tlm');
	}

}]);
/**
 * angular-timer - v1.2.0 - 2014-12-15 6:34 PM
 * https://github.com/siddii/angular-timer
 *
 * Copyright (c) 2014 Siddique Hameed
 * Licensed MIT <https://github.com/siddii/angular-timer/blob/master/LICENSE.txt>
 */
var timerModule=angular.module("timer",[]).directive("timer",["$compile",function(a){return{restrict:"EA",replace:!1,scope:{interval:"=interval",startTimeAttr:"=startTime",endTimeAttr:"=endTime",countdownattr:"=countdown",finishCallback:"&finishCallback",autoStart:"&autoStart",maxTimeUnit:"="},controller:["$scope","$element","$attrs","$timeout",function(b,c,d,e){function f(){b.timeoutId&&clearTimeout(b.timeoutId)}function g(){void 0!==d.startTime&&(b.millis=new Date-new Date(b.startTimeAttr)),b.maxTimeUnit&&"day"!==b.maxTimeUnit?"second"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3),b.minutes=0,b.hours=0,b.days=0,b.months=0,b.years=0):"minute"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4),b.hours=0,b.days=0,b.months=0,b.years=0):"hour"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5),b.days=0,b.months=0,b.years=0):"month"===b.maxTimeUnit?(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24%30),b.months=Math.floor(b.millis/36e5/24/30),b.years=0):"year"===b.maxTimeUnit&&(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24%30),b.months=Math.floor(b.millis/36e5/24/30%12),b.years=Math.floor(b.millis/36e5/24/365)):(b.seconds=Math.floor(b.millis/1e3%60),b.minutes=Math.floor(b.millis/6e4%60),b.hours=Math.floor(b.millis/36e5%24),b.days=Math.floor(b.millis/36e5/24),b.months=0,b.years=0),b.secondsS=1===b.seconds?"":"s",b.minutesS=1===b.minutes?"":"s",b.hoursS=1===b.hours?"":"s",b.daysS=1===b.days?"":"s",b.monthsS=1===b.months?"":"s",b.yearsS=1===b.years?"":"s",b.secondUnit=function(a,c){return 1===b.seconds?a?a:"second":c?c:"seconds"},b.minuteUnit=function(a,c){return 1===b.minutes?a?a:"minute":c?c:"minutes"},b.hourUnit=function(a,c){return 1===b.hours?a?a:"hour":c?c:"hours"},b.dayUnit=function(a,c){return 1===b.days?a?a:"day":c?c:"days"},b.monthUnit=function(a,c){return 1===b.months?a?a:"month":c?c:"months"},b.yearUnit=function(a,c){return 1===b.years?a?a:"year":c?c:"years"},b.sseconds=b.seconds<10?"0"+b.seconds:b.seconds,b.mminutes=b.minutes<10?"0"+b.minutes:b.minutes,b.hhours=b.hours<10?"0"+b.hours:b.hours,b.ddays=b.days<10?"0"+b.days:b.days,b.mmonths=b.months<10?"0"+b.months:b.months,b.yyears=b.years<10?"0"+b.years:b.years}"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),b.autoStart=d.autoStart||d.autostart,c.append(0===c.html().trim().length?a("<span>{{millis}}</span>")(b):a(c.contents())(b)),b.startTime=null,b.endTime=null,b.timeoutId=null,b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>=0?parseInt(b.countdownattr,10):void 0,b.isRunning=!1,b.$on("timer-start",function(){b.start()}),b.$on("timer-resume",function(){b.resume()}),b.$on("timer-stop",function(){b.stop()}),b.$on("timer-clear",function(){b.clear()}),b.$on("timer-reset",function(){b.reset()}),b.$on("timer-set-countdown",function(a,c){b.countdown=c}),b.start=c[0].start=function(){b.startTime=b.startTimeAttr?new Date(b.startTimeAttr):new Date,b.endTime=b.endTimeAttr?new Date(b.endTimeAttr):null,b.countdown||(b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>0?parseInt(b.countdownattr,10):void 0),f(),h(),b.isRunning=!0},b.resume=c[0].resume=function(){f(),b.countdownattr&&(b.countdown+=1),b.startTime=new Date-(b.stoppedTime-b.startTime),h(),b.isRunning=!0},b.stop=b.pause=c[0].stop=c[0].pause=function(){var a=b.timeoutId;b.clear(),b.$emit("timer-stopped",{timeoutId:a,millis:b.millis,seconds:b.seconds,minutes:b.minutes,hours:b.hours,days:b.days})},b.clear=c[0].clear=function(){b.stoppedTime=new Date,f(),b.timeoutId=null,b.isRunning=!1},b.reset=c[0].reset=function(){b.startTime=b.startTimeAttr?new Date(b.startTimeAttr):new Date,b.endTime=b.endTimeAttr?new Date(b.endTimeAttr):null,b.countdown=b.countdownattr&&parseInt(b.countdownattr,10)>0?parseInt(b.countdownattr,10):void 0,f(),h(),b.isRunning=!1,b.clear()},c.bind("$destroy",function(){f(),b.isRunning=!1}),b.countdownattr?(b.millis=1e3*b.countdownattr,b.addCDSeconds=c[0].addCDSeconds=function(a){b.countdown+=a,b.$digest(),b.isRunning||b.start()},b.$on("timer-add-cd-seconds",function(a,c){e(function(){b.addCDSeconds(c)})}),b.$on("timer-set-countdown-seconds",function(a,c){b.isRunning||b.clear(),b.countdown=c,b.millis=1e3*c,g()})):b.millis=0,g();var h=function(){b.millis=new Date-b.startTime;var a=b.millis%1e3;return b.endTimeAttr&&(b.millis=b.endTime-new Date,a=b.interval-b.millis%1e3),b.countdownattr&&(b.millis=1e3*b.countdown),b.millis<0?(b.stop(),b.millis=0,g(),void(b.finishCallback&&b.$eval(b.finishCallback))):(g(),b.timeoutId=setTimeout(function(){h(),b.$digest()},b.interval-a),b.$emit("timer-tick",{timeoutId:b.timeoutId,millis:b.millis}),void(b.countdown>0?b.countdown--:b.countdown<=0&&(b.stop(),b.finishCallback&&b.$eval(b.finishCallback))))};(void 0===b.autoStart||b.autoStart===!0)&&b.start()}]}}]);"undefined"!=typeof module&&"undefined"!=typeof exports&&module.exports===exports&&(module.exports=timerModule);
/**
 * @author Manuel Mazzuola
 * https://github.com/manuelmazzuola/angular-ui-router-styles
 * Inspired by https://github.com/tennisgent/angular-route-styles
 */

'use strict';

angular
  .module('uiRouterStyles', ['ui.router'])
  .directive('head', ['$rootScope', '$compile', '$state', '$interpolate',
    function($rootScope, $compile, $state, $interpolate) {
      return {
        restrict: 'E',
        link: function(scope, elem){
          var start = $interpolate.startSymbol(),
              end = $interpolate.endSymbol();
          var html = '<link rel="stylesheet" ng-repeat="(k, css) in routeStyles track by k" ng-href="' + start + 'css' + end + '" >';
          elem.append($compile(html)(scope));

          // Get the parent state
          var $$parentState = function(state) {
            // Check if state has explicit parent OR we try guess parent from its name
            var name = state.parent || (/^(.+)\.[^.]+$/.exec(state.name) || [])[1];
            // If we were able to figure out parent name then get this state
            return name && $state.get(name);
          };

          scope.routeStyles = [];
          $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
            // From current state to the root
            scope.routeStyles = [];
            for(var state = toState; state && state.name !== ''; state=$$parentState(state)) {
              if(state && state.data && state.data.css) {
                if(!Array.isArray(state.data.css)) {
                  state.data.css = [state.data.css];
                }
                angular.forEach(state.data.css, function(css) {
                  if(scope.routeStyles.indexOf(css) === -1) {
                    scope.routeStyles.push(css);
                  }
                });
              }
            }
            scope.routeStyles.reverse();
          });
        }
      };
    }
  ]);
//! moment.js
//! version : 2.9.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com

(function (undefined) {
    /************************************
        Constants
    ************************************/

    var moment,
        VERSION = '2.9.0',
        // the global-scope this is NOT the global object in Node.js
        globalScope = (typeof global !== 'undefined' && (typeof window === 'undefined' || window === global.window)) ? global : this,
        oldGlobalMoment,
        round = Math.round,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        i,

        YEAR = 0,
        MONTH = 1,
        DATE = 2,
        HOUR = 3,
        MINUTE = 4,
        SECOND = 5,
        MILLISECOND = 6,

        // internal storage for locale config files
        locales = {},

        // extra moment internal properties (plugins register props here)
        momentProperties = [],

        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module && module.exports),

        // ASP.NET json date format regex
        aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
        aspNetTimeSpanJsonRegex = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/,

        // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
        // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
        isoDurationRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/,

        // format tokens
        formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|x|X|zz?|ZZ?|.)/g,
        localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,

        // parsing token regexes
        parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
        parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
        parseTokenOneToFourDigits = /\d{1,4}/, // 0 - 9999
        parseTokenOneToSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
        parseTokenDigits = /\d+/, // nonzero number of digits
        parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, // any word (or two) characters or numbers including two/three word month in arabic.
        parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/gi, // +00:00 -00:00 +0000 -0000 or Z
        parseTokenT = /T/i, // T (ISO separator)
        parseTokenOffsetMs = /[\+\-]?\d+/, // 1234567890123
        parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123

        //strict parsing regexes
        parseTokenOneDigit = /\d/, // 0 - 9
        parseTokenTwoDigits = /\d\d/, // 00 - 99
        parseTokenThreeDigits = /\d{3}/, // 000 - 999
        parseTokenFourDigits = /\d{4}/, // 0000 - 9999
        parseTokenSixDigits = /[+-]?\d{6}/, // -999,999 - 999,999
        parseTokenSignedNumber = /[+-]?\d+/, // -inf - inf

        // iso 8601 regex
        // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
        isoRegex = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/,

        isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',

        isoDates = [
            ['YYYYYY-MM-DD', /[+-]\d{6}-\d{2}-\d{2}/],
            ['YYYY-MM-DD', /\d{4}-\d{2}-\d{2}/],
            ['GGGG-[W]WW-E', /\d{4}-W\d{2}-\d/],
            ['GGGG-[W]WW', /\d{4}-W\d{2}/],
            ['YYYY-DDD', /\d{4}-\d{3}/]
        ],

        // iso time formats and regexes
        isoTimes = [
            ['HH:mm:ss.SSSS', /(T| )\d\d:\d\d:\d\d\.\d+/],
            ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
            ['HH:mm', /(T| )\d\d:\d\d/],
            ['HH', /(T| )\d\d/]
        ],

        // timezone chunker '+10:00' > ['10', '00'] or '-1530' > ['-', '15', '30']
        parseTimezoneChunker = /([\+\-]|\d\d)/gi,

        // getter and setter names
        proxyGettersAndSetters = 'Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
        unitMillisecondFactors = {
            'Milliseconds' : 1,
            'Seconds' : 1e3,
            'Minutes' : 6e4,
            'Hours' : 36e5,
            'Days' : 864e5,
            'Months' : 2592e6,
            'Years' : 31536e6
        },

        unitAliases = {
            ms : 'millisecond',
            s : 'second',
            m : 'minute',
            h : 'hour',
            d : 'day',
            D : 'date',
            w : 'week',
            W : 'isoWeek',
            M : 'month',
            Q : 'quarter',
            y : 'year',
            DDD : 'dayOfYear',
            e : 'weekday',
            E : 'isoWeekday',
            gg: 'weekYear',
            GG: 'isoWeekYear'
        },

        camelFunctions = {
            dayofyear : 'dayOfYear',
            isoweekday : 'isoWeekday',
            isoweek : 'isoWeek',
            weekyear : 'weekYear',
            isoweekyear : 'isoWeekYear'
        },

        // format function strings
        formatFunctions = {},

        // default relative time thresholds
        relativeTimeThresholds = {
            s: 45,  // seconds to minute
            m: 45,  // minutes to hour
            h: 22,  // hours to day
            d: 26,  // days to month
            M: 11   // months to year
        },

        // tokens to ordinalize and pad
        ordinalizeTokens = 'DDD w W M D d'.split(' '),
        paddedTokens = 'M D H h m s w W'.split(' '),

        formatTokenFunctions = {
            M    : function () {
                return this.month() + 1;
            },
            MMM  : function (format) {
                return this.localeData().monthsShort(this, format);
            },
            MMMM : function (format) {
                return this.localeData().months(this, format);
            },
            D    : function () {
                return this.date();
            },
            DDD  : function () {
                return this.dayOfYear();
            },
            d    : function () {
                return this.day();
            },
            dd   : function (format) {
                return this.localeData().weekdaysMin(this, format);
            },
            ddd  : function (format) {
                return this.localeData().weekdaysShort(this, format);
            },
            dddd : function (format) {
                return this.localeData().weekdays(this, format);
            },
            w    : function () {
                return this.week();
            },
            W    : function () {
                return this.isoWeek();
            },
            YY   : function () {
                return leftZeroFill(this.year() % 100, 2);
            },
            YYYY : function () {
                return leftZeroFill(this.year(), 4);
            },
            YYYYY : function () {
                return leftZeroFill(this.year(), 5);
            },
            YYYYYY : function () {
                var y = this.year(), sign = y >= 0 ? '+' : '-';
                return sign + leftZeroFill(Math.abs(y), 6);
            },
            gg   : function () {
                return leftZeroFill(this.weekYear() % 100, 2);
            },
            gggg : function () {
                return leftZeroFill(this.weekYear(), 4);
            },
            ggggg : function () {
                return leftZeroFill(this.weekYear(), 5);
            },
            GG   : function () {
                return leftZeroFill(this.isoWeekYear() % 100, 2);
            },
            GGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 4);
            },
            GGGGG : function () {
                return leftZeroFill(this.isoWeekYear(), 5);
            },
            e : function () {
                return this.weekday();
            },
            E : function () {
                return this.isoWeekday();
            },
            a    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), true);
            },
            A    : function () {
                return this.localeData().meridiem(this.hours(), this.minutes(), false);
            },
            H    : function () {
                return this.hours();
            },
            h    : function () {
                return this.hours() % 12 || 12;
            },
            m    : function () {
                return this.minutes();
            },
            s    : function () {
                return this.seconds();
            },
            S    : function () {
                return toInt(this.milliseconds() / 100);
            },
            SS   : function () {
                return leftZeroFill(toInt(this.milliseconds() / 10), 2);
            },
            SSS  : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            SSSS : function () {
                return leftZeroFill(this.milliseconds(), 3);
            },
            Z    : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + ':' + leftZeroFill(toInt(a) % 60, 2);
            },
            ZZ   : function () {
                var a = this.utcOffset(),
                    b = '+';
                if (a < 0) {
                    a = -a;
                    b = '-';
                }
                return b + leftZeroFill(toInt(a / 60), 2) + leftZeroFill(toInt(a) % 60, 2);
            },
            z : function () {
                return this.zoneAbbr();
            },
            zz : function () {
                return this.zoneName();
            },
            x    : function () {
                return this.valueOf();
            },
            X    : function () {
                return this.unix();
            },
            Q : function () {
                return this.quarter();
            }
        },

        deprecations = {},

        lists = ['months', 'monthsShort', 'weekdays', 'weekdaysShort', 'weekdaysMin'],

        updateInProgress = false;

    // Pick the first defined of two or three arguments. dfl comes from
    // default.
    function dfl(a, b, c) {
        switch (arguments.length) {
            case 2: return a != null ? a : b;
            case 3: return a != null ? a : b != null ? b : c;
            default: throw new Error('Implement me');
        }
    }

    function hasOwnProp(a, b) {
        return hasOwnProperty.call(a, b);
    }

    function defaultParsingFlags() {
        // We need to deep clone this object, and es5 standard is not very
        // helpful.
        return {
            empty : false,
            unusedTokens : [],
            unusedInput : [],
            overflow : -2,
            charsLeftOver : 0,
            nullInput : false,
            invalidMonth : null,
            invalidFormat : false,
            userInvalidated : false,
            iso: false
        };
    }

    function printMsg(msg) {
        if (moment.suppressDeprecationWarnings === false &&
                typeof console !== 'undefined' && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                printMsg(msg);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            printMsg(msg);
            deprecations[name] = true;
        }
    }

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.localeData().ordinal(func.call(this, a), period);
        };
    }

    function monthDiff(a, b) {
        // difference in months
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            // b is in (anchor - 1 month, anchor + 1 month)
            anchor = a.clone().add(wholeMonthDiff, 'months'),
            anchor2, adjust;

        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            // linear across the month
            adjust = (b - anchor) / (anchor2 - anchor);
        }

        return -(wholeMonthDiff + adjust);
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i], i);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);


    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;

        if (meridiem == null) {
            // nothing to do
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            // Fallback
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            // thie is not supposed to happen
            return hour;
        }
    }

    /************************************
        Constructors
    ************************************/

    function Locale() {
    }

    // Moment prototype object
    function Moment(config, skipOverflow) {
        if (skipOverflow !== false) {
            checkOverflow(config);
        }
        copyConfig(this, config);
        this._d = new Date(+config._d);
        // Prevent infinite loop in case updateOffset creates new moment
        // objects.
        if (updateInProgress === false) {
            updateInProgress = true;
            moment.updateOffset(this);
            updateInProgress = false;
        }
    }

    // Duration Constructor
    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration),
            years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0,
            months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0,
            days = normalizedInput.day || 0,
            hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0,
            seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;

        // representation for dateAddRemove
        this._milliseconds = +milliseconds +
            seconds * 1e3 + // 1000
            minutes * 6e4 + // 1000 * 60
            hours * 36e5; // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = +days +
            weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = +months +
            quarters * 3 +
            years * 12;

        this._data = {};

        this._locale = moment.localeData();

        this._bubble();
    }

    /************************************
        Helpers
    ************************************/


    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }

        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function copyConfig(to, from) {
        var i, prop, val;

        if (typeof from._isAMomentObject !== 'undefined') {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (typeof from._i !== 'undefined') {
            to._i = from._i;
        }
        if (typeof from._f !== 'undefined') {
            to._f = from._f;
        }
        if (typeof from._l !== 'undefined') {
            to._l = from._l;
        }
        if (typeof from._strict !== 'undefined') {
            to._strict = from._strict;
        }
        if (typeof from._tzm !== 'undefined') {
            to._tzm = from._tzm;
        }
        if (typeof from._isUTC !== 'undefined') {
            to._isUTC = from._isUTC;
        }
        if (typeof from._offset !== 'undefined') {
            to._offset = from._offset;
        }
        if (typeof from._pf !== 'undefined') {
            to._pf = from._pf;
        }
        if (typeof from._locale !== 'undefined') {
            to._locale = from._locale;
        }

        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (typeof val !== 'undefined') {
                    to[prop] = val;
                }
            }
        }

        return to;
    }

    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength, forceSign) {
        var output = '' + Math.abs(number),
            sign = number >= 0;

        while (output.length < targetLength) {
            output = '0' + output;
        }
        return (sign ? (forceSign ? '+' : '') : '-') + output;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};

        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }

        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

        return res;
    }

    function momentsDifference(base, other) {
        var res;
        other = makeAs(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }

        return res;
    }

    // TODO: remove 'name' arg after deprecation is removed
    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            //invert the arguments, but complain about it
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val; val = period; period = tmp;
            }

            val = typeof val === 'string' ? +val : val;
            dur = moment.duration(val, period);
            addOrSubtractDurationFromMoment(this, dur, direction);
            return this;
        };
    }

    function addOrSubtractDurationFromMoment(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds,
            days = duration._days,
            months = duration._months;
        updateOffset = updateOffset == null ? true : updateOffset;

        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            rawSetter(mom, 'Date', rawGetter(mom, 'Date') + days * isAdding);
        }
        if (months) {
            rawMonthSetter(mom, rawGetter(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            moment.updateOffset(mom, days || months);
        }
    }

    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return Object.prototype.toString.call(input) === '[object Date]' ||
            input instanceof Date;
    }

    // compare two arrays, return the number of differences
    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length),
            lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0,
            i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) ||
                (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function normalizeUnits(units) {
        if (units) {
            var lowered = units.toLowerCase().replace(/(.)s$/, '$1');
            units = unitAliases[units] || camelFunctions[lowered] || lowered;
        }
        return units;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {},
            normalizedProp,
            prop;

        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }

        return normalizedInput;
    }

    function makeList(field) {
        var count, setter;

        if (field.indexOf('week') === 0) {
            count = 7;
            setter = 'day';
        }
        else if (field.indexOf('month') === 0) {
            count = 12;
            setter = 'month';
        }
        else {
            return;
        }

        moment[field] = function (format, index) {
            var i, getter,
                method = moment._locale[field],
                results = [];

            if (typeof format === 'number') {
                index = format;
                format = undefined;
            }

            getter = function (i) {
                var m = moment().utc().set(setter, i);
                return method.call(moment._locale, m, format || '');
            };

            if (index != null) {
                return getter(index);
            }
            else {
                for (i = 0; i < count; i++) {
                    results.push(getter(i));
                }
                return results;
            }
        };
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion,
            value = 0;

        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            if (coercedNumber >= 0) {
                value = Math.floor(coercedNumber);
            } else {
                value = Math.ceil(coercedNumber);
            }
        }

        return value;
    }

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    function weeksInYear(year, dow, doy) {
        return weekOfYear(moment([year, 11, 31 + dow - doy]), dow, doy).week;
    }

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    function checkOverflow(m) {
        var overflow;
        if (m._a && m._pf.overflow === -2) {
            overflow =
                m._a[MONTH] < 0 || m._a[MONTH] > 11 ? MONTH :
                m._a[DATE] < 1 || m._a[DATE] > daysInMonth(m._a[YEAR], m._a[MONTH]) ? DATE :
                m._a[HOUR] < 0 || m._a[HOUR] > 24 ||
                    (m._a[HOUR] === 24 && (m._a[MINUTE] !== 0 ||
                                           m._a[SECOND] !== 0 ||
                                           m._a[MILLISECOND] !== 0)) ? HOUR :
                m._a[MINUTE] < 0 || m._a[MINUTE] > 59 ? MINUTE :
                m._a[SECOND] < 0 || m._a[SECOND] > 59 ? SECOND :
                m._a[MILLISECOND] < 0 || m._a[MILLISECOND] > 999 ? MILLISECOND :
                -1;

            if (m._pf._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }

            m._pf.overflow = overflow;
        }
    }

    function isValid(m) {
        if (m._isValid == null) {
            m._isValid = !isNaN(m._d.getTime()) &&
                m._pf.overflow < 0 &&
                !m._pf.empty &&
                !m._pf.invalidMonth &&
                !m._pf.nullInput &&
                !m._pf.invalidFormat &&
                !m._pf.userInvalidated;

            if (m._strict) {
                m._isValid = m._isValid &&
                    m._pf.charsLeftOver === 0 &&
                    m._pf.unusedTokens.length === 0 &&
                    m._pf.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    // pick the locale from the array
    // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
    // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
    function chooseLocale(names) {
        var i = 0, j, next, locale, split;

        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    //the next array item is better than a shallower substring of this one
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && hasModule) {
            try {
                oldLocale = moment.locale();
                require('./locale/' + name);
                // because defineLocale currently also sets the global locale, we want to undo that for lazy loaded locales
                moment.locale(oldLocale);
            } catch (e) { }
        }
        return locales[name];
    }

    // Return a moment from input, that is local/utc/utcOffset equivalent to
    // model.
    function makeAs(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (moment.isMoment(input) || isDate(input) ?
                    +input : +moment(input)) - (+res);
            // Use low-level api, because this fn is low-level api.
            res._d.setTime(+res._d + diff);
            moment.updateOffset(res, false);
            return res;
        } else {
            return moment(input).local();
        }
    }

    /************************************
        Locale
    ************************************/


    extend(Locale.prototype, {

        set : function (config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === 'function') {
                    this[i] = prop;
                } else {
                    this['_' + i] = prop;
                }
            }
            // Lenient ordinal parsing accepts just a number in addition to
            // number + (possibly) stuff coming from _ordinalParseLenient.
            this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + /\d{1,2}/.source);
        },

        _months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
        months : function (m) {
            return this._months[m.month()];
        },

        _monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
        monthsShort : function (m) {
            return this._monthsShort[m.month()];
        },

        monthsParse : function (monthName, format, strict) {
            var i, mom, regex;

            if (!this._monthsParse) {
                this._monthsParse = [];
                this._longMonthsParse = [];
                this._shortMonthsParse = [];
            }

            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                mom = moment.utc([2000, i]);
                if (strict && !this._longMonthsParse[i]) {
                    this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                    this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
                }
                if (!strict && !this._monthsParse[i]) {
                    regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                    this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                    return i;
                } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                    return i;
                } else if (!strict && this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },

        _weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
        weekdays : function (m) {
            return this._weekdays[m.day()];
        },

        _weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
        weekdaysShort : function (m) {
            return this._weekdaysShort[m.day()];
        },

        _weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
        weekdaysMin : function (m) {
            return this._weekdaysMin[m.day()];
        },

        weekdaysParse : function (weekdayName) {
            var i, mom, regex;

            if (!this._weekdaysParse) {
                this._weekdaysParse = [];
            }

            for (i = 0; i < 7; i++) {
                // make the regex if we don't have it already
                if (!this._weekdaysParse[i]) {
                    mom = moment([2000, 1]).day(i);
                    regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                    this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
                }
                // test the regex
                if (this._weekdaysParse[i].test(weekdayName)) {
                    return i;
                }
            }
        },

        _longDateFormat : {
            LTS : 'h:mm:ss A',
            LT : 'h:mm A',
            L : 'MM/DD/YYYY',
            LL : 'MMMM D, YYYY',
            LLL : 'MMMM D, YYYY LT',
            LLLL : 'dddd, MMMM D, YYYY LT'
        },
        longDateFormat : function (key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },

        isPM : function (input) {
            // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
            // Using charAt should be more compatible.
            return ((input + '').toLowerCase().charAt(0) === 'p');
        },

        _meridiemParse : /[ap]\.?m?\.?/i,
        meridiem : function (hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? 'pm' : 'PM';
            } else {
                return isLower ? 'am' : 'AM';
            }
        },


        _calendar : {
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            nextWeek : 'dddd [at] LT',
            lastDay : '[Yesterday at] LT',
            lastWeek : '[Last] dddd [at] LT',
            sameElse : 'L'
        },
        calendar : function (key, mom, now) {
            var output = this._calendar[key];
            return typeof output === 'function' ? output.apply(mom, [now]) : output;
        },

        _relativeTime : {
            future : 'in %s',
            past : '%s ago',
            s : 'a few seconds',
            m : 'a minute',
            mm : '%d minutes',
            h : 'an hour',
            hh : '%d hours',
            d : 'a day',
            dd : '%d days',
            M : 'a month',
            MM : '%d months',
            y : 'a year',
            yy : '%d years'
        },

        relativeTime : function (number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return (typeof output === 'function') ?
                output(number, withoutSuffix, string, isFuture) :
                output.replace(/%d/i, number);
        },

        pastFuture : function (diff, output) {
            var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
            return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
        },

        ordinal : function (number) {
            return this._ordinal.replace('%d', number);
        },
        _ordinal : '%d',
        _ordinalParse : /\d{1,2}/,

        preparse : function (string) {
            return string;
        },

        postformat : function (string) {
            return string;
        },

        week : function (mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy).week;
        },

        _week : {
            dow : 0, // Sunday is the first day of the week.
            doy : 6  // The week that contains Jan 1st is the first week of the year.
        },

        firstDayOfWeek : function () {
            return this._week.dow;
        },

        firstDayOfYear : function () {
            return this._week.doy;
        },

        _invalidDate: 'Invalid date',
        invalidDate: function () {
            return this._invalidDate;
        }
    });

    /************************************
        Formatting
    ************************************/


    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;

        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }

        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    // format date using native date object
    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }

        format = expandFormat(format, m.localeData());

        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }

        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }

        return format;
    }


    /************************************
        Parsing
    ************************************/


    // get the regex to find the next token
    function getParseRegexForToken(token, config) {
        var a, strict = config._strict;
        switch (token) {
        case 'Q':
            return parseTokenOneDigit;
        case 'DDDD':
            return parseTokenThreeDigits;
        case 'YYYY':
        case 'GGGG':
        case 'gggg':
            return strict ? parseTokenFourDigits : parseTokenOneToFourDigits;
        case 'Y':
        case 'G':
        case 'g':
            return parseTokenSignedNumber;
        case 'YYYYYY':
        case 'YYYYY':
        case 'GGGGG':
        case 'ggggg':
            return strict ? parseTokenSixDigits : parseTokenOneToSixDigits;
        case 'S':
            if (strict) {
                return parseTokenOneDigit;
            }
            /* falls through */
        case 'SS':
            if (strict) {
                return parseTokenTwoDigits;
            }
            /* falls through */
        case 'SSS':
            if (strict) {
                return parseTokenThreeDigits;
            }
            /* falls through */
        case 'DDD':
            return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
            return parseTokenWord;
        case 'a':
        case 'A':
            return config._locale._meridiemParse;
        case 'x':
            return parseTokenOffsetMs;
        case 'X':
            return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
            return parseTokenTimezone;
        case 'T':
            return parseTokenT;
        case 'SSSS':
            return parseTokenDigits;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'GG':
        case 'gg':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'ww':
        case 'WW':
            return strict ? parseTokenTwoDigits : parseTokenOneOrTwoDigits;
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
        case 'w':
        case 'W':
        case 'e':
        case 'E':
            return parseTokenOneOrTwoDigits;
        case 'Do':
            return strict ? config._locale._ordinalParse : config._locale._ordinalParseLenient;
        default :
            a = new RegExp(regexpEscape(unescapeFormat(token.replace('\\', '')), 'i'));
            return a;
        }
    }

    function utcOffsetFromString(string) {
        string = string || '';
        var possibleTzMatches = (string.match(parseTokenTimezone) || []),
            tzChunk = possibleTzMatches[possibleTzMatches.length - 1] || [],
            parts = (tzChunk + '').match(parseTimezoneChunker) || ['-', 0, 0],
            minutes = +(parts[1] * 60) + toInt(parts[2]);

        return parts[0] === '+' ? minutes : -minutes;
    }

    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, datePartArray = config._a;

        switch (token) {
        // QUARTER
        case 'Q':
            if (input != null) {
                datePartArray[MONTH] = (toInt(input) - 1) * 3;
            }
            break;
        // MONTH
        case 'M' : // fall through to MM
        case 'MM' :
            if (input != null) {
                datePartArray[MONTH] = toInt(input) - 1;
            }
            break;
        case 'MMM' : // fall through to MMMM
        case 'MMMM' :
            a = config._locale.monthsParse(input, token, config._strict);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[MONTH] = a;
            } else {
                config._pf.invalidMonth = input;
            }
            break;
        // DAY OF MONTH
        case 'D' : // fall through to DD
        case 'DD' :
            if (input != null) {
                datePartArray[DATE] = toInt(input);
            }
            break;
        case 'Do' :
            if (input != null) {
                datePartArray[DATE] = toInt(parseInt(
                            input.match(/\d{1,2}/)[0], 10));
            }
            break;
        // DAY OF YEAR
        case 'DDD' : // fall through to DDDD
        case 'DDDD' :
            if (input != null) {
                config._dayOfYear = toInt(input);
            }

            break;
        // YEAR
        case 'YY' :
            datePartArray[YEAR] = moment.parseTwoDigitYear(input);
            break;
        case 'YYYY' :
        case 'YYYYY' :
        case 'YYYYYY' :
            datePartArray[YEAR] = toInt(input);
            break;
        // AM / PM
        case 'a' : // fall through to A
        case 'A' :
            config._meridiem = input;
            // config._isPm = config._locale.isPM(input);
            break;
        // HOUR
        case 'h' : // fall through to hh
        case 'hh' :
            config._pf.bigHour = true;
            /* falls through */
        case 'H' : // fall through to HH
        case 'HH' :
            datePartArray[HOUR] = toInt(input);
            break;
        // MINUTE
        case 'm' : // fall through to mm
        case 'mm' :
            datePartArray[MINUTE] = toInt(input);
            break;
        // SECOND
        case 's' : // fall through to ss
        case 'ss' :
            datePartArray[SECOND] = toInt(input);
            break;
        // MILLISECOND
        case 'S' :
        case 'SS' :
        case 'SSS' :
        case 'SSSS' :
            datePartArray[MILLISECOND] = toInt(('0.' + input) * 1000);
            break;
        // UNIX OFFSET (MILLISECONDS)
        case 'x':
            config._d = new Date(toInt(input));
            break;
        // UNIX TIMESTAMP WITH MS
        case 'X':
            config._d = new Date(parseFloat(input) * 1000);
            break;
        // TIMEZONE
        case 'Z' : // fall through to ZZ
        case 'ZZ' :
            config._useUTC = true;
            config._tzm = utcOffsetFromString(input);
            break;
        // WEEKDAY - human
        case 'dd':
        case 'ddd':
        case 'dddd':
            a = config._locale.weekdaysParse(input);
            // if we didn't get a weekday name, mark the date as invalid
            if (a != null) {
                config._w = config._w || {};
                config._w['d'] = a;
            } else {
                config._pf.invalidWeekday = input;
            }
            break;
        // WEEK, WEEK DAY - numeric
        case 'w':
        case 'ww':
        case 'W':
        case 'WW':
        case 'd':
        case 'e':
        case 'E':
            token = token.substr(0, 1);
            /* falls through */
        case 'gggg':
        case 'GGGG':
        case 'GGGGG':
            token = token.substr(0, 2);
            if (input) {
                config._w = config._w || {};
                config._w[token] = toInt(input);
            }
            break;
        case 'gg':
        case 'GG':
            config._w = config._w || {};
            config._w[token] = moment.parseTwoDigitYear(input);
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp;

        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;

            // TODO: We need to take the current isoWeekYear, but that depends on
            // how we interpret now (local, utc, fixed offset). So create
            // a now version of current config (take local/utc/offset flags, and
            // create now).
            weekYear = dfl(w.GG, config._a[YEAR], weekOfYear(moment(), 1, 4).year);
            week = dfl(w.W, 1);
            weekday = dfl(w.E, 1);
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;

            weekYear = dfl(w.gg, config._a[YEAR], weekOfYear(moment(), dow, doy).year);
            week = dfl(w.w, 1);

            if (w.d != null) {
                // weekday -- low day numbers are considered next week
                weekday = w.d;
                if (weekday < dow) {
                    ++week;
                }
            } else if (w.e != null) {
                // local weekday -- counting starts from begining of week
                weekday = w.e + dow;
            } else {
                // default to begining of week
                weekday = dow;
            }
        }
        temp = dayOfYearFromWeeks(weekYear, week, weekday, doy, dow);

        config._a[YEAR] = temp.year;
        config._dayOfYear = temp.dayOfYear;
    }

    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromConfig(config) {
        var i, date, input = [], currentDate, yearToUse;

        if (config._d) {
            return;
        }

        currentDate = currentDateArray(config);

        //compute day of the year from weeks and weekdays
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }

        //if the day of the year is set, figure out what it is
        if (config._dayOfYear) {
            yearToUse = dfl(config._a[YEAR], currentDate[YEAR]);

            if (config._dayOfYear > daysInYear(yearToUse)) {
                config._pf._overflowDayOfYear = true;
            }

            date = makeUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }

        // Default to current date.
        // * if no year, month, day of month are given, default to today
        // * if day of month is given, default month and year
        // * if month is given, default only year
        // * if year is given, don't default anything
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }

        // Zero out whatever was not defaulted, including time
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }

        // Check for 24:00:00.000
        if (config._a[HOUR] === 24 &&
                config._a[MINUTE] === 0 &&
                config._a[SECOND] === 0 &&
                config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }

        config._d = (config._useUTC ? makeUTCDate : makeDate).apply(null, input);
        // Apply timezone offset from input. The actual utcOffset can be changed
        // with parseZone.
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }

        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dateFromObject(config) {
        var normalizedInput;

        if (config._d) {
            return;
        }

        normalizedInput = normalizeObjectUnits(config._i);
        config._a = [
            normalizedInput.year,
            normalizedInput.month,
            normalizedInput.day || normalizedInput.date,
            normalizedInput.hour,
            normalizedInput.minute,
            normalizedInput.second,
            normalizedInput.millisecond
        ];

        dateFromConfig(config);
    }

    function currentDateArray(config) {
        var now = new Date();
        if (config._useUTC) {
            return [
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate()
            ];
        } else {
            return [now.getFullYear(), now.getMonth(), now.getDate()];
        }
    }

    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        if (config._f === moment.ISO_8601) {
            parseISO(config);
            return;
        }

        config._a = [];
        config._pf.empty = true;

        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var string = '' + config._i,
            i, parsedInput, tokens, token, skipped,
            stringLength = string.length,
            totalParsedInputLength = 0;

        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    config._pf.unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            // don't parse if it's not a known token
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    config._pf.empty = false;
                }
                else {
                    config._pf.unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                config._pf.unusedTokens.push(token);
            }
        }

        // add remaining unparsed input length to the string
        config._pf.charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            config._pf.unusedInput.push(string);
        }

        // clear _12h flag if hour is <= 12
        if (config._pf.bigHour === true && config._a[HOUR] <= 12) {
            config._pf.bigHour = undefined;
        }
        // handle meridiem
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR],
                config._meridiem);
        dateFromConfig(config);
        checkOverflow(config);
    }

    function unescapeFormat(s) {
        return s.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        });
    }

    // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
    function regexpEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig,
            bestMoment,

            scoreToBeat,
            i,
            currentScore;

        if (config._f.length === 0) {
            config._pf.invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }

        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._pf = defaultParsingFlags();
            tempConfig._f = config._f[i];
            makeDateFromStringAndFormat(tempConfig);

            if (!isValid(tempConfig)) {
                continue;
            }

            // if there is any input that was not parsed add a penalty for that format
            currentScore += tempConfig._pf.charsLeftOver;

            //or tokens
            currentScore += tempConfig._pf.unusedTokens.length * 10;

            tempConfig._pf.score = currentScore;

            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }

        extend(config, bestMoment || tempConfig);
    }

    // date from iso format
    function parseISO(config) {
        var i, l,
            string = config._i,
            match = isoRegex.exec(string);

        if (match) {
            config._pf.iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(string)) {
                    // match[5] should be 'T' or undefined
                    config._f = isoDates[i][0] + (match[6] || ' ');
                    break;
                }
            }
            for (i = 0, l = isoTimes.length; i < l; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (string.match(parseTokenTimezone)) {
                config._f += 'Z';
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    // date from iso format or fallback
    function makeDateFromString(config) {
        parseISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            moment.createFromInputFallback(config);
        }
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function makeDateFromInput(config) {
        var input = config._i, matched;
        if (input === undefined) {
            config._d = new Date();
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if ((matched = aspNetJsonRegex.exec(input)) !== null) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === 'string') {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            dateFromConfig(config);
        } else if (typeof(input) === 'object') {
            dateFromObject(config);
        } else if (typeof(input) === 'number') {
            // from milliseconds
            config._d = new Date(input);
        } else {
            moment.createFromInputFallback(config);
        }
    }

    function makeDate(y, m, d, h, M, s, ms) {
        //can't just apply() to create a date:
        //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
        var date = new Date(y, m, d, h, M, s, ms);

        //the date constructor doesn't accept years < 1970
        if (y < 1970) {
            date.setFullYear(y);
        }
        return date;
    }

    function makeUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 1970) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    function parseWeekday(input, locale) {
        if (typeof input === 'string') {
            if (!isNaN(input)) {
                input = parseInt(input, 10);
            }
            else {
                input = locale.weekdaysParse(input);
                if (typeof input !== 'number') {
                    return null;
                }
            }
        }
        return input;
    }

    /************************************
        Relative Time
    ************************************/


    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = moment.duration(posNegDuration).abs(),
            seconds = round(duration.as('s')),
            minutes = round(duration.as('m')),
            hours = round(duration.as('h')),
            days = round(duration.as('d')),
            months = round(duration.as('M')),
            years = round(duration.as('y')),

            args = seconds < relativeTimeThresholds.s && ['s', seconds] ||
                minutes === 1 && ['m'] ||
                minutes < relativeTimeThresholds.m && ['mm', minutes] ||
                hours === 1 && ['h'] ||
                hours < relativeTimeThresholds.h && ['hh', hours] ||
                days === 1 && ['d'] ||
                days < relativeTimeThresholds.d && ['dd', days] ||
                months === 1 && ['M'] ||
                months < relativeTimeThresholds.M && ['MM', months] ||
                years === 1 && ['y'] || ['yy', years];

        args[2] = withoutSuffix;
        args[3] = +posNegDuration > 0;
        args[4] = locale;
        return substituteTimeAgo.apply({}, args);
    }


    /************************************
        Week of Year
    ************************************/


    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek,
            daysToDayOfWeek = firstDayOfWeekOfYear - mom.day(),
            adjustedMoment;


        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }

        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }

        adjustedMoment = moment(mom).add(daysToDayOfWeek, 'd');
        return {
            week: Math.ceil(adjustedMoment.dayOfYear() / 7),
            year: adjustedMoment.year()
        };
    }

    //http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
    function dayOfYearFromWeeks(year, week, weekday, firstDayOfWeekOfYear, firstDayOfWeek) {
        var d = makeUTCDate(year, 0, 1).getUTCDay(), daysToAdd, dayOfYear;

        d = d === 0 ? 7 : d;
        weekday = weekday != null ? weekday : firstDayOfWeek;
        daysToAdd = firstDayOfWeek - d + (d > firstDayOfWeekOfYear ? 7 : 0) - (d < firstDayOfWeek ? 7 : 0);
        dayOfYear = 7 * (week - 1) + (weekday - firstDayOfWeek) + daysToAdd + 1;

        return {
            year: dayOfYear > 0 ? year : year - 1,
            dayOfYear: dayOfYear > 0 ?  dayOfYear : daysInYear(year - 1) + dayOfYear
        };
    }

    /************************************
        Top Level Functions
    ************************************/

    function makeMoment(config) {
        var input = config._i,
            format = config._f,
            res;

        config._locale = config._locale || moment.localeData(config._l);

        if (input === null || (format === undefined && input === '')) {
            return moment.invalid({nullInput: true});
        }

        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }

        if (moment.isMoment(input)) {
            return new Moment(input, true);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }

        res = new Moment(config);
        if (res._nextDay) {
            // Adding is smart enough around DST
            res.add(1, 'd');
            res._nextDay = undefined;
        }

        return res;
    }

    moment = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._i = input;
        c._f = format;
        c._l = locale;
        c._strict = strict;
        c._isUTC = false;
        c._pf = defaultParsingFlags();

        return makeMoment(c);
    };

    moment.suppressDeprecationWarnings = false;

    moment.createFromInputFallback = deprecate(
        'moment construction falls back to js Date. This is ' +
        'discouraged and will be removed in upcoming major ' +
        'release. Please refer to ' +
        'https://github.com/moment/moment/issues/1407 for more info.',
        function (config) {
            config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
        }
    );

    // Pick a moment m from moments so that m[fn](other) is true for all
    // other. This relies on the function fn to be transitive.
    //
    // moments should either be an array of moment objects or an array, whose
    // first element is an array of moment objects.
    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return moment();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    moment.min = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isBefore', args);
    };

    moment.max = function () {
        var args = [].slice.call(arguments, 0);

        return pickBy('isAfter', args);
    };

    // creating with utc
    moment.utc = function (input, format, locale, strict) {
        var c;

        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        // object construction must be done this way.
        // https://github.com/moment/moment/issues/1423
        c = {};
        c._isAMomentObject = true;
        c._useUTC = true;
        c._isUTC = true;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        c._pf = defaultParsingFlags();

        return makeMoment(c).utc();
    };

    // creating with unix timestamp (in seconds)
    moment.unix = function (input) {
        return moment(input * 1000);
    };

    // duration
    moment.duration = function (input, key) {
        var duration = input,
            // matching against regexp is expensive, do it on demand
            match = null,
            sign,
            ret,
            parseIso,
            diffRes;

        if (moment.isDuration(input)) {
            duration = {
                ms: input._milliseconds,
                d: input._days,
                M: input._months
            };
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetTimeSpanJsonRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoDurationRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            parseIso = function (inp) {
                // We'd normally use ~~inp for this, but unfortunately it also
                // converts floats to ints.
                // inp may be undefined, so careful calling replace on it.
                var res = inp && parseFloat(inp.replace(',', '.'));
                // apply sign while we're at it
                return (isNaN(res) ? 0 : res) * sign;
            };
            duration = {
                y: parseIso(match[2]),
                M: parseIso(match[3]),
                d: parseIso(match[4]),
                h: parseIso(match[5]),
                m: parseIso(match[6]),
                s: parseIso(match[7]),
                w: parseIso(match[8])
            };
        } else if (duration == null) {// checks for null or undefined
            duration = {};
        } else if (typeof duration === 'object' &&
                ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(moment(duration.from), moment(duration.to));

            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }

        ret = new Duration(duration);

        if (moment.isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }

        return ret;
    };

    // version number
    moment.version = VERSION;

    // default format
    moment.defaultFormat = isoFormat;

    // constant that refers to the ISO standard
    moment.ISO_8601 = function () {};

    // Plugins that add properties should also add the key here (null value),
    // so we can properly clone ourselves.
    moment.momentProperties = momentProperties;

    // This function will be called whenever a moment is mutated.
    // It is intended to keep the offset in sync with the timezone.
    moment.updateOffset = function () {};

    // This function allows you to set a threshold for relative time strings
    moment.relativeTimeThreshold = function (threshold, limit) {
        if (relativeTimeThresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return relativeTimeThresholds[threshold];
        }
        relativeTimeThresholds[threshold] = limit;
        return true;
    };

    moment.lang = deprecate(
        'moment.lang is deprecated. Use moment.locale instead.',
        function (key, value) {
            return moment.locale(key, value);
        }
    );

    // This function will load locale and then set the global locale.  If
    // no arguments are passed in, it will simply return the current global
    // locale key.
    moment.locale = function (key, values) {
        var data;
        if (key) {
            if (typeof(values) !== 'undefined') {
                data = moment.defineLocale(key, values);
            }
            else {
                data = moment.localeData(key);
            }

            if (data) {
                moment.duration._locale = moment._locale = data;
            }
        }

        return moment._locale._abbr;
    };

    moment.defineLocale = function (name, values) {
        if (values !== null) {
            values.abbr = name;
            if (!locales[name]) {
                locales[name] = new Locale();
            }
            locales[name].set(values);

            // backwards compat for now: also set the locale
            moment.locale(name);

            return locales[name];
        } else {
            // useful for testing
            delete locales[name];
            return null;
        }
    };

    moment.langData = deprecate(
        'moment.langData is deprecated. Use moment.localeData instead.',
        function (key) {
            return moment.localeData(key);
        }
    );

    // returns locale data
    moment.localeData = function (key) {
        var locale;

        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }

        if (!key) {
            return moment._locale;
        }

        if (!isArray(key)) {
            //short-circuit everything else
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }

        return chooseLocale(key);
    };

    // compare moment object
    moment.isMoment = function (obj) {
        return obj instanceof Moment ||
            (obj != null && hasOwnProp(obj, '_isAMomentObject'));
    };

    // for typechecking Duration objects
    moment.isDuration = function (obj) {
        return obj instanceof Duration;
    };

    for (i = lists.length - 1; i >= 0; --i) {
        makeList(lists[i]);
    }

    moment.normalizeUnits = function (units) {
        return normalizeUnits(units);
    };

    moment.invalid = function (flags) {
        var m = moment.utc(NaN);
        if (flags != null) {
            extend(m._pf, flags);
        }
        else {
            m._pf.userInvalidated = true;
        }

        return m;
    };

    moment.parseZone = function () {
        return moment.apply(null, arguments).parseZone();
    };

    moment.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };

    moment.isDate = isDate;

    /************************************
        Moment Prototype
    ************************************/


    extend(moment.fn = Moment.prototype, {

        clone : function () {
            return moment(this);
        },

        valueOf : function () {
            return +this._d - ((this._offset || 0) * 60000);
        },

        unix : function () {
            return Math.floor(+this / 1000);
        },

        toString : function () {
            return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
        },

        toDate : function () {
            return this._offset ? new Date(+this) : this._d;
        },

        toISOString : function () {
            var m = moment(this).utc();
            if (0 < m.year() && m.year() <= 9999) {
                if ('function' === typeof Date.prototype.toISOString) {
                    // native implementation is ~50x faster, use it when we can
                    return this.toDate().toISOString();
                } else {
                    return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
                }
            } else {
                return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        },

        toArray : function () {
            var m = this;
            return [
                m.year(),
                m.month(),
                m.date(),
                m.hours(),
                m.minutes(),
                m.seconds(),
                m.milliseconds()
            ];
        },

        isValid : function () {
            return isValid(this);
        },

        isDSTShifted : function () {
            if (this._a) {
                return this.isValid() && compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray()) > 0;
            }

            return false;
        },

        parsingFlags : function () {
            return extend({}, this._pf);
        },

        invalidAt: function () {
            return this._pf.overflow;
        },

        utc : function (keepLocalTime) {
            return this.utcOffset(0, keepLocalTime);
        },

        local : function (keepLocalTime) {
            if (this._isUTC) {
                this.utcOffset(0, keepLocalTime);
                this._isUTC = false;

                if (keepLocalTime) {
                    this.subtract(this._dateUtcOffset(), 'm');
                }
            }
            return this;
        },

        format : function (inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.localeData().postformat(output);
        },

        add : createAdder(1, 'add'),

        subtract : createAdder(-1, 'subtract'),

        diff : function (input, units, asFloat) {
            var that = makeAs(input, this),
                zoneDiff = (that.utcOffset() - this.utcOffset()) * 6e4,
                anchor, diff, output, daysAdjust;

            units = normalizeUnits(units);

            if (units === 'year' || units === 'month' || units === 'quarter') {
                output = monthDiff(this, that);
                if (units === 'quarter') {
                    output = output / 3;
                } else if (units === 'year') {
                    output = output / 12;
                }
            } else {
                diff = this - that;
                output = units === 'second' ? diff / 1e3 : // 1000
                    units === 'minute' ? diff / 6e4 : // 1000 * 60
                    units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                    units === 'day' ? (diff - zoneDiff) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
                    units === 'week' ? (diff - zoneDiff) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
                    diff;
            }
            return asFloat ? output : absRound(output);
        },

        from : function (time, withoutSuffix) {
            return moment.duration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        },

        fromNow : function (withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },

        calendar : function (time) {
            // We want to compare the start of today, vs this.
            // Getting start-of-today depends on whether we're locat/utc/offset
            // or not.
            var now = time || moment(),
                sod = makeAs(now, this).startOf('day'),
                diff = this.diff(sod, 'days', true),
                format = diff < -6 ? 'sameElse' :
                    diff < -1 ? 'lastWeek' :
                    diff < 0 ? 'lastDay' :
                    diff < 1 ? 'sameDay' :
                    diff < 2 ? 'nextDay' :
                    diff < 7 ? 'nextWeek' : 'sameElse';
            return this.format(this.localeData().calendar(format, this, moment(now)));
        },

        isLeapYear : function () {
            return isLeapYear(this.year());
        },

        isDST : function () {
            return (this.utcOffset() > this.clone().month(0).utcOffset() ||
                this.utcOffset() > this.clone().month(5).utcOffset());
        },

        day : function (input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            if (input != null) {
                input = parseWeekday(input, this.localeData());
                return this.add(input - day, 'd');
            } else {
                return day;
            }
        },

        month : makeAccessor('Month', true),

        startOf : function (units) {
            units = normalizeUnits(units);
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
            case 'year':
                this.month(0);
                /* falls through */
            case 'quarter':
            case 'month':
                this.date(1);
                /* falls through */
            case 'week':
            case 'isoWeek':
            case 'day':
                this.hours(0);
                /* falls through */
            case 'hour':
                this.minutes(0);
                /* falls through */
            case 'minute':
                this.seconds(0);
                /* falls through */
            case 'second':
                this.milliseconds(0);
                /* falls through */
            }

            // weeks are a special case
            if (units === 'week') {
                this.weekday(0);
            } else if (units === 'isoWeek') {
                this.isoWeekday(1);
            }

            // quarters are also special
            if (units === 'quarter') {
                this.month(Math.floor(this.month() / 3) * 3);
            }

            return this;
        },

        endOf: function (units) {
            units = normalizeUnits(units);
            if (units === undefined || units === 'millisecond') {
                return this;
            }
            return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
        },

        isAfter: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this > +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return inputMs < +this.clone().startOf(units);
            }
        },

        isBefore: function (input, units) {
            var inputMs;
            units = normalizeUnits(typeof units !== 'undefined' ? units : 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this < +input;
            } else {
                inputMs = moment.isMoment(input) ? +input : +moment(input);
                return +this.clone().endOf(units) < inputMs;
            }
        },

        isBetween: function (from, to, units) {
            return this.isAfter(from, units) && this.isBefore(to, units);
        },

        isSame: function (input, units) {
            var inputMs;
            units = normalizeUnits(units || 'millisecond');
            if (units === 'millisecond') {
                input = moment.isMoment(input) ? input : moment(input);
                return +this === +input;
            } else {
                inputMs = +moment(input);
                return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
            }
        },

        min: deprecate(
                 'moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548',
                 function (other) {
                     other = moment.apply(null, arguments);
                     return other < this ? this : other;
                 }
         ),

        max: deprecate(
                'moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548',
                function (other) {
                    other = moment.apply(null, arguments);
                    return other > this ? this : other;
                }
        ),

        zone : deprecate(
                'moment().zone is deprecated, use moment().utcOffset instead. ' +
                'https://github.com/moment/moment/issues/1779',
                function (input, keepLocalTime) {
                    if (input != null) {
                        if (typeof input !== 'string') {
                            input = -input;
                        }

                        this.utcOffset(input, keepLocalTime);

                        return this;
                    } else {
                        return -this.utcOffset();
                    }
                }
        ),

        // keepLocalTime = true means only change the timezone, without
        // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
        // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
        // +0200, so we adjust the time as needed, to be valid.
        //
        // Keeping the time actually adds/subtracts (one hour)
        // from the actual represented time. That is why we call updateOffset
        // a second time. In case it wants us to change the offset again
        // _changeInProgress == true case, then we have to adjust, because
        // there is no such time in the given timezone.
        utcOffset : function (input, keepLocalTime) {
            var offset = this._offset || 0,
                localAdjust;
            if (input != null) {
                if (typeof input === 'string') {
                    input = utcOffsetFromString(input);
                }
                if (Math.abs(input) < 16) {
                    input = input * 60;
                }
                if (!this._isUTC && keepLocalTime) {
                    localAdjust = this._dateUtcOffset();
                }
                this._offset = input;
                this._isUTC = true;
                if (localAdjust != null) {
                    this.add(localAdjust, 'm');
                }
                if (offset !== input) {
                    if (!keepLocalTime || this._changeInProgress) {
                        addOrSubtractDurationFromMoment(this,
                                moment.duration(input - offset, 'm'), 1, false);
                    } else if (!this._changeInProgress) {
                        this._changeInProgress = true;
                        moment.updateOffset(this, true);
                        this._changeInProgress = null;
                    }
                }

                return this;
            } else {
                return this._isUTC ? offset : this._dateUtcOffset();
            }
        },

        isLocal : function () {
            return !this._isUTC;
        },

        isUtcOffset : function () {
            return this._isUTC;
        },

        isUtc : function () {
            return this._isUTC && this._offset === 0;
        },

        zoneAbbr : function () {
            return this._isUTC ? 'UTC' : '';
        },

        zoneName : function () {
            return this._isUTC ? 'Coordinated Universal Time' : '';
        },

        parseZone : function () {
            if (this._tzm) {
                this.utcOffset(this._tzm);
            } else if (typeof this._i === 'string') {
                this.utcOffset(utcOffsetFromString(this._i));
            }
            return this;
        },

        hasAlignedHourOffset : function (input) {
            if (!input) {
                input = 0;
            }
            else {
                input = moment(input).utcOffset();
            }

            return (this.utcOffset() - input) % 60 === 0;
        },

        daysInMonth : function () {
            return daysInMonth(this.year(), this.month());
        },

        dayOfYear : function (input) {
            var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
            return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
        },

        quarter : function (input) {
            return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
        },

        weekYear : function (input) {
            var year = weekOfYear(this, this.localeData()._week.dow, this.localeData()._week.doy).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        isoWeekYear : function (input) {
            var year = weekOfYear(this, 1, 4).year;
            return input == null ? year : this.add((input - year), 'y');
        },

        week : function (input) {
            var week = this.localeData().week(this);
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        isoWeek : function (input) {
            var week = weekOfYear(this, 1, 4).week;
            return input == null ? week : this.add((input - week) * 7, 'd');
        },

        weekday : function (input) {
            var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
            return input == null ? weekday : this.add(input - weekday, 'd');
        },

        isoWeekday : function (input) {
            // behaves the same as moment#day except
            // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
            // as a setter, sunday should belong to the previous week.
            return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
        },

        isoWeeksInYear : function () {
            return weeksInYear(this.year(), 1, 4);
        },

        weeksInYear : function () {
            var weekInfo = this.localeData()._week;
            return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units]();
        },

        set : function (units, value) {
            var unit;
            if (typeof units === 'object') {
                for (unit in units) {
                    this.set(unit, units[unit]);
                }
            }
            else {
                units = normalizeUnits(units);
                if (typeof this[units] === 'function') {
                    this[units](value);
                }
            }
            return this;
        },

        // If passed a locale key, it will set the locale for this
        // instance.  Otherwise, it will return the locale configuration
        // variables for this instance.
        locale : function (key) {
            var newLocaleData;

            if (key === undefined) {
                return this._locale._abbr;
            } else {
                newLocaleData = moment.localeData(key);
                if (newLocaleData != null) {
                    this._locale = newLocaleData;
                }
                return this;
            }
        },

        lang : deprecate(
            'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
            function (key) {
                if (key === undefined) {
                    return this.localeData();
                } else {
                    return this.locale(key);
                }
            }
        ),

        localeData : function () {
            return this._locale;
        },

        _dateUtcOffset : function () {
            // On Firefox.24 Date#getTimezoneOffset returns a floating point.
            // https://github.com/moment/moment/pull/1871
            return -Math.round(this._d.getTimezoneOffset() / 15) * 15;
        }

    });

    function rawMonthSetter(mom, value) {
        var dayOfMonth;

        // TODO: Move this out of here!
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            // TODO: Another silent failure?
            if (typeof value !== 'number') {
                return mom;
            }
        }

        dayOfMonth = Math.min(mom.date(),
                daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function rawGetter(mom, unit) {
        return mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]();
    }

    function rawSetter(mom, unit, value) {
        if (unit === 'Month') {
            return rawMonthSetter(mom, value);
        } else {
            return mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function makeAccessor(unit, keepTime) {
        return function (value) {
            if (value != null) {
                rawSetter(this, unit, value);
                moment.updateOffset(this, keepTime);
                return this;
            } else {
                return rawGetter(this, unit);
            }
        };
    }

    moment.fn.millisecond = moment.fn.milliseconds = makeAccessor('Milliseconds', false);
    moment.fn.second = moment.fn.seconds = makeAccessor('Seconds', false);
    moment.fn.minute = moment.fn.minutes = makeAccessor('Minutes', false);
    // Setting the hour should keep the time, because the user explicitly
    // specified which hour he wants. So trying to maintain the same hour (in
    // a new timezone) makes sense. Adding/subtracting hours does not follow
    // this rule.
    moment.fn.hour = moment.fn.hours = makeAccessor('Hours', true);
    // moment.fn.month is defined separately
    moment.fn.date = makeAccessor('Date', true);
    moment.fn.dates = deprecate('dates accessor is deprecated. Use date instead.', makeAccessor('Date', true));
    moment.fn.year = makeAccessor('FullYear', true);
    moment.fn.years = deprecate('years accessor is deprecated. Use year instead.', makeAccessor('FullYear', true));

    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.months = moment.fn.month;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    moment.fn.quarters = moment.fn.quarter;

    // add aliased format methods
    moment.fn.toJSON = moment.fn.toISOString;

    // alias isUtc for dev-friendliness
    moment.fn.isUTC = moment.fn.isUtc;

    /************************************
        Duration Prototype
    ************************************/


    function daysToYears (days) {
        // 400 years have 146097 days (taking into account leap year rules)
        return days * 400 / 146097;
    }

    function yearsToDays (years) {
        // years * 365 + absRound(years / 4) -
        //     absRound(years / 100) + absRound(years / 400);
        return years * 146097 / 400;
    }

    extend(moment.duration.fn = Duration.prototype, {

        _bubble : function () {
            var milliseconds = this._milliseconds,
                days = this._days,
                months = this._months,
                data = this._data,
                seconds, minutes, hours, years = 0;

            // The following code bubbles up values, see the tests for
            // examples of what that means.
            data.milliseconds = milliseconds % 1000;

            seconds = absRound(milliseconds / 1000);
            data.seconds = seconds % 60;

            minutes = absRound(seconds / 60);
            data.minutes = minutes % 60;

            hours = absRound(minutes / 60);
            data.hours = hours % 24;

            days += absRound(hours / 24);

            // Accurately convert days to years, assume start from year 0.
            years = absRound(daysToYears(days));
            days -= absRound(yearsToDays(years));

            // 30 days to a month
            // TODO (iskren): Use anchor date (like 1st Jan) to compute this.
            months += absRound(days / 30);
            days %= 30;

            // 12 months -> 1 year
            years += absRound(months / 12);
            months %= 12;

            data.days = days;
            data.months = months;
            data.years = years;
        },

        abs : function () {
            this._milliseconds = Math.abs(this._milliseconds);
            this._days = Math.abs(this._days);
            this._months = Math.abs(this._months);

            this._data.milliseconds = Math.abs(this._data.milliseconds);
            this._data.seconds = Math.abs(this._data.seconds);
            this._data.minutes = Math.abs(this._data.minutes);
            this._data.hours = Math.abs(this._data.hours);
            this._data.months = Math.abs(this._data.months);
            this._data.years = Math.abs(this._data.years);

            return this;
        },

        weeks : function () {
            return absRound(this.days() / 7);
        },

        valueOf : function () {
            return this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6;
        },

        humanize : function (withSuffix) {
            var output = relativeTime(this, !withSuffix, this.localeData());

            if (withSuffix) {
                output = this.localeData().pastFuture(+this, output);
            }

            return this.localeData().postformat(output);
        },

        add : function (input, val) {
            // supports only 2.0-style add(1, 's') or add(moment)
            var dur = moment.duration(input, val);

            this._milliseconds += dur._milliseconds;
            this._days += dur._days;
            this._months += dur._months;

            this._bubble();

            return this;
        },

        subtract : function (input, val) {
            var dur = moment.duration(input, val);

            this._milliseconds -= dur._milliseconds;
            this._days -= dur._days;
            this._months -= dur._months;

            this._bubble();

            return this;
        },

        get : function (units) {
            units = normalizeUnits(units);
            return this[units.toLowerCase() + 's']();
        },

        as : function (units) {
            var days, months;
            units = normalizeUnits(units);

            if (units === 'month' || units === 'year') {
                days = this._days + this._milliseconds / 864e5;
                months = this._months + daysToYears(days) * 12;
                return units === 'month' ? months : months / 12;
            } else {
                // handle milliseconds separately because of floating point math errors (issue #1867)
                days = this._days + Math.round(yearsToDays(this._months / 12));
                switch (units) {
                    case 'week': return days / 7 + this._milliseconds / 6048e5;
                    case 'day': return days + this._milliseconds / 864e5;
                    case 'hour': return days * 24 + this._milliseconds / 36e5;
                    case 'minute': return days * 24 * 60 + this._milliseconds / 6e4;
                    case 'second': return days * 24 * 60 * 60 + this._milliseconds / 1000;
                    // Math.floor prevents floating point math errors here
                    case 'millisecond': return Math.floor(days * 24 * 60 * 60 * 1000) + this._milliseconds;
                    default: throw new Error('Unknown unit ' + units);
                }
            }
        },

        lang : moment.fn.lang,
        locale : moment.fn.locale,

        toIsoString : deprecate(
            'toIsoString() is deprecated. Please use toISOString() instead ' +
            '(notice the capitals)',
            function () {
                return this.toISOString();
            }
        ),

        toISOString : function () {
            // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
            var years = Math.abs(this.years()),
                months = Math.abs(this.months()),
                days = Math.abs(this.days()),
                hours = Math.abs(this.hours()),
                minutes = Math.abs(this.minutes()),
                seconds = Math.abs(this.seconds() + this.milliseconds() / 1000);

            if (!this.asSeconds()) {
                // this is the same as C#'s (Noda) and python (isodate)...
                // but not other JS (goog.date)
                return 'P0D';
            }

            return (this.asSeconds() < 0 ? '-' : '') +
                'P' +
                (years ? years + 'Y' : '') +
                (months ? months + 'M' : '') +
                (days ? days + 'D' : '') +
                ((hours || minutes || seconds) ? 'T' : '') +
                (hours ? hours + 'H' : '') +
                (minutes ? minutes + 'M' : '') +
                (seconds ? seconds + 'S' : '');
        },

        localeData : function () {
            return this._locale;
        },

        toJSON : function () {
            return this.toISOString();
        }
    });

    moment.duration.fn.toString = moment.duration.fn.toISOString;

    function makeDurationGetter(name) {
        moment.duration.fn[name] = function () {
            return this._data[name];
        };
    }

    for (i in unitMillisecondFactors) {
        if (hasOwnProp(unitMillisecondFactors, i)) {
            makeDurationGetter(i.toLowerCase());
        }
    }

    moment.duration.fn.asMilliseconds = function () {
        return this.as('ms');
    };
    moment.duration.fn.asSeconds = function () {
        return this.as('s');
    };
    moment.duration.fn.asMinutes = function () {
        return this.as('m');
    };
    moment.duration.fn.asHours = function () {
        return this.as('h');
    };
    moment.duration.fn.asDays = function () {
        return this.as('d');
    };
    moment.duration.fn.asWeeks = function () {
        return this.as('weeks');
    };
    moment.duration.fn.asMonths = function () {
        return this.as('M');
    };
    moment.duration.fn.asYears = function () {
        return this.as('y');
    };

    /************************************
        Default Locale
    ************************************/


    // Set default locale, other locale will inherit from English.
    moment.locale('en', {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal : function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });

    /* EMBED_LOCALES */

    /************************************
        Exposing Moment
    ************************************/

    function makeGlobal(shouldDeprecate) {
        /*global ender:false */
        if (typeof ender !== 'undefined') {
            return;
        }
        oldGlobalMoment = globalScope.moment;
        if (shouldDeprecate) {
            globalScope.moment = deprecate(
                    'Accessing Moment through the global scope is ' +
                    'deprecated, and will be removed in an upcoming ' +
                    'release.',
                    moment);
        } else {
            globalScope.moment = moment;
        }
    }

    // CommonJS module is defined
    if (hasModule) {
        module.exports = moment;
    } else if (typeof define === 'function' && define.amd) {
        define(function (require, exports, module) {
            if (module.config && module.config() && module.config().noGlobal === true) {
                // release the global variable
                globalScope.moment = oldGlobalMoment;
            }

            return moment;
        });
        makeGlobal(true);
    } else {
        makeGlobal();
    }
}).call(this);

/*
Copyright (c) 2014 Magnús Örn Gylfason
Licence: MIT
*/
!function(t){"use strict";function n(){return o}var e=t.module("ngScrollSpy",[]);e.service("ScrollSpy",["$window",function(n){var e,o=function(t){var n={width:t.innerWidth,height:t.innerHeight,maxWidth:t.document.body.scrollWidth,maxHeight:t.document.body.scrollHeight,posX:t.scrollX,posY:t.scrollY};return n.posX<0?(n.posX=0,n.overscrollLeft=!0):n.posX+n.width>n.maxWidth&&(n.posX=n.maxWidth-n.width,n.overscrollRight=!0),n.posY<0?(n.posY=0,n.overscrollTop=!0):n.posY+n.height>n.maxHeight&&(n.posY=n.maxHeight-n.height,n.overscrollBottom=!0),n.hasOverscroll=n.overscrollTop||n.overscrollBottom||n.overscrollLeft||n.overscrollRight,n},i=function(n,e){if(!n||!e)return t.extend({isEqual:!1,velocityX:0,velocityY:0},e);var o={posX:e.posX-n.posX,posY:e.posY-n.posY,width:e.width-n.width,height:e.height-n.height,maxWidth:e.maxWidth-n.maxWidth,maxHeight:e.maxHeight-n.maxHeight};return e.width>0&&(o.velocityX=o.posX/e.width),e.height>0&&(o.velocityY=o.posY/e.height),o.isEqual=!(0!==o.posX||0!==o.posY||0!==o.width||0!==o.height||0!==o.maxWidth||0!==o.maxHeight),o},r={},l=function(t){var l=o(n),s=i(e,l);if(!s.isEqual||l.hasOverscroll||t){for(var c in r){var u=r[c].cond;(u(l,s)||t)&&r[c].handler(l,s)}e=l}};t.element(n).on("scroll",l);var s=this,c=0;this.trigger=function(){this.isForced=!0,l(!0),this.isForced=!1},this.addHandler=function(t,n){return r[c]={cond:t,handler:n},c++,c-1},this.removeHandler=function(t){delete r[t]},this.onScroll=function(t){return s.addHandler(function(){return!0},function(n,e){t(n,e)})},this.onXScroll=function(t){return s.addHandler(function(t,n){return 0!==n.posX},function(n,e){t(n.posX,e.posX,n,e)})},this.onYScroll=function(t){return s.addHandler(function(t,n){return 0!==n.posY},function(n,e){t(n.posY,e.posY,n,e)})},this.onOverscrollHorz=function(t){return s.addHandler(function(t){return t.overscrollLeft||t.overscrollRight},t)},this.onOverscrollLeft=function(t){return s.addHandler(function(t){return t.overscrollLeft},t)},this.onOverscrollRight=function(t){return s.addHandler(function(t){return t.overscrollRight},t)},this.onOverscrollVert=function(t){return s.addHandler(function(t){return t.overscrollTop||t.overscrollBottom},t)},this.onOverscrollTop=function(t){return s.addHandler(function(t){return t.overscrollTop},t)},this.onOverscrollBottom=function(t){return s.addHandler(function(t){return t.overscrollBottom},t)}}]),e.directive("affix",["ScrollSpy",function(t){var n,e=function(t,n,e,o){var i=t(o[0].getBoundingClientRect());i!==n&&(i?o.addClass(e):o.removeClass(e))},o=function(o,i,r){var l,s=!1,c=!1,u=!1;"top"===o?n=t.onYScroll(function(t){c=s,e(function(n){return s?s=t>=l:n.top<=0?(l=n.top<0?t+n.top:t,s=!0):!1},c,i,r)}):"bottom"===o?(u=!0,n=t.onYScroll(function(n,o,u){c=s,e(function(e){return s?s=l>=n:e.bottom>=u.height?(l=t.isForced&&0===n?n+e.bottom-u.height-e.height:n+e.bottom-u.height,s=!0):!1},c,i,r)})):"left"===o?n=t.onXScroll(function(t){c=s,e(function(n){return s?s=t>=l:n.left<=0?(l=n.left<0?t+n.left:t,s=!0):!1},c,i,r)}):"right"===o&&(u=!0,n=t.onXScroll(function(n,o,u){c=s,e(function(e){return s?s=l>=n:e.right>=u.width?(l=t.isForced&&0===n?n+e.right-u.width-e.width:n+e.right-u.width,s=!0):!1},c,i,r)})),u&&t.trigger()};return{restrict:"A",scope:{affix:"@",affixClass:"@"},link:function(e,i){e.affix=e.affix||"top",e.affixClass=e.affixClass||"affix",o(e.affix,e.affixClass,i),e.$on("destroy",function(){t.removeHandler(n)})}}}]);var o={onRun:null,state:null,store:function(t){for(var n in t)this[n]=t[n];this.state=!0,this.run()},builder:null,setBuilder:function(t){this.builder=t,this.run()},run:function(){this.builder&&this.state&&(this.builder(),this.builder=null,this.state=null,this.onRun&&(this.onRun(),this.onRun=null))}};e.directive("pageitems",["ScrollSpy",function(e){var o=function(o,i){if(t.isDefined(o.selector)){o.spyElems=i[0].getElementsByClassName(o.selector),o.spies={},n().onRun=function(){o.spies[o.spyElems[0].id].set()},n().store({topMargin:function(){return 0|o.topmargin},addSpy:function(t){o.spies[t.id]=t},getSpy:function(t){return o.spies[t]},items:function(){return o.spyElems}});var r=o.spyElems,l=0|o.topmargin,s=e.onYScroll(function(t,n,i){for(var c=null,u=o.spies,a=0;a<r.length;a++){var h=r[a],f=u[h.id];if(f.clear(),void 0!==h.getBoundingClientRect().top){var d=h.getBoundingClientRect().top;l>=d?(f.pos=d,null===c&&(c=f),c.pos<f.pos&&(c=f)):null===c&&(c=f)}}i.height+t>=i.maxHeight&&(c=u[r[r.length-1].id]),c.set(),o.$on("destroy",function(){e.removeHandler(s)})})}};return{restrict:"A",scope:{selector:"@",topmargin:"@"},link:o}}]),e.directive("pagemenu",["$compile","$location","$anchorScroll",function(t,e,o){var i=function(i,r){for(var l,s=[],c=[],u=function(t){for(var n={link:t.id,text:t.textContent||t.innerText,parent:""},e=t.tagName,o=0;o<t.classList.length;o++)e+=","+t.classList[o];var i=s.length;if(0===i)s.push(e);else if(e!==s[i-1]){for(var r=i-1;r>=0&&e!=s[r];r--);if(0>r)s.push(e),n.push=!0,c.push(l);else for(n.pop=i-1-r;s.length>r+1;)s.pop(),c.pop()}return c.length>0&&(n.parent=c[c.length-1]),l=n.link,n},a=n().items(),h="",f=0;f<a.length;f++){var d=u(a[f]);if(d.push)h+='<menu class="nav">';else if(d.pop)for(var p=0;p<d.pop;p++)h+="</li></menu>";else 0!==f&&(h+="</li>");h+='<li pagemenuspy="'+d.link+'" parent="'+d.parent+'">',h+='<a href="#'+d.link+'">',h+=d.text,h+="</a>"}h+="</li>",r.append(t(h)(i)),r.on("click",function(t){var i=t.target.hash.substring(1);e.hash(i),o(),0!==n().topMargin()&&setTimeout(function(){window.scrollTo(window.pageXOffset,window.pageYOffset-n().topMargin())},0)})};return{restrict:"E",replace:!0,template:'<menu class="nav pagemenu"></menu>',link:function(t,e){n().setBuilder(function(){i(t,e)})}}}]),e.directive("pagemenuspy",["$location","$anchorScroll",function(){return{restrict:"A",link:function(t,e,o){n().addSpy({id:o.pagemenuspy,parent:o.parent,set:function(){e.addClass("active");var t=n().getSpy(this.parent);t&&t.set()},clear:function(){e.removeClass("active")}})}}}])}(angular);
angular.module("ui.bootstrap",["ui.bootstrap.tpls","ui.bootstrap.transition","ui.bootstrap.collapse","ui.bootstrap.accordion","ui.bootstrap.alert","ui.bootstrap.bindHtml","ui.bootstrap.buttons","ui.bootstrap.carousel","ui.bootstrap.position","ui.bootstrap.datepicker","ui.bootstrap.dropdownToggle","ui.bootstrap.modal","ui.bootstrap.pagination","ui.bootstrap.tooltip","ui.bootstrap.popover","ui.bootstrap.progressbar","ui.bootstrap.rating","ui.bootstrap.tabs","ui.bootstrap.timepicker","ui.bootstrap.typeahead"]),angular.module("ui.bootstrap.tpls",["template/accordion/accordion-group.html","template/accordion/accordion.html","template/alert/alert.html","template/carousel/carousel.html","template/carousel/slide.html","template/datepicker/datepicker.html","template/datepicker/popup.html","template/modal/backdrop.html","template/modal/window.html","template/pagination/pager.html","template/pagination/pagination.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/popover/popover.html","template/progressbar/bar.html","template/progressbar/progress.html","template/progressbar/progressbar.html","template/rating/rating.html","template/tabs/tab.html","template/tabs/tabset.html","template/timepicker/timepicker.html","template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html"]),angular.module("ui.bootstrap.transition",[]).factory("$transition",["$q","$timeout","$rootScope",function(a,b,c){function d(a){for(var b in a)if(void 0!==f.style[b])return a[b]}var e=function(d,f,g){g=g||{};var h=a.defer(),i=e[g.animation?"animationEndEventName":"transitionEndEventName"],j=function(){c.$apply(function(){d.unbind(i,j),h.resolve(d)})};return i&&d.bind(i,j),b(function(){angular.isString(f)?d.addClass(f):angular.isFunction(f)?f(d):angular.isObject(f)&&d.css(f),i||h.resolve(d)}),h.promise.cancel=function(){i&&d.unbind(i,j),h.reject("Transition cancelled")},h.promise},f=document.createElement("trans"),g={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd",transition:"transitionend"},h={WebkitTransition:"webkitAnimationEnd",MozTransition:"animationend",OTransition:"oAnimationEnd",transition:"animationend"};return e.transitionEndEventName=d(g),e.animationEndEventName=d(h),e}]),angular.module("ui.bootstrap.collapse",["ui.bootstrap.transition"]).directive("collapse",["$transition",function(a){return{link:function(b,c,d){function e(b){function d(){j===e&&(j=void 0)}var e=a(c,b);return j&&j.cancel(),j=e,e.then(d,d),e}function f(){k?(k=!1,g()):(c.removeClass("collapse").addClass("collapsing"),e({height:c[0].scrollHeight+"px"}).then(g))}function g(){c.removeClass("collapsing"),c.addClass("collapse in"),c.css({height:"auto"})}function h(){if(k)k=!1,i(),c.css({height:0});else{c.css({height:c[0].scrollHeight+"px"});{c[0].offsetWidth}c.removeClass("collapse in").addClass("collapsing"),e({height:0}).then(i)}}function i(){c.removeClass("collapsing"),c.addClass("collapse")}var j,k=!0;b.$watch(d.collapse,function(a){a?h():f()})}}}]),angular.module("ui.bootstrap.accordion",["ui.bootstrap.collapse"]).constant("accordionConfig",{closeOthers:!0}).controller("AccordionController",["$scope","$attrs","accordionConfig",function(a,b,c){this.groups=[],this.closeOthers=function(d){var e=angular.isDefined(b.closeOthers)?a.$eval(b.closeOthers):c.closeOthers;e&&angular.forEach(this.groups,function(a){a!==d&&(a.isOpen=!1)})},this.addGroup=function(a){var b=this;this.groups.push(a),a.$on("$destroy",function(){b.removeGroup(a)})},this.removeGroup=function(a){var b=this.groups.indexOf(a);-1!==b&&this.groups.splice(this.groups.indexOf(a),1)}}]).directive("accordion",function(){return{restrict:"EA",controller:"AccordionController",transclude:!0,replace:!1,templateUrl:"template/accordion/accordion.html"}}).directive("accordionGroup",["$parse",function(a){return{require:"^accordion",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/accordion/accordion-group.html",scope:{heading:"@"},controller:function(){this.setHeading=function(a){this.heading=a}},link:function(b,c,d,e){var f,g;e.addGroup(b),b.isOpen=!1,d.isOpen&&(f=a(d.isOpen),g=f.assign,b.$parent.$watch(f,function(a){b.isOpen=!!a})),b.$watch("isOpen",function(a){a&&e.closeOthers(b),g&&g(b.$parent,a)})}}}]).directive("accordionHeading",function(){return{restrict:"EA",transclude:!0,template:"",replace:!0,require:"^accordionGroup",compile:function(a,b,c){return function(a,b,d,e){e.setHeading(c(a,function(){}))}}}}).directive("accordionTransclude",function(){return{require:"^accordionGroup",link:function(a,b,c,d){a.$watch(function(){return d[c.accordionTransclude]},function(a){a&&(b.html(""),b.append(a))})}}}),angular.module("ui.bootstrap.alert",[]).controller("AlertController",["$scope","$attrs",function(a,b){a.closeable="close"in b}]).directive("alert",function(){return{restrict:"EA",controller:"AlertController",templateUrl:"template/alert/alert.html",transclude:!0,replace:!0,scope:{type:"=",close:"&"}}}),angular.module("ui.bootstrap.bindHtml",[]).directive("bindHtmlUnsafe",function(){return function(a,b,c){b.addClass("ng-binding").data("$binding",c.bindHtmlUnsafe),a.$watch(c.bindHtmlUnsafe,function(a){b.html(a||"")})}}),angular.module("ui.bootstrap.buttons",[]).constant("buttonConfig",{activeClass:"active",toggleEvent:"click"}).controller("ButtonsController",["buttonConfig",function(a){this.activeClass=a.activeClass||"active",this.toggleEvent=a.toggleEvent||"click"}]).directive("btnRadio",function(){return{require:["btnRadio","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){var e=d[0],f=d[1];f.$render=function(){b.toggleClass(e.activeClass,angular.equals(f.$modelValue,a.$eval(c.btnRadio)))},b.bind(e.toggleEvent,function(){b.hasClass(e.activeClass)||a.$apply(function(){f.$setViewValue(a.$eval(c.btnRadio)),f.$render()})})}}}).directive("btnCheckbox",function(){return{require:["btnCheckbox","ngModel"],controller:"ButtonsController",link:function(a,b,c,d){function e(){return g(c.btnCheckboxTrue,!0)}function f(){return g(c.btnCheckboxFalse,!1)}function g(b,c){var d=a.$eval(b);return angular.isDefined(d)?d:c}var h=d[0],i=d[1];i.$render=function(){b.toggleClass(h.activeClass,angular.equals(i.$modelValue,e()))},b.bind(h.toggleEvent,function(){a.$apply(function(){i.$setViewValue(b.hasClass(h.activeClass)?f():e()),i.$render()})})}}}),angular.module("ui.bootstrap.carousel",["ui.bootstrap.transition"]).controller("CarouselController",["$scope","$timeout","$transition","$q",function(a,b,c){function d(){e();var c=+a.interval;!isNaN(c)&&c>=0&&(g=b(f,c))}function e(){g&&(b.cancel(g),g=null)}function f(){h?(a.next(),d()):a.pause()}var g,h,i=this,j=i.slides=[],k=-1;i.currentSlide=null;var l=!1;i.select=function(e,f){function g(){if(!l){if(i.currentSlide&&angular.isString(f)&&!a.noTransition&&e.$element){e.$element.addClass(f);{e.$element[0].offsetWidth}angular.forEach(j,function(a){angular.extend(a,{direction:"",entering:!1,leaving:!1,active:!1})}),angular.extend(e,{direction:f,active:!0,entering:!0}),angular.extend(i.currentSlide||{},{direction:f,leaving:!0}),a.$currentTransition=c(e.$element,{}),function(b,c){a.$currentTransition.then(function(){h(b,c)},function(){h(b,c)})}(e,i.currentSlide)}else h(e,i.currentSlide);i.currentSlide=e,k=m,d()}}function h(b,c){angular.extend(b,{direction:"",active:!0,leaving:!1,entering:!1}),angular.extend(c||{},{direction:"",active:!1,leaving:!1,entering:!1}),a.$currentTransition=null}var m=j.indexOf(e);void 0===f&&(f=m>k?"next":"prev"),e&&e!==i.currentSlide&&(a.$currentTransition?(a.$currentTransition.cancel(),b(g)):g())},a.$on("$destroy",function(){l=!0}),i.indexOfSlide=function(a){return j.indexOf(a)},a.next=function(){var b=(k+1)%j.length;return a.$currentTransition?void 0:i.select(j[b],"next")},a.prev=function(){var b=0>k-1?j.length-1:k-1;return a.$currentTransition?void 0:i.select(j[b],"prev")},a.select=function(a){i.select(a)},a.isActive=function(a){return i.currentSlide===a},a.slides=function(){return j},a.$watch("interval",d),a.$on("$destroy",e),a.play=function(){h||(h=!0,d())},a.pause=function(){a.noPause||(h=!1,e())},i.addSlide=function(b,c){b.$element=c,j.push(b),1===j.length||b.active?(i.select(j[j.length-1]),1==j.length&&a.play()):b.active=!1},i.removeSlide=function(a){var b=j.indexOf(a);j.splice(b,1),j.length>0&&a.active?b>=j.length?i.select(j[b-1]):i.select(j[b]):k>b&&k--}}]).directive("carousel",[function(){return{restrict:"EA",transclude:!0,replace:!0,controller:"CarouselController",require:"carousel",templateUrl:"template/carousel/carousel.html",scope:{interval:"=",noTransition:"=",noPause:"="}}}]).directive("slide",["$parse",function(a){return{require:"^carousel",restrict:"EA",transclude:!0,replace:!0,templateUrl:"template/carousel/slide.html",scope:{},link:function(b,c,d,e){if(d.active){var f=a(d.active),g=f.assign,h=b.active=f(b.$parent);b.$watch(function(){var a=f(b.$parent);return a!==b.active&&(a!==h?h=b.active=a:g(b.$parent,a=h=b.active)),a})}e.addSlide(b,c),b.$on("$destroy",function(){e.removeSlide(b)}),b.$watch("active",function(a){a&&e.select(b)})}}}]),angular.module("ui.bootstrap.position",[]).factory("$position",["$document","$window",function(a,b){function c(a,c){return a.currentStyle?a.currentStyle[c]:b.getComputedStyle?b.getComputedStyle(a)[c]:a.style[c]}function d(a){return"static"===(c(a,"position")||"static")}var e=function(b){for(var c=a[0],e=b.offsetParent||c;e&&e!==c&&d(e);)e=e.offsetParent;return e||c};return{position:function(b){var c=this.offset(b),d={top:0,left:0},f=e(b[0]);f!=a[0]&&(d=this.offset(angular.element(f)),d.top+=f.clientTop-f.scrollTop,d.left+=f.clientLeft-f.scrollLeft);var g=b[0].getBoundingClientRect();return{width:g.width||b.prop("offsetWidth"),height:g.height||b.prop("offsetHeight"),top:c.top-d.top,left:c.left-d.left}},offset:function(c){var d=c[0].getBoundingClientRect();return{width:d.width||c.prop("offsetWidth"),height:d.height||c.prop("offsetHeight"),top:d.top+(b.pageYOffset||a[0].body.scrollTop||a[0].documentElement.scrollTop),left:d.left+(b.pageXOffset||a[0].body.scrollLeft||a[0].documentElement.scrollLeft)}}}}]),angular.module("ui.bootstrap.datepicker",["ui.bootstrap.position"]).constant("datepickerConfig",{dayFormat:"dd",monthFormat:"MMMM",yearFormat:"yyyy",dayHeaderFormat:"EEE",dayTitleFormat:"MMMM yyyy",monthTitleFormat:"yyyy",showWeeks:!0,startingDay:0,yearRange:20,minDate:null,maxDate:null}).controller("DatepickerController",["$scope","$attrs","dateFilter","datepickerConfig",function(a,b,c,d){function e(b,c){return angular.isDefined(b)?a.$parent.$eval(b):c}function f(a,b){return new Date(a,b,0).getDate()}function g(a,b){for(var c=new Array(b),d=a,e=0;b>e;)c[e++]=new Date(d),d.setDate(d.getDate()+1);return c}function h(a,b,d,e){return{date:a,label:c(a,b),selected:!!d,secondary:!!e}}var i={day:e(b.dayFormat,d.dayFormat),month:e(b.monthFormat,d.monthFormat),year:e(b.yearFormat,d.yearFormat),dayHeader:e(b.dayHeaderFormat,d.dayHeaderFormat),dayTitle:e(b.dayTitleFormat,d.dayTitleFormat),monthTitle:e(b.monthTitleFormat,d.monthTitleFormat)},j=e(b.startingDay,d.startingDay),k=e(b.yearRange,d.yearRange);this.minDate=d.minDate?new Date(d.minDate):null,this.maxDate=d.maxDate?new Date(d.maxDate):null,this.modes=[{name:"day",getVisibleDates:function(a,b){var d=a.getFullYear(),e=a.getMonth(),k=new Date(d,e,1),l=j-k.getDay(),m=l>0?7-l:-l,n=new Date(k),o=0;m>0&&(n.setDate(-m+1),o+=m),o+=f(d,e+1),o+=(7-o%7)%7;for(var p=g(n,o),q=new Array(7),r=0;o>r;r++){var s=new Date(p[r]);p[r]=h(s,i.day,b&&b.getDate()===s.getDate()&&b.getMonth()===s.getMonth()&&b.getFullYear()===s.getFullYear(),s.getMonth()!==e)}for(var t=0;7>t;t++)q[t]=c(p[t].date,i.dayHeader);return{objects:p,title:c(a,i.dayTitle),labels:q}},compare:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate())-new Date(b.getFullYear(),b.getMonth(),b.getDate())},split:7,step:{months:1}},{name:"month",getVisibleDates:function(a,b){for(var d=new Array(12),e=a.getFullYear(),f=0;12>f;f++){var g=new Date(e,f,1);d[f]=h(g,i.month,b&&b.getMonth()===f&&b.getFullYear()===e)}return{objects:d,title:c(a,i.monthTitle)}},compare:function(a,b){return new Date(a.getFullYear(),a.getMonth())-new Date(b.getFullYear(),b.getMonth())},split:3,step:{years:1}},{name:"year",getVisibleDates:function(a,b){for(var c=new Array(k),d=a.getFullYear(),e=parseInt((d-1)/k,10)*k+1,f=0;k>f;f++){var g=new Date(e+f,0,1);c[f]=h(g,i.year,b&&b.getFullYear()===g.getFullYear())}return{objects:c,title:[c[0].label,c[k-1].label].join(" - ")}},compare:function(a,b){return a.getFullYear()-b.getFullYear()},split:5,step:{years:k}}],this.isDisabled=function(b,c){var d=this.modes[c||0];return this.minDate&&d.compare(b,this.minDate)<0||this.maxDate&&d.compare(b,this.maxDate)>0||a.dateDisabled&&a.dateDisabled({date:b,mode:d.name})}}]).directive("datepicker",["dateFilter","$parse","datepickerConfig","$log",function(a,b,c,d){return{restrict:"EA",replace:!0,templateUrl:"template/datepicker/datepicker.html",scope:{dateDisabled:"&"},require:["datepicker","?^ngModel"],controller:"DatepickerController",link:function(a,e,f,g){function h(){a.showWeekNumbers=0===o&&q}function i(a,b){for(var c=[];a.length>0;)c.push(a.splice(0,b));return c}function j(b){var c=null,e=!0;n.$modelValue&&(c=new Date(n.$modelValue),isNaN(c)?(e=!1,d.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):b&&(p=c)),n.$setValidity("date",e);var f=m.modes[o],g=f.getVisibleDates(p,c);angular.forEach(g.objects,function(a){a.disabled=m.isDisabled(a.date,o)}),n.$setValidity("date-disabled",!c||!m.isDisabled(c)),a.rows=i(g.objects,f.split),a.labels=g.labels||[],a.title=g.title}function k(a){o=a,h(),j()}function l(a){var b=new Date(a);b.setDate(b.getDate()+4-(b.getDay()||7));var c=b.getTime();return b.setMonth(0),b.setDate(1),Math.floor(Math.round((c-b)/864e5)/7)+1}var m=g[0],n=g[1];if(n){var o=0,p=new Date,q=c.showWeeks;f.showWeeks?a.$parent.$watch(b(f.showWeeks),function(a){q=!!a,h()}):h(),f.min&&a.$parent.$watch(b(f.min),function(a){m.minDate=a?new Date(a):null,j()}),f.max&&a.$parent.$watch(b(f.max),function(a){m.maxDate=a?new Date(a):null,j()}),n.$render=function(){j(!0)},a.select=function(a){if(0===o){var b=n.$modelValue?new Date(n.$modelValue):new Date(0,0,0,0,0,0,0);b.setFullYear(a.getFullYear(),a.getMonth(),a.getDate()),n.$setViewValue(b),j(!0)}else p=a,k(o-1)},a.move=function(a){var b=m.modes[o].step;p.setMonth(p.getMonth()+a*(b.months||0)),p.setFullYear(p.getFullYear()+a*(b.years||0)),j()},a.toggleMode=function(){k((o+1)%m.modes.length)},a.getWeekNumber=function(b){return 0===o&&a.showWeekNumbers&&7===b.length?l(b[0].date):null}}}}}]).constant("datepickerPopupConfig",{dateFormat:"yyyy-MM-dd",currentText:"Today",toggleWeeksText:"Weeks",clearText:"Clear",closeText:"Done",closeOnDateSelection:!0,appendToBody:!1,showButtonBar:!0}).directive("datepickerPopup",["$compile","$parse","$document","$position","dateFilter","datepickerPopupConfig","datepickerConfig",function(a,b,c,d,e,f,g){return{restrict:"EA",require:"ngModel",link:function(h,i,j,k){function l(a){u?u(h,!!a):q.isOpen=!!a}function m(a){if(a){if(angular.isDate(a))return k.$setValidity("date",!0),a;if(angular.isString(a)){var b=new Date(a);return isNaN(b)?(k.$setValidity("date",!1),void 0):(k.$setValidity("date",!0),b)}return k.$setValidity("date",!1),void 0}return k.$setValidity("date",!0),null}function n(a,c,d){a&&(h.$watch(b(a),function(a){q[c]=a}),y.attr(d||c,c))}function o(){q.position=s?d.offset(i):d.position(i),q.position.top=q.position.top+i.prop("offsetHeight")}var p,q=h.$new(),r=angular.isDefined(j.closeOnDateSelection)?h.$eval(j.closeOnDateSelection):f.closeOnDateSelection,s=angular.isDefined(j.datepickerAppendToBody)?h.$eval(j.datepickerAppendToBody):f.appendToBody;j.$observe("datepickerPopup",function(a){p=a||f.dateFormat,k.$render()}),q.showButtonBar=angular.isDefined(j.showButtonBar)?h.$eval(j.showButtonBar):f.showButtonBar,h.$on("$destroy",function(){B.remove(),q.$destroy()}),j.$observe("currentText",function(a){q.currentText=angular.isDefined(a)?a:f.currentText}),j.$observe("toggleWeeksText",function(a){q.toggleWeeksText=angular.isDefined(a)?a:f.toggleWeeksText}),j.$observe("clearText",function(a){q.clearText=angular.isDefined(a)?a:f.clearText}),j.$observe("closeText",function(a){q.closeText=angular.isDefined(a)?a:f.closeText});var t,u;j.isOpen&&(t=b(j.isOpen),u=t.assign,h.$watch(t,function(a){q.isOpen=!!a})),q.isOpen=t?t(h):!1;var v=function(a){q.isOpen&&a.target!==i[0]&&q.$apply(function(){l(!1)})},w=function(){q.$apply(function(){l(!0)})},x=angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");x.attr({"ng-model":"date","ng-change":"dateSelection()"});var y=angular.element(x.children()[0]);j.datepickerOptions&&y.attr(angular.extend({},h.$eval(j.datepickerOptions))),k.$parsers.unshift(m),q.dateSelection=function(a){angular.isDefined(a)&&(q.date=a),k.$setViewValue(q.date),k.$render(),r&&l(!1)},i.bind("input change keyup",function(){q.$apply(function(){q.date=k.$modelValue})}),k.$render=function(){var a=k.$viewValue?e(k.$viewValue,p):"";i.val(a),q.date=k.$modelValue},n(j.min,"min"),n(j.max,"max"),j.showWeeks?n(j.showWeeks,"showWeeks","show-weeks"):(q.showWeeks=g.showWeeks,y.attr("show-weeks","showWeeks")),j.dateDisabled&&y.attr("date-disabled",j.dateDisabled);var z=!1,A=!1;q.$watch("isOpen",function(a){a?(o(),c.bind("click",v),A&&i.unbind("focus",w),i[0].focus(),z=!0):(z&&c.unbind("click",v),i.bind("focus",w),A=!0),u&&u(h,a)}),q.today=function(){q.dateSelection(new Date)},q.clear=function(){q.dateSelection(null)};var B=a(x)(q);s?c.find("body").append(B):i.after(B)}}}]).directive("datepickerPopupWrap",function(){return{restrict:"EA",replace:!0,transclude:!0,templateUrl:"template/datepicker/popup.html",link:function(a,b){b.bind("click",function(a){a.preventDefault(),a.stopPropagation()})}}}),angular.module("ui.bootstrap.dropdownToggle",[]).directive("dropdownToggle",["$document","$location",function(a){var b=null,c=angular.noop;return{restrict:"CA",link:function(d,e){d.$watch("$location.path",function(){c()}),e.parent().bind("click",function(){c()}),e.bind("click",function(d){var f=e===b;d.preventDefault(),d.stopPropagation(),b&&c(),f||e.hasClass("disabled")||e.prop("disabled")||(e.parent().addClass("open"),b=e,c=function(d){d&&(d.preventDefault(),d.stopPropagation()),a.unbind("click",c),e.parent().removeClass("open"),c=angular.noop,b=null},a.bind("click",c))})}}}]),angular.module("ui.bootstrap.modal",[]).factory("$$stackedMap",function(){return{createNew:function(){var a=[];return{add:function(b,c){a.push({key:b,value:c})},get:function(b){for(var c=0;c<a.length;c++)if(b==a[c].key)return a[c]},keys:function(){for(var b=[],c=0;c<a.length;c++)b.push(a[c].key);return b},top:function(){return a[a.length-1]},remove:function(b){for(var c=-1,d=0;d<a.length;d++)if(b==a[d].key){c=d;break}return a.splice(c,1)[0]},removeTop:function(){return a.splice(a.length-1,1)[0]},length:function(){return a.length}}}}}).directive("modalBackdrop",["$timeout",function(a){return{restrict:"EA",replace:!0,templateUrl:"template/modal/backdrop.html",link:function(b){b.animate=!1,a(function(){b.animate=!0})}}}]).directive("modalWindow",["$modalStack","$timeout",function(a,b){return{restrict:"EA",scope:{index:"@"},replace:!0,transclude:!0,templateUrl:"template/modal/window.html",link:function(c,d,e){c.windowClass=e.windowClass||"",b(function(){c.animate=!0,d[0].focus()}),c.close=function(b){var c=a.getTop();c&&c.value.backdrop&&"static"!=c.value.backdrop&&b.target===b.currentTarget&&(b.preventDefault(),b.stopPropagation(),a.dismiss(c.key,"backdrop click"))}}}}]).factory("$modalStack",["$document","$compile","$rootScope","$$stackedMap",function(a,b,c,d){function e(){for(var a=-1,b=k.keys(),c=0;c<b.length;c++)k.get(b[c]).value.backdrop&&(a=c);return a}function f(b){var c=a.find("body").eq(0),d=k.get(b).value;k.remove(b),d.modalDomEl.remove(),c.toggleClass(i,k.length()>0),h&&-1==e()&&(h.remove(),h=void 0),d.modalScope.$destroy()}var g,h,i="modal-open",j=c.$new(!0),k=d.createNew(),l={};return c.$watch(e,function(a){j.index=a}),a.bind("keydown",function(a){var b;27===a.which&&(b=k.top(),b&&b.value.keyboard&&c.$apply(function(){l.dismiss(b.key)}))}),l.open=function(c,d){k.add(c,{deferred:d.deferred,modalScope:d.scope,backdrop:d.backdrop,keyboard:d.keyboard});var f=a.find("body").eq(0);e()>=0&&!h&&(g=angular.element("<div modal-backdrop></div>"),h=b(g)(j),f.append(h));var l=angular.element("<div modal-window></div>");l.attr("window-class",d.windowClass),l.attr("index",k.length()-1),l.html(d.content);var m=b(l)(d.scope);k.top().value.modalDomEl=m,f.append(m),f.addClass(i)},l.close=function(a,b){var c=k.get(a).value;c&&(c.deferred.resolve(b),f(a))},l.dismiss=function(a,b){var c=k.get(a).value;c&&(c.deferred.reject(b),f(a))},l.getTop=function(){return k.top()},l}]).provider("$modal",function(){var a={options:{backdrop:!0,keyboard:!0},$get:["$injector","$rootScope","$q","$http","$templateCache","$controller","$modalStack",function(b,c,d,e,f,g,h){function i(a){return a.template?d.when(a.template):e.get(a.templateUrl,{cache:f}).then(function(a){return a.data})}function j(a){var c=[];return angular.forEach(a,function(a){(angular.isFunction(a)||angular.isArray(a))&&c.push(d.when(b.invoke(a)))}),c}var k={};return k.open=function(b){var e=d.defer(),f=d.defer(),k={result:e.promise,opened:f.promise,close:function(a){h.close(k,a)},dismiss:function(a){h.dismiss(k,a)}};if(b=angular.extend({},a.options,b),b.resolve=b.resolve||{},!b.template&&!b.templateUrl)throw new Error("One of template or templateUrl options is required.");var l=d.all([i(b)].concat(j(b.resolve)));return l.then(function(a){var d=(b.scope||c).$new();d.$close=k.close,d.$dismiss=k.dismiss;var f,i={},j=1;b.controller&&(i.$scope=d,i.$modalInstance=k,angular.forEach(b.resolve,function(b,c){i[c]=a[j++]}),f=g(b.controller,i)),h.open(k,{scope:d,deferred:e,content:a[0],backdrop:b.backdrop,keyboard:b.keyboard,windowClass:b.windowClass})},function(a){e.reject(a)}),l.then(function(){f.resolve(!0)},function(){f.reject(!1)}),k},k}]};return a}),angular.module("ui.bootstrap.pagination",[]).controller("PaginationController",["$scope","$attrs","$parse","$interpolate",function(a,b,c,d){var e=this,f=b.numPages?c(b.numPages).assign:angular.noop;this.init=function(d){b.itemsPerPage?a.$parent.$watch(c(b.itemsPerPage),function(b){e.itemsPerPage=parseInt(b,10),a.totalPages=e.calculateTotalPages()}):this.itemsPerPage=d},this.noPrevious=function(){return 1===this.page},this.noNext=function(){return this.page===a.totalPages},this.isActive=function(a){return this.page===a},this.calculateTotalPages=function(){var b=this.itemsPerPage<1?1:Math.ceil(a.totalItems/this.itemsPerPage);return Math.max(b||0,1)},this.getAttributeValue=function(b,c,e){return angular.isDefined(b)?e?d(b)(a.$parent):a.$parent.$eval(b):c},this.render=function(){this.page=parseInt(a.page,10)||1,this.page>0&&this.page<=a.totalPages&&(a.pages=this.getPages(this.page,a.totalPages))},a.selectPage=function(b){!e.isActive(b)&&b>0&&b<=a.totalPages&&(a.page=b,a.onSelectPage({page:b}))},a.$watch("page",function(){e.render()}),a.$watch("totalItems",function(){a.totalPages=e.calculateTotalPages()}),a.$watch("totalPages",function(b){f(a.$parent,b),e.page>b?a.selectPage(b):e.render()})}]).constant("paginationConfig",{itemsPerPage:10,boundaryLinks:!1,directionLinks:!0,firstText:"First",previousText:"Previous",nextText:"Next",lastText:"Last",rotate:!0}).directive("pagination",["$parse","paginationConfig",function(a,b){return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pagination.html",replace:!0,link:function(c,d,e,f){function g(a,b,c,d){return{number:a,text:b,active:c,disabled:d}}var h,i=f.getAttributeValue(e.boundaryLinks,b.boundaryLinks),j=f.getAttributeValue(e.directionLinks,b.directionLinks),k=f.getAttributeValue(e.firstText,b.firstText,!0),l=f.getAttributeValue(e.previousText,b.previousText,!0),m=f.getAttributeValue(e.nextText,b.nextText,!0),n=f.getAttributeValue(e.lastText,b.lastText,!0),o=f.getAttributeValue(e.rotate,b.rotate);f.init(b.itemsPerPage),e.maxSize&&c.$parent.$watch(a(e.maxSize),function(a){h=parseInt(a,10),f.render()}),f.getPages=function(a,b){var c=[],d=1,e=b,p=angular.isDefined(h)&&b>h;p&&(o?(d=Math.max(a-Math.floor(h/2),1),e=d+h-1,e>b&&(e=b,d=e-h+1)):(d=(Math.ceil(a/h)-1)*h+1,e=Math.min(d+h-1,b)));for(var q=d;e>=q;q++){var r=g(q,q,f.isActive(q),!1);c.push(r)}if(p&&!o){if(d>1){var s=g(d-1,"...",!1,!1);c.unshift(s)}if(b>e){var t=g(e+1,"...",!1,!1);c.push(t)}}if(j){var u=g(a-1,l,!1,f.noPrevious());c.unshift(u);var v=g(a+1,m,!1,f.noNext());c.push(v)}if(i){var w=g(1,k,!1,f.noPrevious());c.unshift(w);var x=g(b,n,!1,f.noNext());c.push(x)}return c}}}}]).constant("pagerConfig",{itemsPerPage:10,previousText:"« Previous",nextText:"Next »",align:!0}).directive("pager",["pagerConfig",function(a){return{restrict:"EA",scope:{page:"=",totalItems:"=",onSelectPage:" &"},controller:"PaginationController",templateUrl:"template/pagination/pager.html",replace:!0,link:function(b,c,d,e){function f(a,b,c,d,e){return{number:a,text:b,disabled:c,previous:i&&d,next:i&&e}}var g=e.getAttributeValue(d.previousText,a.previousText,!0),h=e.getAttributeValue(d.nextText,a.nextText,!0),i=e.getAttributeValue(d.align,a.align);e.init(a.itemsPerPage),e.getPages=function(a){return[f(a-1,g,e.noPrevious(),!0,!1),f(a+1,h,e.noNext(),!1,!0)]}}}}]),angular.module("ui.bootstrap.tooltip",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).provider("$tooltip",function(){function a(a){var b=/[A-Z]/g,c="-";return a.replace(b,function(a,b){return(b?c:"")+a.toLowerCase()})}var b={placement:"top",animation:!0,popupDelay:0},c={mouseenter:"mouseleave",click:"click",focus:"blur"},d={};this.options=function(a){angular.extend(d,a)},this.setTriggers=function(a){angular.extend(c,a)},this.$get=["$window","$compile","$timeout","$parse","$document","$position","$interpolate",function(e,f,g,h,i,j,k){return function(e,l,m){function n(a){var b=a||o.trigger||m,d=c[b]||b;return{show:b,hide:d}}var o=angular.extend({},b,d),p=a(e),q=k.startSymbol(),r=k.endSymbol(),s="<div "+p+'-popup title="'+q+"tt_title"+r+'" content="'+q+"tt_content"+r+'" placement="'+q+"tt_placement"+r+'" animation="tt_animation" is-open="tt_isOpen"></div>';return{restrict:"EA",scope:!0,link:function(a,b,c){function d(){a.tt_isOpen?m():k()}function k(){(!y||a.$eval(c[l+"Enable"]))&&(a.tt_popupDelay?(t=g(p,a.tt_popupDelay),t.then(function(a){a()})):a.$apply(p)())}function m(){a.$apply(function(){q()})}function p(){return a.tt_content?(r&&g.cancel(r),u.css({top:0,left:0,display:"block"}),v?i.find("body").append(u):b.after(u),z(),a.tt_isOpen=!0,z):angular.noop}function q(){a.tt_isOpen=!1,g.cancel(t),a.tt_animation?r=g(function(){u.remove()},500):u.remove()}var r,t,u=f(s)(a),v=angular.isDefined(o.appendToBody)?o.appendToBody:!1,w=n(void 0),x=!1,y=angular.isDefined(c[l+"Enable"]),z=function(){var c,d,e,f;switch(c=v?j.offset(b):j.position(b),d=u.prop("offsetWidth"),e=u.prop("offsetHeight"),a.tt_placement){case"right":f={top:c.top+c.height/2-e/2,left:c.left+c.width};break;case"bottom":f={top:c.top+c.height,left:c.left+c.width/2-d/2};break;case"left":f={top:c.top+c.height/2-e/2,left:c.left-d};break;default:f={top:c.top-e,left:c.left+c.width/2-d/2}}f.top+="px",f.left+="px",u.css(f)};a.tt_isOpen=!1,c.$observe(e,function(b){a.tt_content=b,!b&&a.tt_isOpen&&q()}),c.$observe(l+"Title",function(b){a.tt_title=b}),c.$observe(l+"Placement",function(b){a.tt_placement=angular.isDefined(b)?b:o.placement}),c.$observe(l+"PopupDelay",function(b){var c=parseInt(b,10);a.tt_popupDelay=isNaN(c)?o.popupDelay:c});var A=function(){x&&(b.unbind(w.show,k),b.unbind(w.hide,m))};c.$observe(l+"Trigger",function(a){A(),w=n(a),w.show===w.hide?b.bind(w.show,d):(b.bind(w.show,k),b.bind(w.hide,m)),x=!0});var B=a.$eval(c[l+"Animation"]);a.tt_animation=angular.isDefined(B)?!!B:o.animation,c.$observe(l+"AppendToBody",function(b){v=angular.isDefined(b)?h(b)(a):v}),v&&a.$on("$locationChangeSuccess",function(){a.tt_isOpen&&q()}),a.$on("$destroy",function(){g.cancel(r),g.cancel(t),A(),u.remove(),u.unbind(),u=null})}}}}]}).directive("tooltipPopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-popup.html"}}).directive("tooltip",["$tooltip",function(a){return a("tooltip","tooltip","mouseenter")}]).directive("tooltipHtmlUnsafePopup",function(){return{restrict:"EA",replace:!0,scope:{content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/tooltip/tooltip-html-unsafe-popup.html"}}).directive("tooltipHtmlUnsafe",["$tooltip",function(a){return a("tooltipHtmlUnsafe","tooltip","mouseenter")}]),angular.module("ui.bootstrap.popover",["ui.bootstrap.tooltip"]).directive("popoverPopup",function(){return{restrict:"EA",replace:!0,scope:{title:"@",content:"@",placement:"@",animation:"&",isOpen:"&"},templateUrl:"template/popover/popover.html"}}).directive("popover",["$compile","$timeout","$parse","$window","$tooltip",function(a,b,c,d,e){return e("popover","popover","click")}]),angular.module("ui.bootstrap.progressbar",["ui.bootstrap.transition"]).constant("progressConfig",{animate:!0,max:100}).controller("ProgressController",["$scope","$attrs","progressConfig","$transition",function(a,b,c,d){var e=this,f=[],g=angular.isDefined(b.max)?a.$parent.$eval(b.max):c.max,h=angular.isDefined(b.animate)?a.$parent.$eval(b.animate):c.animate;this.addBar=function(a,b){var c=0,d=a.$parent.$index;angular.isDefined(d)&&f[d]&&(c=f[d].value),f.push(a),this.update(b,a.value,c),a.$watch("value",function(a,c){a!==c&&e.update(b,a,c)}),a.$on("$destroy",function(){e.removeBar(a)})},this.update=function(a,b,c){var e=this.getPercentage(b);h?(a.css("width",this.getPercentage(c)+"%"),d(a,{width:e+"%"})):a.css({transition:"none",width:e+"%"})},this.removeBar=function(a){f.splice(f.indexOf(a),1)},this.getPercentage=function(a){return Math.round(100*a/g)}}]).directive("progress",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",require:"progress",scope:{},template:'<div class="progress" ng-transclude></div>'}}).directive("bar",function(){return{restrict:"EA",replace:!0,transclude:!0,require:"^progress",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/bar.html",link:function(a,b,c,d){d.addBar(a,b)}}}).directive("progressbar",function(){return{restrict:"EA",replace:!0,transclude:!0,controller:"ProgressController",scope:{value:"=",type:"@"},templateUrl:"template/progressbar/progressbar.html",link:function(a,b,c,d){d.addBar(a,angular.element(b.children()[0]))}}}),angular.module("ui.bootstrap.rating",[]).constant("ratingConfig",{max:5,stateOn:null,stateOff:null}).controller("RatingController",["$scope","$attrs","$parse","ratingConfig",function(a,b,c,d){this.maxRange=angular.isDefined(b.max)?a.$parent.$eval(b.max):d.max,this.stateOn=angular.isDefined(b.stateOn)?a.$parent.$eval(b.stateOn):d.stateOn,this.stateOff=angular.isDefined(b.stateOff)?a.$parent.$eval(b.stateOff):d.stateOff,this.createRateObjects=function(a){for(var b={stateOn:this.stateOn,stateOff:this.stateOff},c=0,d=a.length;d>c;c++)a[c]=angular.extend({index:c},b,a[c]);return a},a.range=angular.isDefined(b.ratingStates)?this.createRateObjects(angular.copy(a.$parent.$eval(b.ratingStates))):this.createRateObjects(new Array(this.maxRange)),a.rate=function(b){a.readonly||a.value===b||(a.value=b)},a.enter=function(b){a.readonly||(a.val=b),a.onHover({value:b})},a.reset=function(){a.val=angular.copy(a.value),a.onLeave()},a.$watch("value",function(b){a.val=b}),a.readonly=!1,b.readonly&&a.$parent.$watch(c(b.readonly),function(b){a.readonly=!!b})}]).directive("rating",function(){return{restrict:"EA",scope:{value:"=",onHover:"&",onLeave:"&"},controller:"RatingController",templateUrl:"template/rating/rating.html",replace:!0}}),angular.module("ui.bootstrap.tabs",[]).controller("TabsetController",["$scope",function(a){var b=this,c=b.tabs=a.tabs=[];
b.select=function(a){angular.forEach(c,function(a){a.active=!1}),a.active=!0},b.addTab=function(a){c.push(a),(1===c.length||a.active)&&b.select(a)},b.removeTab=function(a){var d=c.indexOf(a);if(a.active&&c.length>1){var e=d==c.length-1?d-1:d+1;b.select(c[e])}c.splice(d,1)}}]).directive("tabset",function(){return{restrict:"EA",transclude:!0,replace:!0,scope:{},controller:"TabsetController",templateUrl:"template/tabs/tabset.html",link:function(a,b,c){a.vertical=angular.isDefined(c.vertical)?a.$parent.$eval(c.vertical):!1,a.justified=angular.isDefined(c.justified)?a.$parent.$eval(c.justified):!1,a.type=angular.isDefined(c.type)?a.$parent.$eval(c.type):"tabs"}}}).directive("tab",["$parse",function(a){return{require:"^tabset",restrict:"EA",replace:!0,templateUrl:"template/tabs/tab.html",transclude:!0,scope:{heading:"@",onSelect:"&select",onDeselect:"&deselect"},controller:function(){},compile:function(b,c,d){return function(b,c,e,f){var g,h;e.active?(g=a(e.active),h=g.assign,b.$parent.$watch(g,function(a,c){a!==c&&(b.active=!!a)}),b.active=g(b.$parent)):h=g=angular.noop,b.$watch("active",function(a){h(b.$parent,a),a?(f.select(b),b.onSelect()):b.onDeselect()}),b.disabled=!1,e.disabled&&b.$parent.$watch(a(e.disabled),function(a){b.disabled=!!a}),b.select=function(){b.disabled||(b.active=!0)},f.addTab(b),b.$on("$destroy",function(){f.removeTab(b)}),b.$transcludeFn=d}}}}]).directive("tabHeadingTransclude",[function(){return{restrict:"A",require:"^tab",link:function(a,b){a.$watch("headingElement",function(a){a&&(b.html(""),b.append(a))})}}}]).directive("tabContentTransclude",function(){function a(a){return a.tagName&&(a.hasAttribute("tab-heading")||a.hasAttribute("data-tab-heading")||"tab-heading"===a.tagName.toLowerCase()||"data-tab-heading"===a.tagName.toLowerCase())}return{restrict:"A",require:"^tabset",link:function(b,c,d){var e=b.$eval(d.tabContentTransclude);e.$transcludeFn(e.$parent,function(b){angular.forEach(b,function(b){a(b)?e.headingElement=b:c.append(b)})})}}}),angular.module("ui.bootstrap.timepicker",[]).constant("timepickerConfig",{hourStep:1,minuteStep:1,showMeridian:!0,meridians:null,readonlyInput:!1,mousewheel:!0}).directive("timepicker",["$parse","$log","timepickerConfig","$locale",function(a,b,c,d){return{restrict:"EA",require:"?^ngModel",replace:!0,scope:{},templateUrl:"template/timepicker/timepicker.html",link:function(e,f,g,h){function i(){var a=parseInt(e.hours,10),b=e.showMeridian?a>0&&13>a:a>=0&&24>a;return b?(e.showMeridian&&(12===a&&(a=0),e.meridian===q[1]&&(a+=12)),a):void 0}function j(){var a=parseInt(e.minutes,10);return a>=0&&60>a?a:void 0}function k(a){return angular.isDefined(a)&&a.toString().length<2?"0"+a:a}function l(a){m(),h.$setViewValue(new Date(p)),n(a)}function m(){h.$setValidity("time",!0),e.invalidHours=!1,e.invalidMinutes=!1}function n(a){var b=p.getHours(),c=p.getMinutes();e.showMeridian&&(b=0===b||12===b?12:b%12),e.hours="h"===a?b:k(b),e.minutes="m"===a?c:k(c),e.meridian=p.getHours()<12?q[0]:q[1]}function o(a){var b=new Date(p.getTime()+6e4*a);p.setHours(b.getHours(),b.getMinutes()),l()}if(h){var p=new Date,q=angular.isDefined(g.meridians)?e.$parent.$eval(g.meridians):c.meridians||d.DATETIME_FORMATS.AMPMS,r=c.hourStep;g.hourStep&&e.$parent.$watch(a(g.hourStep),function(a){r=parseInt(a,10)});var s=c.minuteStep;g.minuteStep&&e.$parent.$watch(a(g.minuteStep),function(a){s=parseInt(a,10)}),e.showMeridian=c.showMeridian,g.showMeridian&&e.$parent.$watch(a(g.showMeridian),function(a){if(e.showMeridian=!!a,h.$error.time){var b=i(),c=j();angular.isDefined(b)&&angular.isDefined(c)&&(p.setHours(b),l())}else n()});var t=f.find("input"),u=t.eq(0),v=t.eq(1),w=angular.isDefined(g.mousewheel)?e.$eval(g.mousewheel):c.mousewheel;if(w){var x=function(a){a.originalEvent&&(a=a.originalEvent);var b=a.wheelDelta?a.wheelDelta:-a.deltaY;return a.detail||b>0};u.bind("mousewheel wheel",function(a){e.$apply(x(a)?e.incrementHours():e.decrementHours()),a.preventDefault()}),v.bind("mousewheel wheel",function(a){e.$apply(x(a)?e.incrementMinutes():e.decrementMinutes()),a.preventDefault()})}if(e.readonlyInput=angular.isDefined(g.readonlyInput)?e.$eval(g.readonlyInput):c.readonlyInput,e.readonlyInput)e.updateHours=angular.noop,e.updateMinutes=angular.noop;else{var y=function(a,b){h.$setViewValue(null),h.$setValidity("time",!1),angular.isDefined(a)&&(e.invalidHours=a),angular.isDefined(b)&&(e.invalidMinutes=b)};e.updateHours=function(){var a=i();angular.isDefined(a)?(p.setHours(a),l("h")):y(!0)},u.bind("blur",function(){!e.validHours&&e.hours<10&&e.$apply(function(){e.hours=k(e.hours)})}),e.updateMinutes=function(){var a=j();angular.isDefined(a)?(p.setMinutes(a),l("m")):y(void 0,!0)},v.bind("blur",function(){!e.invalidMinutes&&e.minutes<10&&e.$apply(function(){e.minutes=k(e.minutes)})})}h.$render=function(){var a=h.$modelValue?new Date(h.$modelValue):null;isNaN(a)?(h.$setValidity("time",!1),b.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')):(a&&(p=a),m(),n())},e.incrementHours=function(){o(60*r)},e.decrementHours=function(){o(60*-r)},e.incrementMinutes=function(){o(s)},e.decrementMinutes=function(){o(-s)},e.toggleMeridian=function(){o(720*(p.getHours()<12?1:-1))}}}}}]),angular.module("ui.bootstrap.typeahead",["ui.bootstrap.position","ui.bootstrap.bindHtml"]).factory("typeaheadParser",["$parse",function(a){var b=/^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;return{parse:function(c){var d=c.match(b);if(!d)throw new Error("Expected typeahead specification in form of '_modelValue_ (as _label_)? for _item_ in _collection_' but got '"+c+"'.");return{itemName:d[3],source:a(d[4]),viewMapper:a(d[2]||d[1]),modelMapper:a(d[1])}}}}]).directive("typeahead",["$compile","$parse","$q","$timeout","$document","$position","typeaheadParser",function(a,b,c,d,e,f,g){var h=[9,13,27,38,40];return{require:"ngModel",link:function(i,j,k,l){var m,n=i.$eval(k.typeaheadMinLength)||1,o=i.$eval(k.typeaheadWaitMs)||0,p=i.$eval(k.typeaheadEditable)!==!1,q=b(k.typeaheadLoading).assign||angular.noop,r=b(k.typeaheadOnSelect),s=k.typeaheadInputFormatter?b(k.typeaheadInputFormatter):void 0,t=k.typeaheadAppendToBody?b(k.typeaheadAppendToBody):!1,u=b(k.ngModel).assign,v=g.parse(k.typeahead),w=angular.element("<div typeahead-popup></div>");w.attr({matches:"matches",active:"activeIdx",select:"select(activeIdx)",query:"query",position:"position"}),angular.isDefined(k.typeaheadTemplateUrl)&&w.attr("template-url",k.typeaheadTemplateUrl);var x=i.$new();i.$on("$destroy",function(){x.$destroy()});var y=function(){x.matches=[],x.activeIdx=-1},z=function(a){var b={$viewValue:a};q(i,!0),c.when(v.source(i,b)).then(function(c){if(a===l.$viewValue&&m){if(c.length>0){x.activeIdx=0,x.matches.length=0;for(var d=0;d<c.length;d++)b[v.itemName]=c[d],x.matches.push({label:v.viewMapper(x,b),model:c[d]});x.query=a,x.position=t?f.offset(j):f.position(j),x.position.top=x.position.top+j.prop("offsetHeight")}else y();q(i,!1)}},function(){y(),q(i,!1)})};y(),x.query=void 0;var A;l.$parsers.unshift(function(a){return m=!0,a&&a.length>=n?o>0?(A&&d.cancel(A),A=d(function(){z(a)},o)):z(a):(q(i,!1),y()),p?a:a?(l.$setValidity("editable",!1),void 0):(l.$setValidity("editable",!0),a)}),l.$formatters.push(function(a){var b,c,d={};return s?(d.$model=a,s(i,d)):(d[v.itemName]=a,b=v.viewMapper(i,d),d[v.itemName]=void 0,c=v.viewMapper(i,d),b!==c?b:a)}),x.select=function(a){var b,c,d={};d[v.itemName]=c=x.matches[a].model,b=v.modelMapper(i,d),u(i,b),l.$setValidity("editable",!0),r(i,{$item:c,$model:b,$label:v.viewMapper(i,d)}),y(),j[0].focus()},j.bind("keydown",function(a){0!==x.matches.length&&-1!==h.indexOf(a.which)&&(a.preventDefault(),40===a.which?(x.activeIdx=(x.activeIdx+1)%x.matches.length,x.$digest()):38===a.which?(x.activeIdx=(x.activeIdx?x.activeIdx:x.matches.length)-1,x.$digest()):13===a.which||9===a.which?x.$apply(function(){x.select(x.activeIdx)}):27===a.which&&(a.stopPropagation(),y(),x.$digest()))}),j.bind("blur",function(){m=!1});var B=function(a){j[0]!==a.target&&(y(),x.$digest())};e.bind("click",B),i.$on("$destroy",function(){e.unbind("click",B)});var C=a(w)(x);t?e.find("body").append(C):j.after(C)}}}]).directive("typeaheadPopup",function(){return{restrict:"EA",scope:{matches:"=",query:"=",active:"=",position:"=",select:"&"},replace:!0,templateUrl:"template/typeahead/typeahead-popup.html",link:function(a,b,c){a.templateUrl=c.templateUrl,a.isOpen=function(){return a.matches.length>0},a.isActive=function(b){return a.active==b},a.selectActive=function(b){a.active=b},a.selectMatch=function(b){a.select({activeIdx:b})}}}}).directive("typeaheadMatch",["$http","$templateCache","$compile","$parse",function(a,b,c,d){return{restrict:"EA",scope:{index:"=",match:"=",query:"="},link:function(e,f,g){var h=d(g.templateUrl)(e.$parent)||"template/typeahead/typeahead-match.html";a.get(h,{cache:b}).success(function(a){f.replaceWith(c(a.trim())(e))})}}}]).filter("typeaheadHighlight",function(){function a(a){return a.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1")}return function(b,c){return c?b.replace(new RegExp(a(c),"gi"),"<strong>$&</strong>"):b}}),angular.module("template/accordion/accordion-group.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion-group.html",'<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a class="accordion-toggle" ng-click="isOpen = !isOpen" accordion-transclude="heading">{{heading}}</a>\n    </h4>\n  </div>\n  <div class="panel-collapse" collapse="!isOpen">\n	  <div class="panel-body" ng-transclude></div>\n  </div>\n</div>')}]),angular.module("template/accordion/accordion.html",[]).run(["$templateCache",function(a){a.put("template/accordion/accordion.html",'<div class="panel-group" ng-transclude></div>')}]),angular.module("template/alert/alert.html",[]).run(["$templateCache",function(a){a.put("template/alert/alert.html","<div class='alert' ng-class='\"alert-\" + (type || \"warning\")'>\n    <button ng-show='closeable' type='button' class='close' ng-click='close()'>&times;</button>\n    <div ng-transclude></div>\n</div>\n")}]),angular.module("template/carousel/carousel.html",[]).run(["$templateCache",function(a){a.put("template/carousel/carousel.html",'<div ng-mouseenter="pause()" ng-mouseleave="play()" class="carousel">\n    <ol class="carousel-indicators" ng-show="slides().length > 1">\n        <li ng-repeat="slide in slides()" ng-class="{active: isActive(slide)}" ng-click="select(slide)"></li>\n    </ol>\n    <div class="carousel-inner" ng-transclude></div>\n    <a class="left carousel-control" ng-click="prev()" ng-show="slides().length > 1"><span class="icon-prev"></span></a>\n    <a class="right carousel-control" ng-click="next()" ng-show="slides().length > 1"><span class="icon-next"></span></a>\n</div>\n')}]),angular.module("template/carousel/slide.html",[]).run(["$templateCache",function(a){a.put("template/carousel/slide.html","<div ng-class=\"{\n    'active': leaving || (active && !entering),\n    'prev': (next || active) && direction=='prev',\n    'next': (next || active) && direction=='next',\n    'right': direction=='prev',\n    'left': direction=='next'\n  }\" class=\"item text-center\" ng-transclude></div>\n")}]),angular.module("template/datepicker/datepicker.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/datepicker.html",'<table>\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{rows[0].length - 2 + showWeekNumbers}}"><button type="button" class="btn btn-default btn-sm btn-block" ng-click="toggleMode()"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr ng-show="labels.length > 0" class="h6">\n      <th ng-show="showWeekNumbers" class="text-center">#</th>\n      <th ng-repeat="label in labels" class="text-center">{{label}}</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows">\n      <td ng-show="showWeekNumbers" class="text-center"><em>{{ getWeekNumber(row) }}</em></td>\n      <td ng-repeat="dt in row" class="text-center">\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-class="{\'btn-info\': dt.selected}" ng-click="select(dt.date)" ng-disabled="dt.disabled"><span ng-class="{\'text-muted\': dt.secondary}">{{dt.label}}</span></button>\n      </td>\n    </tr>\n  </tbody>\n</table>\n')}]),angular.module("template/datepicker/popup.html",[]).run(["$templateCache",function(a){a.put("template/datepicker/popup.html","<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\">\n	<li ng-transclude></li>\n"+'	<li ng-show="showButtonBar" style="padding:10px 9px 2px">\n		<span class="btn-group">\n			<button type="button" class="btn btn-sm btn-info" ng-click="today()">{{currentText}}</button>\n			<button type="button" class="btn btn-sm btn-default" ng-click="showWeeks = ! showWeeks" ng-class="{active: showWeeks}">{{toggleWeeksText}}</button>\n			<button type="button" class="btn btn-sm btn-danger" ng-click="clear()">{{clearText}}</button>\n		</span>\n		<button type="button" class="btn btn-sm btn-success pull-right" ng-click="isOpen = false">{{closeText}}</button>\n	</li>\n</ul>\n')}]),angular.module("template/modal/backdrop.html",[]).run(["$templateCache",function(a){a.put("template/modal/backdrop.html",'<div class="modal-backdrop fade" ng-class="{in: animate}" ng-style="{\'z-index\': 1040 + index*10}"></div>')}]),angular.module("template/modal/window.html",[]).run(["$templateCache",function(a){a.put("template/modal/window.html",'<div tabindex="-1" class="modal fade {{ windowClass }}" ng-class="{in: animate}" ng-style="{\'z-index\': 1050 + index*10, display: \'block\'}" ng-click="close($event)">\n    <div class="modal-dialog"><div class="modal-content" ng-transclude></div></div>\n</div>')}]),angular.module("template/pagination/pager.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pager.html",'<ul class="pager">\n  <li ng-repeat="page in pages" ng-class="{disabled: page.disabled, previous: page.previous, next: page.next}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n</ul>')}]),angular.module("template/pagination/pagination.html",[]).run(["$templateCache",function(a){a.put("template/pagination/pagination.html",'<ul class="pagination">\n  <li ng-repeat="page in pages" ng-class="{active: page.active, disabled: page.disabled}"><a ng-click="selectPage(page.number)">{{page.text}}</a></li>\n</ul>')}]),angular.module("template/tooltip/tooltip-html-unsafe-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-html-unsafe-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n</div>\n')}]),angular.module("template/tooltip/tooltip-popup.html",[]).run(["$templateCache",function(a){a.put("template/tooltip/tooltip-popup.html",'<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="tooltip-arrow"></div>\n  <div class="tooltip-inner" ng-bind="content"></div>\n</div>\n')}]),angular.module("template/popover/popover.html",[]).run(["$templateCache",function(a){a.put("template/popover/popover.html",'<div class="popover {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">\n  <div class="arrow"></div>\n\n  <div class="popover-inner">\n      <h3 class="popover-title" ng-bind="title" ng-show="title"></h3>\n      <div class="popover-content" ng-bind="content"></div>\n  </div>\n</div>\n')}]),angular.module("template/progressbar/bar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/bar.html",'<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" ng-transclude></div>')}]),angular.module("template/progressbar/progress.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progress.html",'<div class="progress" ng-transclude></div>')}]),angular.module("template/progressbar/progressbar.html",[]).run(["$templateCache",function(a){a.put("template/progressbar/progressbar.html",'<div class="progress"><div class="progress-bar" ng-class="type && \'progress-bar-\' + type" ng-transclude></div></div>')}]),angular.module("template/rating/rating.html",[]).run(["$templateCache",function(a){a.put("template/rating/rating.html",'<span ng-mouseleave="reset()">\n    <i ng-repeat="r in range" ng-mouseenter="enter($index + 1)" ng-click="rate($index + 1)" class="glyphicon" ng-class="$index < val && (r.stateOn || \'glyphicon-star\') || (r.stateOff || \'glyphicon-star-empty\')"></i>\n</span>')}]),angular.module("template/tabs/tab.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tab.html",'<li ng-class="{active: active, disabled: disabled}">\n  <a ng-click="select()" tab-heading-transclude>{{heading}}</a>\n</li>\n')}]),angular.module("template/tabs/tabset-titles.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset-titles.html","<ul class=\"nav {{type && 'nav-' + type}}\" ng-class=\"{'nav-stacked': vertical}\">\n</ul>\n")}]),angular.module("template/tabs/tabset.html",[]).run(["$templateCache",function(a){a.put("template/tabs/tabset.html",'\n<div class="tabbable">\n  <ul class="nav {{type && \'nav-\' + type}}" ng-class="{\'nav-stacked\': vertical, \'nav-justified\': justified}" ng-transclude></ul>\n  <div class="tab-content">\n    <div class="tab-pane" \n         ng-repeat="tab in tabs" \n         ng-class="{active: tab.active}"\n         tab-content-transclude="tab">\n    </div>\n  </div>\n</div>\n')}]),angular.module("template/timepicker/timepicker.html",[]).run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table>\n	<tbody>\n		<tr class="text-center">\n			<td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n		<tr>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n				<input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td>:</td>\n			<td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n				<input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n			</td>\n			<td ng-show="showMeridian"><button class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n		</tr>\n		<tr class="text-center">\n			<td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td>&nbsp;</td>\n			<td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n			<td ng-show="showMeridian"></td>\n		</tr>\n	</tbody>\n</table>\n')}]),angular.module("template/typeahead/typeahead-match.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-match.html",'<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')}]),angular.module("template/typeahead/typeahead-popup.html",[]).run(["$templateCache",function(a){a.put("template/typeahead/typeahead-popup.html","<ul class=\"dropdown-menu\" ng-style=\"{display: isOpen()&&'block' || 'none', top: position.top+'px', left: position.left+'px'}\">\n"+'    <li ng-repeat="match in matches" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>')}]);
/*!
angular-xeditable - 0.1.9
Edit-in-place for angular.js
Build date: 2015-03-26 
*/
angular.module("xeditable",[]).value("editableOptions",{theme:"default",icon_set:"default",buttons:"right",blurElem:"cancel",blurForm:"ignore",activate:"focus",isDisabled:!1,activationEvent:"click"}),angular.module("xeditable").directive("editableBsdate",["editableDirectiveFactory",function(a){return a({directiveName:"editableBsdate",inputTpl:"<div></div>",render:function(){this.parent.render.call(this);var a=angular.element('<input type="text" class="form-control" ng-model="$data"/>'),b=angular.element('<button type="button" class="btn btn-default"><i class="glyphicon glyphicon-calendar"></i></button>'),c=angular.element('<span class="input-group-btn"></span>');a.attr("datepicker-popup",this.attrs.eDatepickerPopupXEditable||"yyyy/MM/dd"),a.attr("is-open",this.attrs.eIsOpen),a.attr("date-disabled",this.attrs.eDateDisabled),a.attr("datepicker-popup",this.attrs.eDatepickerPopup),a.attr("datepicker-mode",this.attrs.eDatepickerMode||"day"),a.attr("min-date",this.attrs.eMinDate),a.attr("max-date",this.attrs.eMaxDate),a.attr("show-weeks",this.attrs.eShowWeeks||!0),a.attr("starting-day",this.attrs.eStartingDay||0),a.attr("init-date",this.attrs.eInitDate||new Date),a.attr("min-mode",this.attrs.eMinMode||"day"),a.attr("max-mode",this.attrs.eMaxMode||"year"),a.attr("format-day",this.attrs.eFormatDay||"dd"),a.attr("format-month",this.attrs.eFormatMonth||"MMMM"),a.attr("format-year",this.attrs.eFormatYear||"yyyy"),a.attr("format-day-header",this.attrs.eFormatDayHeader||"EEE"),a.attr("format-day-title",this.attrs.eFormatDayTitle||"MMMM yyyy"),a.attr("format-month-title",this.attrs.eFormatMonthTitle||"yyyy"),a.attr("year-range",this.attrs.eYearRange||20),a.attr("show-button-bar",this.attrs.eShowButtonBar||!0),a.attr("current-text",this.attrs.eCurrentText||"Today"),a.attr("clear-text",this.attrs.eClearText||"Clear"),a.attr("close-text",this.attrs.eCloseText||"Done"),a.attr("close-on-date-selection",this.attrs.eCloseOnDateSelection||!0),a.attr("date-picker-append-to-body",this.attrs.eDatePickerAppendToBody||!1),a.attr("date-disabled",this.attrs.eDateDisabled),b.attr("ng-click",this.attrs.eNgClick),c.append(b),this.inputEl.prepend(a),this.inputEl.append(c),this.inputEl.removeAttr("class"),this.inputEl.attr("class","input-group")}})}]),angular.module("xeditable").directive("editableBstime",["editableDirectiveFactory",function(a){return a({directiveName:"editableBstime",inputTpl:"<timepicker></timepicker>",render:function(){this.parent.render.call(this);var a=angular.element('<div class="well well-small" style="display:inline-block;"></div>');a.attr("ng-model",this.inputEl.attr("ng-model")),this.inputEl.removeAttr("ng-model"),this.attrs.eNgChange&&(a.attr("ng-change",this.inputEl.attr("ng-change")),this.inputEl.removeAttr("ng-change")),this.inputEl.wrap(a)}})}]),angular.module("xeditable").directive("editableCheckbox",["editableDirectiveFactory",function(a){return a({directiveName:"editableCheckbox",inputTpl:'<input type="checkbox">',render:function(){this.parent.render.call(this),this.attrs.eTitle&&(this.inputEl.wrap("<label></label>"),this.inputEl.parent().append(this.attrs.eTitle))},autosubmit:function(){var a=this;a.inputEl.bind("change",function(){setTimeout(function(){a.scope.$apply(function(){a.scope.$form.$submit()})},500)})}})}]),angular.module("xeditable").directive("editableChecklist",["editableDirectiveFactory","editableNgOptionsParser",function(a,b){return a({directiveName:"editableChecklist",inputTpl:"<span></span>",useCopy:!0,render:function(){this.parent.render.call(this);var a=b(this.attrs.eNgOptions),c='<label ng-repeat="'+a.ngRepeat+'"><input type="checkbox" checklist-model="$parent.$data" checklist-value="'+a.locals.valueFn+'"><span ng-bind="'+a.locals.displayFn+'"></span></label>';this.inputEl.removeAttr("ng-model"),this.inputEl.removeAttr("ng-options"),this.inputEl.html(c)}})}]),angular.module("xeditable").directive("editableCombodate",["editableDirectiveFactory","editableCombodate",function(a,b){return a({directiveName:"editableCombodate",inputTpl:'<input type="text">',render:function(){this.parent.render.call(this);var a=b.getInstance(this.inputEl,{value:new Date(this.scope.$data)}),c=this;a.$widget.find("select").bind("change",function(){c.scope.$data=new Date(a.getValue()).toISOString()})}})}]),function(){var a="text|password|email|tel|number|url|search|color|date|datetime|time|month|week|file".split("|");angular.forEach(a,function(a){var b="editable"+a.charAt(0).toUpperCase()+a.slice(1);angular.module("xeditable").directive(b,["editableDirectiveFactory",function(c){return c({directiveName:b,inputTpl:'<input type="'+a+'">'})}])}),angular.module("xeditable").directive("editableRange",["editableDirectiveFactory",function(a){return a({directiveName:"editableRange",inputTpl:'<input type="range" id="range" name="range">',render:function(){this.parent.render.call(this),this.inputEl.after("<output>{{$data}}</output>")}})}])}(),angular.module("xeditable").directive("editableRadiolist",["editableDirectiveFactory","editableNgOptionsParser",function(a,b){return a({directiveName:"editableRadiolist",inputTpl:"<span></span>",render:function(){this.parent.render.call(this);var a=b(this.attrs.eNgOptions),c='<label ng-repeat="'+a.ngRepeat+'"><input type="radio" ng-disabled="'+this.attrs.eNgDisabled+'" ng-model="$parent.$data" value="{{'+a.locals.valueFn+'}}"><span ng-bind="'+a.locals.displayFn+'"></span></label>';this.inputEl.removeAttr("ng-model"),this.inputEl.removeAttr("ng-options"),this.inputEl.html(c)},autosubmit:function(){var a=this;a.inputEl.bind("change",function(){setTimeout(function(){a.scope.$apply(function(){a.scope.$form.$submit()})},500)})}})}]),angular.module("xeditable").directive("editableSelect",["editableDirectiveFactory",function(a){return a({directiveName:"editableSelect",inputTpl:"<select></select>",autosubmit:function(){var a=this;a.inputEl.bind("change",function(){a.scope.$apply(function(){a.scope.$form.$submit()})})}})}]),angular.module("xeditable").directive("editableTextarea",["editableDirectiveFactory",function(a){return a({directiveName:"editableTextarea",inputTpl:"<textarea></textarea>",addListeners:function(){var a=this;a.parent.addListeners.call(a),a.single&&"no"!==a.buttons&&a.autosubmit()},autosubmit:function(){var a=this;a.inputEl.bind("keydown",function(b){(b.ctrlKey||b.metaKey)&&13===b.keyCode&&a.scope.$apply(function(){a.scope.$form.$submit()})})}})}]),angular.module("xeditable").factory("editableController",["$q","editableUtils",function(a,b){function c(a,c,d,e,f,g,h,i,j,k){var l,m,n=this;n.scope=a,n.elem=d,n.attrs=c,n.inputEl=null,n.editorEl=null,n.single=!0,n.error="",n.theme=f[h.theme]||f["default"],n.parent={},n.icon_set="default"===h.icon_set?g["default"][h.theme]:g.external[h.icon_set],n.inputTpl="",n.directiveName="",n.useCopy=!1,n.single=null,n.buttons="right",n.init=function(b){if(n.single=b,n.name=c.eName||c[n.directiveName],!c[n.directiveName])throw"You should provide value for `"+n.directiveName+"` in editable element!";l=e(c[n.directiveName]),n.buttons=n.single?n.attrs.buttons||h.buttons:"no",c.eName&&n.scope.$watch("$data",function(a){n.scope.$form.$data[c.eName]=a}),c.onshow&&(n.onshow=function(){return n.catchError(e(c.onshow)(a))}),c.onhide&&(n.onhide=function(){return e(c.onhide)(a)}),c.oncancel&&(n.oncancel=function(){return e(c.oncancel)(a)}),c.onbeforesave&&(n.onbeforesave=function(){return n.catchError(e(c.onbeforesave)(a))}),c.onaftersave&&(n.onaftersave=function(){return n.catchError(e(c.onaftersave)(a))}),a.$parent.$watch(c[n.directiveName],function(){n.setLocalValue(),n.handleEmpty()})},n.render=function(){var a=n.theme;n.inputEl=angular.element(n.inputTpl),n.controlsEl=angular.element(a.controlsTpl),n.controlsEl.append(n.inputEl),"no"!==n.buttons&&(n.buttonsEl=angular.element(a.buttonsTpl),n.submitEl=angular.element(a.submitTpl),n.cancelEl=angular.element(a.cancelTpl),n.icon_set&&(n.submitEl.find("span").addClass(n.icon_set.ok),n.cancelEl.find("span").addClass(n.icon_set.cancel)),n.buttonsEl.append(n.submitEl).append(n.cancelEl),n.controlsEl.append(n.buttonsEl),n.inputEl.addClass("editable-has-buttons")),n.errorEl=angular.element(a.errorTpl),n.controlsEl.append(n.errorEl),n.editorEl=angular.element(n.single?a.formTpl:a.noformTpl),n.editorEl.append(n.controlsEl);for(var d in c.$attr)if(!(d.length<=1)){var e=!1,f=d.substring(1,2);if("e"===d.substring(0,1)&&f===f.toUpperCase()&&(e=d.substring(1),"Form"!==e&&"NgSubmit"!==e)){e=e.substring(0,1).toLowerCase()+b.camelToDash(e.substring(1));var g="value"!==e&&""===c[d]?e:c[d];n.inputEl.attr(e,g)}}n.inputEl.addClass("editable-input"),n.inputEl.attr("ng-model","$data"),n.editorEl.addClass(b.camelToDash(n.directiveName)),n.single&&(n.editorEl.attr("editable-form","$form"),n.editorEl.attr("blur",n.attrs.blur||("no"===n.buttons?"cancel":h.blurElem))),angular.isFunction(a.postrender)&&a.postrender.call(n)},n.setLocalValue=function(){n.scope.$data=n.useCopy?angular.copy(l(a.$parent)):l(a.$parent)},n.show=function(){return n.setLocalValue(),n.render(),d.after(n.editorEl),j(n.editorEl)(a),n.addListeners(),d.addClass("editable-hide"),n.onshow()},n.hide=function(){return n.editorEl.remove(),d.removeClass("editable-hide"),n.onhide()},n.cancel=function(){n.oncancel()},n.addListeners=function(){n.inputEl.bind("keyup",function(a){if(n.single)switch(a.keyCode){case 27:n.scope.$apply(function(){n.scope.$form.$cancel()})}}),n.single&&"no"===n.buttons&&n.autosubmit(),n.editorEl.bind("click",function(a){a.which&&1!==a.which||n.scope.$form.$visible&&(n.scope.$form._clicked=!0)})},n.setWaiting=function(a){a?(m=!n.inputEl.attr("disabled")&&!n.inputEl.attr("ng-disabled")&&!n.inputEl.attr("ng-enabled"),m&&(n.inputEl.attr("disabled","disabled"),n.buttonsEl&&n.buttonsEl.find("button").attr("disabled","disabled"))):m&&(n.inputEl.removeAttr("disabled"),n.buttonsEl&&n.buttonsEl.find("button").removeAttr("disabled"))},n.activate=function(a,b){setTimeout(function(){var c=n.inputEl[0];"focus"===h.activate&&c.focus&&(a&&(b=b||a,c.onfocus=function(){var c=this;setTimeout(function(){c.setSelectionRange(a,b)})}),c.focus()),"select"===h.activate&&c.select&&c.select()},0)},n.setError=function(b){angular.isObject(b)||(a.$error=b,n.error=b)},n.catchError=function(a,b){return angular.isObject(a)&&b!==!0?k.when(a).then(angular.bind(this,function(a){this.catchError(a,!0)}),angular.bind(this,function(a){this.catchError(a,!0)})):b&&angular.isObject(a)&&a.status&&200!==a.status&&a.data&&angular.isString(a.data)?(this.setError(a.data),a=a.data):angular.isString(a)&&this.setError(a),a},n.save=function(){l.assign(a.$parent,n.useCopy?angular.copy(n.scope.$data):n.scope.$data)},n.handleEmpty=function(){var b=l(a.$parent),c=null===b||void 0===b||""===b||angular.isArray(b)&&0===b.length;d.toggleClass("editable-empty",c)},n.autosubmit=angular.noop,n.onshow=angular.noop,n.onhide=angular.noop,n.oncancel=angular.noop,n.onbeforesave=angular.noop,n.onaftersave=angular.noop}return c.$inject=["$scope","$attrs","$element","$parse","editableThemes","editableIcons","editableOptions","$rootScope","$compile","$q"],c}]),angular.module("xeditable").factory("editableDirectiveFactory",["$parse","$compile","editableThemes","$rootScope","$document","editableController","editableFormController","editableOptions",function(a,b,c,d,e,f,g,h){return function(b){return{restrict:"A",scope:!0,require:[b.directiveName,"?^form"],controller:f,link:function(c,f,i,j){var k,l=j[0],m=!1;if(j[1])k=j[1],m=!0;else if(i.eForm){var n=a(i.eForm)(c);if(n)k=n,m=!0;else for(var o=0;o<e[0].forms.length;o++)if(e[0].forms[o].name===i.eForm){k=null,m=!0;break}}angular.forEach(b,function(a,b){void 0!==l[b]&&(l.parent[b]=l[b])}),angular.extend(l,b);var p=angular.isDefined(i.editDisabled)?c.$eval(i.editDisabled):h.isDisabled;if(!p)if(l.init(!m),c.$editable=l,f.addClass("editable"),m)if(k){if(c.$form=k,!c.$form.$addEditable)throw"Form with editable elements should have `editable-form` attribute.";c.$form.$addEditable(l)}else d.$$editableBuffer=d.$$editableBuffer||{},d.$$editableBuffer[i.eForm]=d.$$editableBuffer[i.eForm]||[],d.$$editableBuffer[i.eForm].push(l),c.$form=null;else c.$form=g(),c.$form.$addEditable(l),i.eForm&&(c.$parent[i.eForm]=c.$form),(!i.eForm||i.eClickable)&&(f.addClass("editable-click"),f.bind(h.activationEvent,function(a){a.preventDefault(),a.editable=l,c.$apply(function(){c.$form.$show()})}))}}}}]),angular.module("xeditable").factory("editableFormController",["$parse","$document","$rootScope","editablePromiseCollection","editableUtils",function(a,b,c,d,e){var f=[],g=function(a,b){if(b==a)return!0;for(var c=b.parentNode;null!==c;){if(c==a)return!0;c=c.parentNode}return!1},h=function(a,b){var c=!0,d=a.$editables;return angular.forEach(d,function(a){var d=a.editorEl[0];g(d,b.target)&&(c=!1)}),c};b.bind("click",function(a){if(!(a.which&&1!==a.which||a.isDefaultPrevented())){for(var b=[],d=[],e=0;e<f.length;e++)f[e]._clicked?f[e]._clicked=!1:f[e].$waiting||("cancel"===f[e]._blur&&h(f[e],a)&&b.push(f[e]),"submit"===f[e]._blur&&h(f[e],a)&&d.push(f[e]));(b.length||d.length)&&c.$apply(function(){angular.forEach(b,function(a){a.$cancel()}),angular.forEach(d,function(a){a.$submit()})})}});var i={$addEditable:function(a){this.$editables.push(a),a.elem.bind("$destroy",angular.bind(this,this.$removeEditable,a)),a.scope.$form||(a.scope.$form=this),this.$visible&&a.catchError(a.show())},$removeEditable:function(a){for(var b=0;b<this.$editables.length;b++)if(this.$editables[b]===a)return void this.$editables.splice(b,1)},$show:function(){if(!this.$visible){this.$visible=!0;var a=d();a.when(this.$onshow()),this.$setError(null,""),angular.forEach(this.$editables,function(b){a.when(b.show())}),a.then({onWait:angular.bind(this,this.$setWaiting),onTrue:angular.bind(this,this.$activate),onFalse:angular.bind(this,this.$activate),onString:angular.bind(this,this.$activate)}),setTimeout(angular.bind(this,function(){this._clicked=!1,-1===e.indexOf(f,this)&&f.push(this)}),0)}},$activate:function(a){var b;if(this.$editables.length){if(angular.isString(a))for(b=0;b<this.$editables.length;b++)if(this.$editables[b].name===a)return void this.$editables[b].activate();for(b=0;b<this.$editables.length;b++)if(this.$editables[b].error)return void this.$editables[b].activate();this.$editables[0].activate(this.$editables[0].elem[0].selectionStart,this.$editables[0].elem[0].selectionEnd)}},$hide:function(){this.$visible&&(this.$visible=!1,this.$onhide(),angular.forEach(this.$editables,function(a){a.hide()}),e.arrayRemove(f,this))},$cancel:function(){this.$visible&&(this.$oncancel(),angular.forEach(this.$editables,function(a){a.cancel()}),this.$hide())},$setWaiting:function(a){this.$waiting=!!a,angular.forEach(this.$editables,function(b){b.setWaiting(!!a)})},$setError:function(a,b){angular.forEach(this.$editables,function(c){a&&c.name!==a||c.setError(b)})},$submit:function(){function a(a){var b=d();b.when(this.$onbeforesave()),b.then({onWait:angular.bind(this,this.$setWaiting),onTrue:a?angular.bind(this,this.$save):angular.bind(this,this.$hide),onFalse:angular.bind(this,this.$hide),onString:angular.bind(this,this.$activate)})}if(!this.$waiting){this.$setError(null,"");var b=d();angular.forEach(this.$editables,function(a){b.when(a.onbeforesave())}),b.then({onWait:angular.bind(this,this.$setWaiting),onTrue:angular.bind(this,a,!0),onFalse:angular.bind(this,a,!1),onString:angular.bind(this,this.$activate)})}},$save:function(){angular.forEach(this.$editables,function(a){a.save()});var a=d();a.when(this.$onaftersave()),angular.forEach(this.$editables,function(b){a.when(b.onaftersave())}),a.then({onWait:angular.bind(this,this.$setWaiting),onTrue:angular.bind(this,this.$hide),onFalse:angular.bind(this,this.$hide),onString:angular.bind(this,this.$activate)})},$onshow:angular.noop,$oncancel:angular.noop,$onhide:angular.noop,$onbeforesave:angular.noop,$onaftersave:angular.noop};return function(){return angular.extend({$editables:[],$visible:!1,$waiting:!1,$data:{},_clicked:!1,_blur:null},i)}}]),angular.module("xeditable").directive("editableForm",["$rootScope","$parse","editableFormController","editableOptions",function(a,b,c,d){return{restrict:"A",require:["form"],compile:function(){return{pre:function(b,d,e,f){var g,h=f[0];e.editableForm?b[e.editableForm]&&b[e.editableForm].$show?(g=b[e.editableForm],angular.extend(h,g)):(g=c(),b[e.editableForm]=g,angular.extend(g,h)):(g=c(),angular.extend(h,g));var i=a.$$editableBuffer,j=h.$name;j&&i&&i[j]&&(angular.forEach(i[j],function(a){g.$addEditable(a)}),delete i[j])},post:function(a,c,e,f){var g;g=e.editableForm&&a[e.editableForm]&&a[e.editableForm].$show?a[e.editableForm]:f[0],e.onshow&&(g.$onshow=angular.bind(g,b(e.onshow),a)),e.onhide&&(g.$onhide=angular.bind(g,b(e.onhide),a)),e.oncancel&&(g.$oncancel=angular.bind(g,b(e.oncancel),a)),e.shown&&b(e.shown)(a)&&g.$show(),g._blur=e.blur||d.blurForm,e.ngSubmit||e.submit||(e.onbeforesave&&(g.$onbeforesave=function(){return b(e.onbeforesave)(a,{$data:g.$data})}),e.onaftersave&&(g.$onaftersave=function(){return b(e.onaftersave)(a,{$data:g.$data})}),c.bind("submit",function(b){b.preventDefault(),a.$apply(function(){g.$submit()})})),c.bind("click",function(a){a.which&&1!==a.which||g.$visible&&(g._clicked=!0)})}}}}}]),angular.module("xeditable").factory("editablePromiseCollection",["$q",function(a){function b(){return{promises:[],hasFalse:!1,hasString:!1,when:function(b,c){if(b===!1)this.hasFalse=!0;else if(!c&&angular.isObject(b))this.promises.push(a.when(b));else{if(!angular.isString(b))return;this.hasString=!0}},then:function(b){function c(){h.hasString||h.hasFalse?!h.hasString&&h.hasFalse?e():f():d()}b=b||{};var d=b.onTrue||angular.noop,e=b.onFalse||angular.noop,f=b.onString||angular.noop,g=b.onWait||angular.noop,h=this;this.promises.length?(g(!0),a.all(this.promises).then(function(a){g(!1),angular.forEach(a,function(a){h.when(a,!0)}),c()},function(){g(!1),f()})):c()}}}return b}]),angular.module("xeditable").factory("editableUtils",[function(){return{indexOf:function(a,b){if(a.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c++)if(b===a[c])return c;return-1},arrayRemove:function(a,b){var c=this.indexOf(a,b);return c>=0&&a.splice(c,1),b},camelToDash:function(a){var b=/[A-Z]/g;return a.replace(b,function(a,b){return(b?"-":"")+a.toLowerCase()})},dashToCamel:function(a){var b=/([\:\-\_]+(.))/g,c=/^moz([A-Z])/;return a.replace(b,function(a,b,c,d){return d?c.toUpperCase():c}).replace(c,"Moz$1")}}}]),angular.module("xeditable").factory("editableNgOptionsParser",[function(){function a(a){var c;if(!(c=a.match(b)))throw"ng-options parse error";var d,e=c[2]||c[1],f=c[4]||c[6],g=c[5],h=(c[3]||"",c[2]?c[1]:f),i=c[7],j=c[8],k=j?c[8]:null;return void 0===g?(d=f+" in "+i,void 0!==j&&(d+=" track by "+k)):d="("+g+", "+f+") in "+i,{ngRepeat:d,locals:{valueName:f,keyName:g,valueFn:h,displayFn:e}}}var b=/^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;return a}]),angular.module("xeditable").factory("editableCombodate",[function(){function a(a,b){if(this.$element=angular.element(a),"INPUT"!=this.$element[0].nodeName)throw"Combodate should be applied to INPUT element";this.defaults={format:"YYYY-MM-DD HH:mm",template:"D / MMM / YYYY   H : mm",value:null,minYear:1970,maxYear:2015,yearDescending:!0,minuteStep:5,secondStep:1,firstItem:"empty",errorClass:null,customClass:"",roundTime:!0,smartDays:!0},this.options=angular.extend({},this.defaults,b),this.init()}return a.prototype={constructor:a,init:function(){if(this.map={day:["D","date"],month:["M","month"],year:["Y","year"],hour:["[Hh]","hours"],minute:["m","minutes"],second:["s","seconds"],ampm:["[Aa]",""]},this.$widget=angular.element('<span class="combodate"></span>').html(this.getTemplate()),this.initCombos(),this.options.smartDays){var a=this;this.$widget.find("select").bind("change",function(b){(angular.element(b.target).hasClass("month")||angular.element(b.target).hasClass("year"))&&a.fillCombo("day")})}this.$widget.find("select").css("width","auto"),this.$element.css("display","none").after(this.$widget),this.setValue(this.$element.val()||this.options.value)},getTemplate:function(){var a=this.options.template,b=this.options.customClass;return angular.forEach(this.map,function(b){b=b[0];var c=new RegExp(b+"+"),d=b.length>1?b.substring(1,2):b;a=a.replace(c,"{"+d+"}")}),a=a.replace(/ /g,"&nbsp;"),angular.forEach(this.map,function(c,d){c=c[0];var e=c.length>1?c.substring(1,2):c;a=a.replace("{"+e+"}",'<select class="'+d+" "+b+'"></select>')}),a},initCombos:function(){for(var a in this.map){var b=this.$widget[0].querySelectorAll("."+a);this["$"+a]=b.length?angular.element(b):null,this.fillCombo(a)}},fillCombo:function(a){var b=this["$"+a];if(b){var c="fill"+a.charAt(0).toUpperCase()+a.slice(1),d=this[c](),e=b.val();b.html("");for(var f=0;f<d.length;f++)b.append('<option value="'+d[f][0]+'">'+d[f][1]+"</option>");b.val(e)}},fillCommon:function(a){var b,c=[];if("name"===this.options.firstItem){b=moment.relativeTime||moment.langData()._relativeTime;var d="function"==typeof b[a]?b[a](1,!0,a,!1):b[a];d=d.split(" ").reverse()[0],c.push(["",d])}else"empty"===this.options.firstItem&&c.push(["",""]);return c},fillDay:function(){var a,b,c=this.fillCommon("d"),d=-1!==this.options.template.indexOf("DD"),e=31;if(this.options.smartDays&&this.$month&&this.$year){var f=parseInt(this.$month.val(),10),g=parseInt(this.$year.val(),10);isNaN(f)||isNaN(g)||(e=moment([g,f]).daysInMonth())}for(b=1;e>=b;b++)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillMonth:function(){var a,b,c=this.fillCommon("M"),d=-1!==this.options.template.indexOf("MMMM"),e=-1!==this.options.template.indexOf("MMM"),f=-1!==this.options.template.indexOf("MM");for(b=0;11>=b;b++)a=d?moment().date(1).month(b).format("MMMM"):e?moment().date(1).month(b).format("MMM"):f?this.leadZero(b+1):b+1,c.push([b,a]);return c},fillYear:function(){var a,b,c=[],d=-1!==this.options.template.indexOf("YYYY");for(b=this.options.maxYear;b>=this.options.minYear;b--)a=d?b:(b+"").substring(2),c[this.options.yearDescending?"push":"unshift"]([b,a]);return c=this.fillCommon("y").concat(c)},fillHour:function(){var a,b,c=this.fillCommon("h"),d=-1!==this.options.template.indexOf("h"),e=(-1!==this.options.template.indexOf("H"),-1!==this.options.template.toLowerCase().indexOf("hh")),f=d?1:0,g=d?12:23;for(b=f;g>=b;b++)a=e?this.leadZero(b):b,c.push([b,a]);return c},fillMinute:function(){var a,b,c=this.fillCommon("m"),d=-1!==this.options.template.indexOf("mm");for(b=0;59>=b;b+=this.options.minuteStep)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillSecond:function(){var a,b,c=this.fillCommon("s"),d=-1!==this.options.template.indexOf("ss");for(b=0;59>=b;b+=this.options.secondStep)a=d?this.leadZero(b):b,c.push([b,a]);return c},fillAmpm:function(){var a=-1!==this.options.template.indexOf("a"),b=(-1!==this.options.template.indexOf("A"),[["am",a?"am":"AM"],["pm",a?"pm":"PM"]]);return b},getValue:function(a){var b,c={},d=this,e=!1;return angular.forEach(this.map,function(a,b){if("ampm"!==b){var f="day"===b?1:0;return c[b]=d["$"+b]?parseInt(d["$"+b].val(),10):f,isNaN(c[b])?(e=!0,!1):void 0}}),e?"":(this.$ampm&&(c.hour=12===c.hour?"am"===this.$ampm.val()?0:12:"am"===this.$ampm.val()?c.hour:c.hour+12),b=moment([c.year,c.month,c.day,c.hour,c.minute,c.second]),this.highlight(b),a=void 0===a?this.options.format:a,null===a?b.isValid()?b:null:b.isValid()?b.format(a):"")},setValue:function(a){function b(a,b){var c={};return angular.forEach(a.children("option"),function(a){var d=angular.element(a).attr("value");if(""!==d){var e=Math.abs(d-b);("undefined"==typeof c.distance||e<c.distance)&&(c={value:d,distance:e})}}),c.value}if(a){var c="string"==typeof a?moment(a,this.options.format,!0):moment(a),d=this,e={};c.isValid()&&(angular.forEach(this.map,function(a,b){"ampm"!==b&&(e[b]=c[a[1]]())}),this.$ampm&&(e.hour>=12?(e.ampm="pm",e.hour>12&&(e.hour-=12)):(e.ampm="am",0===e.hour&&(e.hour=12))),angular.forEach(e,function(a,c){d["$"+c]&&("minute"===c&&d.options.minuteStep>1&&d.options.roundTime&&(a=b(d["$"+c],a)),"second"===c&&d.options.secondStep>1&&d.options.roundTime&&(a=b(d["$"+c],a)),d["$"+c].val(a))}),this.options.smartDays&&this.fillCombo("day"),this.$element.val(c.format(this.options.format)).triggerHandler("change"))}},highlight:function(a){a.isValid()?this.options.errorClass?this.$widget.removeClass(this.options.errorClass):this.$widget.find("select").css("border-color",this.borderColor):this.options.errorClass?this.$widget.addClass(this.options.errorClass):(this.borderColor||(this.borderColor=this.$widget.find("select").css("border-color")),this.$widget.find("select").css("border-color","red"))},leadZero:function(a){return 9>=a?"0"+a:a},destroy:function(){this.$widget.remove(),this.$element.removeData("combodate").show()}},{getInstance:function(b,c){return new a(b,c)}}}]),angular.module("xeditable").factory("editableIcons",function(){var a={"default":{bs2:{ok:"icon-ok icon-white",cancel:"icon-remove"},bs3:{ok:"glyphicon glyphicon-ok",cancel:"glyphicon glyphicon-remove"}},external:{"font-awesome":{ok:"fa fa-check",cancel:"fa fa-times"}}};return a}),angular.module("xeditable").factory("editableThemes",function(){var a={"default":{formTpl:'<form class="editable-wrap"></form>',noformTpl:'<span class="editable-wrap"></span>',controlsTpl:'<span class="editable-controls"></span>',inputTpl:"",errorTpl:'<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',buttonsTpl:'<span class="editable-buttons"></span>',submitTpl:'<button type="submit">save</button>',cancelTpl:'<button type="button" ng-click="$form.$cancel()">cancel</button>'},bs2:{formTpl:'<form class="form-inline editable-wrap" role="form"></form>',noformTpl:'<span class="editable-wrap"></span>',controlsTpl:'<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',inputTpl:"",errorTpl:'<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',buttonsTpl:'<span class="editable-buttons"></span>',submitTpl:'<button type="submit" class="btn btn-primary"><span></span></button>',cancelTpl:'<button type="button" class="btn" ng-click="$form.$cancel()"><span></span></button>'},bs3:{formTpl:'<form class="form-inline editable-wrap" role="form"></form>',noformTpl:'<span class="editable-wrap"></span>',controlsTpl:'<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',inputTpl:"",errorTpl:'<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',buttonsTpl:'<span class="editable-buttons"></span>',submitTpl:'<button type="submit" class="btn btn-primary"><span></span></button>',cancelTpl:'<button type="button" class="btn btn-default" ng-click="$form.$cancel()"><span></span></button>',buttonsClass:"",inputClass:"",postrender:function(){switch(this.directiveName){case"editableText":case"editableSelect":case"editableTextarea":case"editableEmail":case"editableTel":case"editableNumber":case"editableUrl":case"editableSearch":case"editableDate":case"editableDatetime":case"editableBsdate":case"editableTime":case"editableMonth":case"editableWeek":if(this.inputEl.addClass("form-control"),this.theme.inputClass){if(this.inputEl.attr("multiple")&&("input-sm"===this.theme.inputClass||"input-lg"===this.theme.inputClass))break;this.inputEl.addClass(this.theme.inputClass)}break;case"editableCheckbox":this.editorEl.addClass("checkbox")}this.buttonsEl&&this.theme.buttonsClass&&this.buttonsEl.find("button").addClass(this.theme.buttonsClass)}}};return a});
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
					gender: user.mainGender, // Gender
					race: user.mainRace, // Race
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
}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])