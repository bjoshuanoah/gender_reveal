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





