app.factory('apiCall', ['$http', function($http) {
   return {
        getEvent: function(event_name) {
            return $http.get('/api/events/get_event/' + event_name)
        }
   }
}]);