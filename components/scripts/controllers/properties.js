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
	
	//Set addProperty form options
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
	]
	$scope.farmTypes = [
		{name: '8x8 Scarecrow', type: 'farm', icon: 'scarecrowsm'},
		{name: '16x16 Scarecrow', type: 'farm', icon: 'scarecrowlg'},
		{name: 'Gazebo', type: 'farm', icon: 'gazebo'}
	]
	$scope.workstationTypes = [
		{name: 'Private Loom', type: 'workstation', icon: 'loom'},
		{name: 'Private Carpentry Bench', type: 'workstation', icon: 'carpentry'},
		{name: 'Private Masonry Table', type: 'workstation', icon: 'masonry'},
		{name: 'Private Smelter', type: 'workstation', icon: 'smelter'}
	]
	$scope.locations = [
		{name: 'Two Crowns'}, 
		{name: 'Sanddeep'}, 
		{name: 'Marianople'},
		{name: 'White Arden'},
		{name: 'Dewstone'},
		{name: 'Karkasse'},
		{name: 'Hellswamp'},
		{name: 'Gweonid Forest'}
	]
	
	// Add responsiveness to affixed infobox
	$(function() {
		var $affixElement = $('div[affix]');  // Grab the infobox when affixed
		$affixElement.width($affixElement.parent().width()); // Set width of infobox to width of parent element
	});	
	
	
	// [ Functions ]
	
	// goToTopBox() (Go to topbox)
	$scope.goToTopBox = function() {
		if (!$scope.topBoxCollapsed) { // If topbox is collapsed
			$location.hash('topboxgoto'); // Set hash to topbox location (currently in navbar)
			$anchorScroll(); // Scroll to topbox hash
		} // (Otherwise it will collapse topbox and not scroll to hash)
	}; // /goToTopBox()
	
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
		var compiledMomentDate = moment(duedate).format("ddd, MMM Do"); // Human readable date
		var compiledMomentTime = moment(duedate).format("h:mm a"); // Human readable time
		var compiledMomentDateString = compiledMomentDate.toString(); // Human readable date as string 
		var compiledMomentTimeString = compiledMomentTime.toString(); // Human readable time as string
		var ref = new Firebase(FIREBASE_URL + '/users/' + userID + '/properties/' + $scope.propowner); // Get ref of property owner
		var saveLocation = $firebaseArray(ref); // Create array from ref for save location
		var chosenProptype = $scope.chosenProptype.name; // Get property type from user input
		var chosenPropIcon = $scope.chosenProptype.icon; // Get property type icon from user input
			$scope.topBoxCollapsed = !$scope.topBoxCollapsed; // Close the topbox
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
		} //  / Confirmation
	}; //  /payTaxes()	
}]); //  /PropertyCtrl