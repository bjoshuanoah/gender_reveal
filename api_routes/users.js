exports.create = function (req, res) {
	console.log('creating user');
	console.log(res);
}

exports.login = function (req, res) {
	console.log('logging in');
	console.log(req.headers);
	res.json({'user': 'Brian Noah'})
}