var databaseUrl = "bjoshuanoah:qwert1@paulo.mongohq.com:10021/gender_reveal",
    collections = ["users", "events"],
    db = require("mongojs").connect(databaseUrl, collections);

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
}

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
							res.send({
								boy_votes: response[0].boy_votes.length,
								girl_votes: response[0].girl_votes.length
							})
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
							res.send({
								boy_votes: response[0].boy_votes.length,
								girl_votes: response[0].girl_votes.length
							})
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