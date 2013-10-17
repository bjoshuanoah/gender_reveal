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