app.controller("HomeController", ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {
  $scope.title = "Awesome Home";
  $scope.message = "Mouse Over these images to see a directive at work!";

  $scope.logout = function() {
    AuthenticationService.logout();
  };
}]); 