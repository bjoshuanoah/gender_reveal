app.controller("EventAdminController", ['$scope', '$location', '$http', 'apiCall', function($scope, $location, $http, apiCall) {
	var event_name = $location.path().split('/')[1];
	scope = $scope;

	console.log(event_name);
	apiCall.getEvent(event_name).then(function(result) {
  		angular.extend($scope, result.data[0]);
  	});
}]);