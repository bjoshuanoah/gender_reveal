var app = angular.module("app", [])

app.factory("AuthenticationService", ['$location', function($location) {
  return {
    login: function(credentials) {
      if (credentials.username !== "ralph" || credentials.password !== "wiggum") {
        alert("Username must be 'ralph', password must be 'wiggum'");
      } else {
        $location.path('/');
      }
    },
    logout: function() {
      $location.path('/login');
    }
  };
}]);

app.factory('apiCall', ['$http', function($http) {
   return {
        getEvent: function(event_name) {
             //return the promise directly.
            return $http.get('/api/events/get_event/' + event_name)
                 
        }
   }
}]);