app.controller("HomeController", ['$scope', '$location', 'AuthenticationService','apiCall',	 function($scope, $location, AuthenticationService, apiCall) {
	scope = $scope;
	$scope.search_results = [];
	$scope.logout = function() {
	AuthenticationService.logout();
	};

	$scope.goToEvent = function (e) {
		var event_url = $(e.target).attr('id') || $(e.target).closest('.search_result').attr('id')
		console.log(event_url);
		$location.path('/' + event_url);
	}

	$scope.search = function () {
		var search_obj = {}
		if ($scope.search_mothers_first_name !== '') {
			search_obj.mothers_first_name = $scope.search_mothers_first_name;
		}
		if ($scope.search_mothers_last_name !== '') {
			search_obj.mothers_last_name = $scope.search_mothers_last_name;
		}
		if ($scope.search_fathers_first_name !== '') {
			search_obj.fathers_first_name = $scope.search_fathers_first_name;
		}
		if ($scope.search_fathers_last_name !== '') {
			search_obj.fathers_last_name = $scope.search_fathers_last_name;
		}
		if (search_obj.fathers_last_name || search_obj.fathers_first_name || search_obj.mothers_last_name ||search_obj.mothers_first_name) {
			apiCall.findEvent(search_obj).success(function (s) {
				console.log('success', s);
				$scope.search_results = s;
			}).error(function (e) {
				console.log('error', e)
			})
		}
	}
}]); 