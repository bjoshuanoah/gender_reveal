var app = angular.module("app", [])



app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider.when('/', {
    templateUrl: '/src/app/views/home.ng',
    controller: 'HomeController'
  });
 
  $routeProvider.when('/login', {
    templateUrl: '/src/app/views/login.ng',
    controller: 'LoginController'
  }); 

  $routeProvider.when('/:event', {
    templateUrl: '/src/app/views/event.ng',
    controller: 'EventController'
  });  
 
  $routeProvider.otherwise({ redirectTo: '/' });
}]);
app.controller("EventController", ['$scope', '$location', 'apiCall', function($scope, $location, apiCall) {
	var chart_element = document.getElementById("myChart").getContext("2d"),
		$chart = $('#myChart'),
		$event_info = $('#event_info'),
  		event_name = $location.path().replace('/', ''); 
  	$scope.event_url = event_name;
	genderChart = new Chart(chart_element);
	$scope.vote = function (e, gender) {
		var $this = $(e.target);
		$scope.voted = true;
		console.log(gender);
		var user_id = FB.getUserID()
		console.log(user_id);
		if (user_id.length === 0) {
			FB.login(function (response) {
				console.log(response);
			}, {scope:'email, user_likes, user_checkins, user_birthday, publish_stream'});
		}
	}

	options = {
		segmentShowStroke : true,
		segmentStrokeColor : "#fff",
		segmentStrokeWidth : 5,
		animation : true,
		animationSteps : 100,
		// animationEasing : "easeOutQuart",
		animateRotate : true,
		animateScale : true,
		onAnimationComplete : null
	};
  	apiCall.getEvent(event_name).then(function(result) {
  		angular.extend($scope, result.data[0]);
  		$chart.css({"max-height": (window.innerHeight - 40)+"px", "max-width": (window.innerHeight - 40)+"px"});
  		$scope.chart_data = [
  			{
  				value: $scope.boy_votes_length,
  				color: "rgb(156, 206, 255)"
  			},
  			{
  				value: $scope.girl_votes_length,
  				color: "rgb(255, 190, 190)"
  			},
  		];
  		if ($scope.chart_type === 'Doughnut') {
	  		genderChart.Doughnut($scope.chart_data, options);
  		} else if ($scope.chart_type === "Pie") {
  			genderChart.Pie($scope.chart_data, options);
  		}
  		setTimeout(function() {
  			if (window.innerWidth >767) {
		  		$event_info.animate({"top": ((window.innerHeight - 40)- $event_info.outerHeight())/2 + 'px'});
		  	}
  		},20)
	});
	$(window).resize(function () {
		if (window.innerWidth >767) {
			$event_info.css({"margin-top": ((window.innerHeight - 40)- $event_info.outerHeight())/2 + 'px'});
		} else {
			$event_info.css({"margin-top": '0'});
		}
		$chart.css({"max-height": (window.innerHeight - 40)+"px", "max-width": (window.innerHeight - 40)+"px"});
	})
}]);    
app.controller("HomeController", ['$scope', 'AuthenticationService', function($scope, AuthenticationService) {
  $scope.title = "Awesome Home";
  $scope.message = "Mouse Over these images to see a directive at work!";

  $scope.logout = function() {
    AuthenticationService.logout();
  };
}]); 
app.controller("LoginController", ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {
  $scope.credentials = { username: "", password: "" };

  $scope.login = function() {
    AuthenticationService.login($scope.credentials);
  }
}]);
app.factory('apiCall', ['$http', function($http) {
   return {
        getEvent: function(event_name) {
            return $http.get('/api/events/get_event/' + event_name)
        }
   }
}]);
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
// app.factory("AuthenticationService", ['$location', function($location) {
// }



// if (window.location.host.indexOf('egood.com') > -1){
// 			var app_id = '139225949507622';
// 			var channel_url = 'http://www.egood.com/channel.html'
// 		} else if (window.location.host.indexOf('egood4.us') > -1){
// 			var app_id = '461056347268149';
// 			var channel_url = 'https://www.egood4.us/channel.html'
// 		} else if (window.location.host.indexOf('egood4.me') > -1){
// 			var app_id = '497049573689364';
// 			var channel_url = 'https://www.egood4.me/channel.html'
// 		} else if (window.location.host.indexOf('noah') > -1){
// 			var app_id = '249283498531572';
// 			var channel_url = 'http://noah.local/channel.html'
// 		} else if (window.location.host.indexOf('etan') > -1){
// 			var app_id = '576021652413251';
// 			var channel_url = 'http://me.etan/channel.html';
// 		}else if (window.location.host.indexOf('1.115') > -1){
// 			var app_id = '371935796236712';
// 			var channel_url = 'http://192.168.1.115/channel.html'
// 		}else if (window.location.host.indexOf('jacob') > -1){
// 			var app_id = '337178103048702';
// 			var channel_url = 'http://us.jacoblocal/channel.html'
// 		}
// 		$.getScript('https://connect.facebook.net/en_US/all.js','FB',function(){

// 			if(window.fbInit!=true){
// 				window.fbInit=true;
// 				FB.init({
// 					appId: app_id,
// 					channelUrl : channel_url,
// 					status:true,
// 					cookie:false,
// 					xfbml:true
// 				});
// 			}


// 		    (function(d, s, id) {
// 				var js, fjs = d.getElementsByTagName(s)[0];
// 				if (d.getElementById(id)) return;
// 				js = d.createElement(s); js.id = id;
// 				js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=" + app_id + "";
// 				fjs.parentNode.insertBefore(js, fjs);
// 		    }(document, 'script', 'facebook-jssdk'));


// 	        FB.login(function (response) {
// 				if (response.authResponse) {
// 					var obj = {}
// 			    	obj.mobile_login = true;
// 			    	obj.access_token = response.authResponse.accessToken;
// 			    	obj.fb_userid = response.authResponse.userID;

// 			    	$.ajax({
// 						type: 'POST',
// 						dataType: 'json',
// 						beforeSend: function(xhr){apiKeys(xhr)},
// 						url: '/json/social/login',
// 						data: {'0-data':JSON.stringify(obj)},
// 						error: function (e) {
// 							console.log('error', e.responseText);
// 						},
// 						success: function (s) {
// 							var success = s['0-data'];
// 					    	if (success.user_id != undefined) {
// 								elem.removeClass('connecting')
// 								if (elem.hasClass('login')){
// 									var cookie = cookies.grab('eData');
// 									seo.go('/' + cookie.username);
// 								} else {
// 									elem.addClass('facebook_30-hover');
// 								}
// 					    	} else {
// 					    		elem.removeClass('connecting');
// 					    		shakeThis($('#shaker'));
// 					    	}
// 					    	if (func) {
// 					    		func(success);
// 					    	}
// 						}
// 					});
// 	            }else{
// 	            	func(null);
// 	            }
// 	        }, {scope:'email, user_likes, user_checkins, user_birthday, publish_stream'});
// 		}):





