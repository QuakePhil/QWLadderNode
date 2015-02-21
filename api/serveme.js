const config = require('../config');
const irc = require('irc');
const mongojs = require('mongojs');
const servmeParse = require('./qw');
const WebSocketServer = require('ws').Server;
const serverlist = require('./serverlist');
const dns = require('dns');
const qstat = require('./qstat');

var db = mongojs.connect(config.mongo_uri, ['serveme']);

var wss = new WebSocketServer({port: config.port_serveme});

wss.broadcast = function broadcast(data) {
	wss.clients.forEach(function each(client) {
		client.send(data);
	});
};

var c = new irc.Client('irc.quakenet.org', 'QWWebApp', {
	debug: true,
	channels: [ config.channel ]
	});

c.addListener('raw', function(message) {
	if (message.args[1])
	if (message.prefix
		 && message.prefix.indexOf(config.servemeMask) == 0
		 && message.args[0] == config.channel
		 && message.args[1].indexOf("-qw- ") == 0) {
console.log(message.prefix, message.args);
		// serveme parse takes a -qw- line and spits out an object
		var newQW = servmeParse(message.args[1]);
console.log(newQW);

		if (newQW.link) qstat(newQW.linkip, newQW.linkport, function(status) {
			newQW.map = status.map;
			// we are doing find before insert, because if we insert into mongo and then find
			// we are not guaranteed for the find to include the most recently inserted record
			// (timing issues? or am I missing something basic about mongo here)
			db.serveme.find({},function(error, data){
				data.push(newQW);
				var jsondata = JSON.stringify(data);
				wss.broadcast(jsondata);
				});
				db.serveme.insert(newQW);
			});
		}

		// end of MOTD || MOTD is missing
//	if (message.rawCommand == '376' || message.rawCommand == '422')
//		c.send("PRIVMSG", "Q@Cserve.quakenet.org", "AUTH " + login + " " + pass);

	});

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
