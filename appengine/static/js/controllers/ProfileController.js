'use strict';

scraperApp.controller('ProfileController', 
	function ProfileController($scope, $timeout, $filter, $log, $modal, ScraperData, SuccessReceiver) {
		
		var sd = ScraperData; //shorthand for coding
		var sr = SuccessReceiver;

		$scope.loading = true;
		$scope.username = sd.getUsername();
		$scope.profiles = []; //Profile objects will be pushed here after processing.


		sr.register($scope); //Registeres this controller as one that should receive updates from SuccessReceiver
		$scope.successes = sr.users; //Syncs with list of successfully messaged users in this session
		console.log('SuccessReceivers service array of users:', sr.users);
		
		$scope.keywords = sd.getKeywords("jrrera@gmail.com"); //This may need to be put inside sd.getProfiles.then() since this will also be async once calling from database
		
		sd.getProfiles($scope.username)
			.then(function(data){
				angular.forEach(data, function(profileObj){
					//console.log(profileObj);

					var okcContext = sd.processContext(profileObj.html);
					var jqueryArr = sd.turnIntoJquery(profileObj.html);
					jqueryArr[0] = sd.processProfileText(jqueryArr[0]); //Processes the profile text
					jqueryArr.push(okcContext);

					profileObj = {
						okcText: jqueryArr[0],
						okcUsername: jqueryArr[1],
						okcPicture: jqueryArr[2],
						okcContext: jqueryArr[3],
						id: profileObj.id,
						messaged: profileObj.messaged,
						matches: sd.findSimilarities(jqueryArr[0], $scope.keywords, jqueryArr[3]) //Generates the object that the Chrome extension front end looks for
					}
					
					$scope.profiles.push(profileObj);

				});
				console.log($scope.profiles);
				$scope.loading = false;
			});

		$scope.open = function (user, profile) {

		  var modalInstance = $modal.open({
		    templateUrl: 'myModalContent.html',
		    controller: ModalInstanceCtrl,
		    resolve: {
		      profile: function () {
		        return profile;
		      },
		      user: function() {
		      	return user;
		      }
		    }
		  });
		};
	}
);