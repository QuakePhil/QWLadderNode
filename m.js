var mongojs = require('mongojs')
var config = require('./config.js');
var db = mongojs.connect(config.mongo_uri, config.mongo_collections)

/*
	if (body && body.login && !users[body.login]) {
		console.log("New user: " + body.login);
		var user = {};
// auth_status: 0 - not authorized
//              1 - quakenet authorization pending
//              2 - quakenet authorization failed
//              3 - quakenet authorization succeeded
// 
		users[body.login] = {
			auth_status: 0,
			pass_hash: '',
			token: '',
		};
		users.push(user);
	}
*/

// =============================================================================

var login = 'QuakePhil';
var login2 = 'test';
var hash = 'asjd9f8ashf98ashf9aushf8as7dfhas9d7f';

//db.users.findAndModify({
//	query: { login: login },
//	update: { $set: { auth_status: 0, pass_hash: '', } },
//	new: true
//});

db.users.find({login: login}, function(error, docs) {
	console.log("first find is: " + docs);
});
db.users.find({login: login}, function(error, docs) {
	console.log("second find is: " + docs);
});


db.users

console.log('finally');

db.users.find(function (error, docs) {
	console.log(docs)
	db.close()
});
console.log('done');
