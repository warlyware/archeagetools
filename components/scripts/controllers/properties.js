//##############################
//# /controllers/properties.js #
//##############################

myApp.controller('PropCtrl', ['$scope', '$compile', '$location', '$anchorScroll', '$rootScope', '$state', '$stateParams', '$firebaseObject', '$firebaseArray', '$timeout', 'FIREBASE_URL', function($scope, $compile, $location, $anchorScroll, $rootScope, $state, $stateParams, $firebaseObject, $firebaseArray, $timeout, FIREBASE_URL) {


    var userID = $rootScope.currentUser.$id;

    var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties');
    var propertiesArr = $firebaseArray(ref);
	
	var charRef = new Firebase(FIREBASE_URL + '/users/' + userID + '/characters/'); 
	var charArr = $firebaseArray(charRef);
	
	
    $scope.properties = propertiesArr;
	$scope.characters = charArr;
	
    propertiesArr.$loaded().then(function() {
      statusCheck();
    });

	// add responsiveness to affixed infobox
	$(function() {
		var $affixElement = $('div[affix]');
		$affixElement.width($affixElement.parent().width());
	});

	// Initialize infobox
	$scope.status = {
		isFirstOpen: false
	};
	$scope.topBoxCollapsed = true;
	
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
	
	
	
	
	// [Functions]	
// 	// Status Check
//     var statusCheck = function() {
// 		console.log("Status check starting...");
// 		angular.forEach(propertiesArr, function (property, key) {
// 			angular.forEach(property, function (val, key) {
// 				if (val!==null){
// 					if (val.propowner!==undefined) {
// 						whichOwner = val.propowner;
// 						whichProperty = key;
// 						var ref = new Firebase(FIREBASE_URL + '/users/' + userID + '/properties/' + whichOwner + '/' + whichProperty + '/');
// 						var whichPropArr = $firebaseArray(ref);
// 						whichPropArr.$loaded().then(function() {
// 							var dueunix;
// 							var nowunix;
// 							dueunix = whichPropArr.propduemoment;
// 							nowunix = moment().unix().toString();
// 							var oldduedate = whichPropArr.propduedateiso;
// 							var demodate = moment(oldduedate).add(7, 'days');
// 							var demodateiso = moment(demodate).toISOString();
// 							var demodateformatted = moment(demodate).format('ddd, MMM Do [at] h:mm a');
// 							var timeBetween = dueunix-nowunix;

// 							//Set status to overdue
// 							if (nowunix > dueunix) {
// 								whichPropArr.propstatus = 'overdue';
// 								whichPropArr.propdemodateformatted = demodateformatted;
// 								whichPropArr.propdemodate = demodateiso;
// 							} else if (timeBetween < 86400 && timeBetween > 0) { // Set due soon                        
// 								whichPropArr.propstatus = 'duesoon';
// 							} else  if (timeBetween < 0) { //Or set paid
// 								whichPropArr.propdemodate = '';
// 								whichPropArr.propstatus = 'paid';
// 							}
// 							console.log(whichPropArr.propstatus);
// 						});
// 						whichPropArr.$save().then(function() {
// 							console.log("Checked!");
// 							$scope.$apply();
// 						});
// 					}
// 				}
// 			});
// 		});
// 	}
	
	//Pay taxes on property
	$scope.payTaxes = function(key,property) { 

		var r = confirm('press OK to pay taxes');
		if (r == true) {

			var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties/' + property.propowner + '/' + key + '/');
			var whichPropObj = $firebaseObject(ref);


			whichPropObj.$loaded().then(function() {

				var oldduedate = whichPropObj.propduedateiso;
				var duedate = moment(oldduedate).add(7, 'days');
				var futureduedate = moment(oldduedate).add(14, 'days');  // For timer refresh

				var compiledMomentDate = moment(duedate).format("ddd, MMM Do");
				var compiledMomentTime = moment(duedate).format("h:mm a");

				var compiledMomentDateString = compiledMomentDate.toString();
				var compiledMomentTimeString = compiledMomentTime.toString();

				var duedateunix = moment(duedate).unix();
				var duedateiso = moment(duedate).toISOString();
				var futureduedateiso = moment(futureduedate).toISOString();
				var duedatestring = duedateunix.toString();

				console.log(ref);
				
				whichPropObj.propduedate = compiledMomentDateString;
				whichPropObj.propduemoment = duedatestring;
				whichPropObj.propduedateiso = duedateiso;
				whichPropObj.propduetime = compiledMomentTimeString;
				whichPropObj.propstatus = 'paid';
				whichPropObj.$save().then(function() {
					console.log('paid, checking status');
					var out = $('#proptimer').attr('end-time');
					
					
					console.log('time @ ' + out);
					$scope.$broadcast('timer-clear');
					
					$timeout(function () {						
						$('#proptimer').attr('end-time', '"' + duedateiso + '"');
					}, 100);	
					
					$timeout(function () {						
						$scope.$broadcast('timer-start');					
					}, 100);	
					
					var midOut = $('#proptimer').attr('end-time');					
					console.log('time @ ' + midOut);
					
					

					$compile($('timer'))($scope);

					var newOut = $('#proptimer').attr('end-time');					
					console.log('time @ ' + newOut);
					$timeout(function () {						
						statusCheck();
					}, 500);			
				});

								
				

				console.log(key, property);

			});


		}

	}

	//Delete property
	$scope.deleteProperty = function(key, property) {
		var r = confirm('press OK to delete property');
		if (r == true) {

			var ref = new Firebase(FIREBASE_URL + 'users/' + userID + '/properties/' + property.propowner + '/' + key + '/');
			var whichPropObj = $firebaseObject(ref);

			whichPropObj.$loaded().then(function() {

				whichPropObj.$remove()
				.then(function () {
					console.log('property removed');
				});				
				

				console.log(key, property);

			});


		}
		
	}

	
	// Select property
    $scope.selectProperty = function(key, property) {
		
		var $elementHome = $('#' + key);
		$scope.status.propInfo = true;
		
		if ($('.currentElm')[0]){  // if div exists with class currentElm...
			var $oldElementHome = $('.currentElm').attr('id').substring(4); // get ID of currentElm
			$('.currentElm').appendTo('#' + $oldElementHome); // reattach currentElm to previous spot
			$('#' + $oldElementHome).removeClass('selectedProperty');
			$('.currentElm').removeClass('currentElm').addClass('ng-hide'); // remove class currentElm and hide
			$elementHome.addClass('selectedProperty');
		} else {
			console.log('Adding 1st property');
			$elementHome.addClass('selectedProperty');			
		}

		var $newElm = $('.' + key); // grab selected property (newElm) by the key in classname
				
		$newElm.appendTo('#prop-infobox'); // append newElm to infobox
		$newElm.addClass('currentElm').removeClass('ng-hide'); // add currentElm class to newElm
		
	} 
	
	//Go to topbox
	$scope.goToTopBox = function() {
		if (!$scope.topBoxCollapsed) {
			$location.hash('topboxgoto');
			$anchorScroll();			
		}
	}
	
	
	$scope.addProperty = function() { // add addProperty() to scope

		var compiledDuedate = '2015-'+$scope.propduemonth+'-'+$scope.propdueday+'T'+$scope.propduehour+':'+$scope.propduemin+':'+'00';

		var duedate = moment(compiledDuedate).local();
		var duedateunix = moment(duedate).unix();
		var duedateiso = moment(duedate).toISOString();
		var duedatestring = duedateunix.toString();

		var compiledMomentDate = moment(duedate).format("ddd, MMM Do");
		var compiledMomentTime = moment(duedate).format("h:mm a");

		var compiledMomentDateString = compiledMomentDate.toString();
		var compiledMomentTimeString = compiledMomentTime.toString();

		var ref = new Firebase(FIREBASE_URL + '/users/' + userID + '/properties/' + $scope.propowner);
		var saveLocation = $firebaseArray(ref);

		var chosenProptype = $scope.chosenProptype.name;
		var chosenPropIcon = $scope.chosenProptype.icon;
		console.log('Property type: ' + chosenProptype);
		console.log('Property icon: ' + chosenPropIcon);

			$scope.topBoxCollapsed = !$scope.topBoxCollapsed;
		
			saveLocation.$add({ // push info below as object to db
				propowner: $scope.propowner,
				howmanypacks: 0,
				proplocation: $scope.chosenLocation.name,
				propduedate: compiledMomentDateString,
				propduemoment: duedatestring,
				propduedateiso: duedateiso,
				propduetime: compiledMomentTimeString,
				proptype: chosenProptype,
				icon: chosenPropIcon,
				propcategory: $scope.proptypes,
				user: userID,
				created: Firebase.ServerValue.TIMESTAMP
			})
			.then(function() { // once data is saved to db...
				var id = ref.key();
				console.log("added record with id " + id);
				saveLocation.$indexFor(id); // returns location in the array				
				console.log('added, checking status');
				$timeout(function () {						
					statusCheck();
				}, 500);
			});


	}// add property	
	
	
	

}]);