app.controller("ChildController", ['$scope', '$location', function($scope, $location) {
  var title = $location.path().replace('/', ''); 
  $scope.title = title;
  $scope.message = "Mouse Over these images to see a directive at work!";
}]);    