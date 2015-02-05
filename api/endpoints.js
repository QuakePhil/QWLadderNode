var url = require('url');
var qs = require('querystring');
var external_auth = require('./quakenet.js');

// note: we may want to save the status of users[].quakenet_auth
// as well as implement an "authed as of"
var users = [];

function token() {
	return require('crypto').randomBytes(20).toString('hex');
}

// auth_status: 0 - not authorized
//              1 - quakenet authorization pending
//              2 - quakenet authorization failed
//              3 - quakenet authorization succeeded
// 

var endpoints = {
	"/api/v1/register": function(req, body) {
		if (users[body.login].auth_status == 0) {
			external_auth(body.login, body.pass, function(success) {
				users[body.login].external_auth = success ? 3 : 2;
			});
		}
// todo: this return statement is interrupting the call to external_auth ()?
		return "ok";
	},
	"/api/v1/token": function(req, body) {
		if (users[body.login].external_auth == 3) {
			users[body.login].token = token();
			return users[body.login].token;
		}
	},
	"/api/v1/secured": function(req) {
		var date = new Date();
		return {
			"unixtime": date.getTime()
		};
	}
}

function processAPI(request, body) {
	var req = url.parse(request.url, true);

	// check that req.pathname begins with /api/v1 here ?
	// or outside in the server.js handler
	
	var login = '';
	var token = '';
	if (body && body.login) login = body.login;
	if (body && body.token) token = body.token;

	if (login == '' && token == '')
		return { "error": "Login required" }

	if (body && body.login && !users[body.login]) {
		console.log("New user: " + body.login);
		var user = {};
		users[body.login] = {
			auth_status: 0,
			token: '',
			
		};
		users.push(user);
	}

	var endpoint = endpoints[req.pathname];

	if (endpoint) {
		if (req.pathname == "/api/v1/login") // whitelist for guest access
			return endpoint(req, body)
		//else if (!users[body.login] || users[body.login].token != body.token) // everything else is secured
		//	return { "error": "Must /api/v1/login first" }
		else
			return endpoint(req, body)
	}

	return JSON.stringify({"error": "Endpoint not found"});
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
			response.write(JSON.stringify(processAPI(request, qs.parse(body))));
			response.end();
		});
	}
	else {
		response.write(JSON.stringify(processAPI(request, body)));
		response.end();
	}
}
