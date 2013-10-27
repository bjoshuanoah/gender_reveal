
update_event_stats = function (event_name, obj) {

	redis.smembers('events:' + event_name, function (err, reply) {
		// console.log(reply);
        var event_client_array = reply.toString().split(',');
        // console.log(event_client_array)
        for (var i = 0; i< event_client_array.length; i++) {
	        var client_id = event_client_array[i];
	        // console.log(client_id)
	        io.sockets.socket(client_id).emit('updated', obj);
	        // console.log('sending_socket to ' + client_id + ' for event ' + event_name);
	    }
    });
};


exports.updateGender = function (req, res) {
	var event_name = req.params.event_name;
	var gender = req.params.gender;
	db.events.find({name: event_name}, function (err, response) {
		var new_event_obj = response[0];
		new_event_obj.gender = gender;
		db.events.update({name:event_name}, new_event_obj, function ( err, response) {
			update_event_stats(event_name, {});
			res.send({status: 'success'})
		});
	});
}

exports.socket = function (req, res) {
	var event_name = req.params.event_name;
	var obj = {};
	update_event_stats(event_name, obj);
	res.send({status: 'success'});
}


//create event
//must have
// {
// 	chart_type: "Pie" || "Doughnut,
// 	due_date: ts,
// 	fathers_first_name: string,
// 	fathers_last_name: string,
// 	mothers_first_name: string,
// 	mothers_last_name: string,
// 	name: url_name - string,
// 	title: string"
// }
exports.createEvent = function (req, res) {
	var new_event_obj = req.body;
	new_event_obj.voted_users=[];
	new_event_obj.boy_votes=[];
	new_event_obj.girl_votes=[];
	db.events.insert(new_event_obj, function (error, response) {
		if (error) {
			res.json({
				400 : {
					error: "Could Not Create Event" 
				}
			})
		} else {
			console.log('success')
			res.send(response);
		}
	});
};

// Search by parents names
exports.findEvent = function (req, res) {
	var search_terms = req.body;
	db.events.find(search_terms).limit(20, function (error, response) {

		if (error) {
			res.json({
				400 : {
					error: "Search Not Found" 
				}
			})
		} else {
			res.send(response);
		}
	});
}

// Have event_url_name
exports.getEvent = function (req, res) {
	var name = req.params.name;
	db.events.find({name: name}, function (error, response) {

		if (error) {
			res.json({
				400 : {
					error: "Search Not Found" 
				}
			})
		} else {
			response[0].boy_votes_length = response[0].boy_votes.length
			response[0].girl_votes_length = response[0].girl_votes.length
			res.send(response);
		}
	});
}

// exports.updateEvent = function (req, res) {
// 	console.log('updating event');
// 	console.log(req.params);
// 	res.json({'Event': 'The Noahs'})
// }

exports.voteGirl = function (req, res) {
	var event_id = req.params.event_id;
	var name = req.params.name;
	var time = new Date().getTime();
	var user_id = req.params.user_id;
	db.events.find({_id:db.ObjectId(event_id)}, function (error, response) {
		var flag = false;
		for (var i = 0; i < response[0].voted_users.length; i++) {
			if (response[0].voted_users[i] === user_id) {
				flag = true;
			}
		}
		if (flag === true) {
			res.send({403 : {error: "already voted"}})
		} else {
			db.events.update({_id:db.ObjectId(event_id)} , { $push: {
						girl_votes : {
							name: name, 
							time: time,
							user_id: user_id
						},
						voted_users: user_id
					}
				}, function (error, response) {
				if (error) {
					console.log('first error')
					res.send({
						400 : {
							error: "Event Not Found" 
						}
					})
				} else {
					if (response) {
						db.events.find({_id:db.ObjectId(event_id)}, function (error, response) {
							var obj = {
								boy_votes: response[0].boy_votes.length,
								girl_votes: response[0].girl_votes.length
							}
							res.send(obj);
							console.log('sending_socket');
							update_event_stats(response[0].name, obj);
						} )
					} else {
						console.log('cant get second respons')
						res.send({
							400 : {
								error: "Event Not Found" 
							}
						})
					}
				}
			});
		}
	})
}

exports.voteBoy = function (req, res) {
	var event_id = req.params.event_id;
	var name = req.params.name;
	var time = new Date().getTime();
	var user_id = req.params.user_id;
	db.events.find({_id:db.ObjectId(event_id)}, function (error, response) {
		var flag = false;
		for (var i = 0; i < response[0].voted_users.length; i++) {
			if (response[0].voted_users[i] === user_id) {
				flag = true;
			}
		}
		if (flag === true) {
			res.send({403 : {error: "already voted"}})
		} else {
			db.events.update({_id:db.ObjectId(event_id)} , { $push: {
						boy_votes : {
							name: name, 
							time: time,
							user_id: user_id
						},
						voted_users: user_id
					}
				}, function (error, response) {
				if (error) {
					console.log('first error')
					res.send({
						400 : {
							error: "Event Not Found" 
						}
					})
				} else {
					if (response) {
						db.events.find({_id:db.ObjectId(event_id)}, function (error, response) {
							var obj = {
								boy_votes: response[0].boy_votes.length,
								girl_votes: response[0].girl_votes.length
							}
							res.send(obj);
							update_event_stats(response[0].name, obj);
							console.log('sending_socket');
						} )
					} else {
						console.log('cant get second respons')
						res.send({
							400 : {
								error: "Event Not Found" 
							}
						})
					}
				}
			});
		}
	})
}