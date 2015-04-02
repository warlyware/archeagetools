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

	// add responsiveness to affixed infobox
	$(function() {
		var $affixElement = $('div[data-spy="affix"]');
		$affixElement.width($affixElement.parent().width());
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
		if ($('.currentElm')[0]){  // if div exists with class currentElm...
			var elmID = $('.currentElm').attr('id').substring(4); // get ID of currentElm
			$('.currentElm').appendTo('#' + elmID); // reattach currentElm to previous spot
			$('.currentElm').removeClass('currentElm').addClass('ng-hide'); // remove class currentElm and hide
		} else {
			console.log('Adding 1st property');
		}
// 		if (currentElm) {
// 			var elmLocation = $(currentElm).attr('id').substring(4);
// 			console.log(elmLocation);
// 			$(currentElm).removeClass('currentElm');
//        $(currentElm).removeClass('currentElm');
//        var holderID = $(currentElm).attr('id');
//        console.log(holderID);
        
//        $(currentElm).appendTo();
// 		}
		var newElm = $('.' + key); // grab selected property (newElm) by the key in classname
		$(newElm).appendTo('#prop-infobox'); // append newElm to infobox
		$(newElm).addClass('currentElm').removeClass('ng-hide'); // add currentElm class to newElm
		console.log('Added: ' + elmID);

	} 
}]);