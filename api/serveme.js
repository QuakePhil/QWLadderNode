const WebSocketServer = require('ws').Server;
const irc = require('irc');
const wss = new WebSocketServer({port: 8081});

/*
module.exports = function () {
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
*/


var mainChannel = '#qwwebapptesting'; // '#quakeworld';
var servemeMask = 'QuakePhil' // '[ServeMe]';

var c = new irc.Client(
	'irc.quakenet.org',
	'QWWebApp',
		{ 
			debug: true,
			channels: [ mainChannel ]
		}
	);

var ServeMe = [];

c.addListener('raw', function(message) {
	console.log(message);

	if (message.args[1])
	if (message.prefix && message.prefix.indexOf(
		//"QuakePhil"
		servemeMask
		) == 0
 && message.args[0] == mainChannel
 && message.args[1].indexOf("-qw- ") == 0) {

		var vars = message.args[1].split(' ', 7);
		var newQW = {};
		console.log(vars);
		newQW.nick = vars[1];
		newQW.link = vars[3];
		newQW.players = vars[4];
		newQW.message = vars[6];
		
		ServeMe.push(newQW);
		}

		// end of MOTD || MOTD is missing
//	if (message.rawCommand == '376' || message.rawCommand == '422')
//		c.send("PRIVMSG", "Q@Cserve.quakenet.org", "AUTH " + login + " " + pass);

	});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.sent(data);
	});
};

wss.on('connection', function connection(ws) {
	console.log('Connection accepted');
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
		});
	console.log(JSON.stringify(ServeMe));
	ws.send(JSON.stringify(ServeMe));
	});


