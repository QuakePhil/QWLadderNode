const config = require('../config.js');
const irc = require('irc');
const mongojs = require('mongojs');
const servmeParse = require('./qw.js');
const WebSocketServer = require('ws').Server;
const serverlist = require('./serverlist.js');
const dns = require('dns');

var db = mongojs.connect(config.mongo_uri, ['serveme']);

var wss = new WebSocketServer({port: config.port_serveme});

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


var c = new irc.Client(
	'irc.quakenet.org',
	'QWWebApp',
		{ 
//			debug: true,
			channels: [ config.channel ]
		}
	);

c.addListener('raw', function(message) {
	if (message.args[1])
	if (message.prefix
		 && message.prefix.indexOf(config.servemeMask) == 0
		 && message.args[0] == config.channel
		 && message.args[1].indexOf("-qw- ") == 0) {

		var newQW = servmeParse(message.args[1]);

		serverlist(function(mapsbyip){
			if (newQW.link) {
				var ipport = newQW.link.substring(5);
				mapsbyip.forEach(function(a, b){
					if (a[ipport]) newQW.map = a[ipport];
					});
				}
			if (!newQW.map) {
				var ipport = newQW.link.substring(5).split(':');
				dns.lookup(ipport[0], function (err, address, family) {
					var lookupport = address + ':' + ipport[1];
					mapsbyip.forEach(function(a, b){
						if (a[lookupport]) newQW.map = a[lookupport];
						});
					db.serveme.insert(newQW);
					})
				}
			else {
				db.serveme.insert(newQW);
				}
			});
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
	db.serveme.find({},function(error, data){
		var jsondata = JSON.stringify(data);
		console.log(jsondata);
		ws.send(jsondata);
		});
	});
