const url = require('url');
const qs = require('querystring');
const mongojs = require('mongojs')
const config = require('../config.js');
const spawn = require('child_process').spawn;

var db = mongojs.connect(config.mongo_uri, config.mongo_collections)

var external_auth = require('./quakenet.js');

var spawns = 

// note: should we have an api object?
// request
// parsed request
// response
// body (only avail during POST)
// and stop passing all this stuff around...

// note: we may want to save the status of users[].quakenet_auth
// as well as implement an "authed as of"

function new_hash(value) {
	return require('crypto').createHash('sha1').update(value).digest('hex');
}

function new_token(user) {
	var token = require('crypto').randomBytes(20).toString('hex');
	db.tokens.update({
		token: token
	}, {
		token: token,
		created: (new Date()).getTime(),
		user: user
	}, {
		upsert: true
	});
	return token;
}

function APIresult(response, result) {
	response.write(JSON.stringify(result));
	response.end();
	}

var endpoints = {
"/api/v1/register": function(req, response, body) {
	console.log('endpoint: ' + req.pathname);
	if (!body.pass)
		APIresult(response, {error: "Password required"})
	else db.users.findOne({ login: body.login }, function(error, user) {
		if (!user) {
			APIresult(response, {error: "User not found"})
		} else if (user['auth_status'] == 0 || user['auth_status'] == 2) {
			external_auth(body.login, body.pass, function(success) {
				console.log('ext auth: ' + success)
				if (success) {
					var token = new_token(body.login);
					db.users.update({ login: body.login },{
						'$set': {
							'auth_status': 3,
							'pass_hash': new_hash(body.pass),
							'token': token
						}
					});
					APIresult(response, token);
				} else {
					db.users.update({ login: body.login },{
						'$set': {'auth_status': 2}
					});
					APIresult(response, {error: "External auth failed"});
				}
			})
		} else if (user['auth_status'] == 1) {
			APIresult(response, {error: "External auth pending"});
		} else if (user['auth_status'] == 3) {
			db.users.findOne({login: body.login}, function(error, user){
				if (new_hash(body.pass) == user['pass_hash'])
					APIresult(response, {error: "Already registered, use /api/v1/token if you forgot your token"});
				else
					APIresult(response, {error: "Login failed"});
			})
		} else {
			APIresult(response, {error: "Please login"});
		}
	})
/*
	if (users[body.login].auth_status == 0 || users[body.login].auth_status == 2) {
		external_auth(body.login, body.pass, function(success) {
			console.log('external auth result: ' + success);
			users[body.login].auth_status = success ? 3 : 2;
			if (success) {
				users[body.login].pass_hash = new_hash(body.pass)
				users[body.login].token = new_token(body.login)
				APIresult(response, users[body.login].token)
			} else {
				APIresult(response, {"error": "Quakenet Authentication failed"})
			}
		});
	} else if (users[body.login].auth_status == 1) {
		APIresult(response, {"error": "Quakenet Authentication pending"})
	} else if (users[body.login].auth_status == 3) {
		// check password for has here
		if (new_hash(body.pass) == users[body.login].pass_hash)
			APIresult(response, {"error": "Allready registered, use /api/v1/token if you lost your token"})
		else
			APIresult(response, {"error": "Login failed"})
	} else {
		APIresult(response, {"error": "Please try again later"})
	}
*/
},

"/api/v1/token": function(req, response, body) {
	if (!body.pass)
		APIresult(response, {error: "Password required"})
	else db.users.findOne({ login: body.login }, function(error, user) {
		if (!user) {
			APIresult(response, {error: "User not found"})
		} else if (user['auth_status'] == 3 && new_hash(body.pass) == user['pass_hash']) {
			var token = new_token(body.login);
			db.users.update({ login: body.login },{
				'$set': { 'token': token }
			});
			APIresult(response, token);
		} else {
			APIresult(response, {error: "Please login"});
		}
	})
/*
	if (users[body.login].auth_status == 3 && new_hash(body.pass) == users[body.login].pass_hash) {
		users[body.login].token = new_token(body.login);
		APIresult(response, users[body.login].token);
	} else {
		APIresult(response, {"error": "Please login"})
	}
*/
},

// have zx64 take a look at this crap for holes
"/api/v1/play": function(req, response, body) {
	//var date = new Date();
	//APIresult(response, { "unixtime": date.getTime() });
}

} // endpoints

function processAPI(request, response, body) {
	var req = url.parse(request.url, true);

	if (body.login) db.users.findAndModify({
		query: { login: body.login },
		update: { $set: { lastseen: (new Date()).getTime() } },
		new: true
	}, function(error, data, lastErrorObject) {
		if (!data) // new entry
			// auth_status: 0 - not authorized
			//              1 - external authorization pending
			//              2 - external authorization failed
			//              3 - external authorization succeeded
		db.users.insert({
			login: body.login,
			auth_status: 0,
			pass_hash: '',
			token: '',
		})
	});

	var endpoint = endpoints[req.pathname];

	var candidate_token = '';
	if (request.headers && request.headers['authorization'])
		candidate_token = request.headers['authorization'].substring(7);

	if (endpoint) {
		// whitelist for guest access
		if (req.pathname == "/api/v1/register"
			|| req.pathname == "/api/v1/token") {
			// validate non blank login/pass here?
			endpoint(req, response, body)

// todo: instead of using users[], secure this against db.users.
		// everything else is secured
//		} else if (!tokens[candidate_token] || !users[tokens[candidate_token]] || candidate_token != users[tokens[candidate_token]].token) {
//			APIresult(response, { "error": "Must /api/v1/login first" })
//		} else
//			endpoint(req, response, body)
		} else {
			db.tokens.findOne({token: candidate_token}, function(error, data){
				if (data)
					APIresult(response, "call endpoint here")
				else
					APIresult(response, { "error": "Must /api/v1/login first" })
			})
		}
	} else {
		APIresult(response, { "error": "Endpoint not found" })
	}
}

// api entry point
module.exports = function (request, response) {
	response.writeHead(200, {
		'Access-Control-Allow-Origin': '*', // CORS
		'Access-Control-Allow-Methods': '*',

		'Content-Type': 'application/json'
	});

	request.setEncoding('utf8');

	var body = '';
	if (request.method == "POST") {
		request.on('data', function (data) {
			body += data;
			if (body.length > 1e6) // maximum upload file (1e6 - 1 million)
				request.connection.destroy();
		});
		request.on('end', function () {
			processAPI(request, response, qs.parse(body));

			//response.write(JSON.stringify(processAPI(request, qs.parse(body))));
			//response.end();
		});
	}
	else {
		processAPI(request, response, body);
		//response.write(JSON.stringify(processAPI(request, body)));
		//response.end();
	}
}
