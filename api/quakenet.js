#!/usr/bin/env node

var irc = require('irc');

module.exports = function (login, pass, callback) {
	var guestnick = 'Guest' + require('crypto').randomBytes(3).toString('hex').toUpperCase();

	var c = new irc.Client(
		'irc.quakenet.org',
		guestnick,
		{ 
			debug: true
		}
	);

	c.addListener('raw', function(message) {
		if (message.prefix == 'Q!TheQBot@CServe.quakenet.org' && message.args[0] == guestnick) {
			c.disconnect();
			if (message.args[1] == 'You are now logged in as ' + login + '.')
				callback(true);

			if (message.args[1] == 'Username or password incorrect.')
				callback(false);
		}

		// end of MOTD || MOTD is missing
		if (message.rawCommand == '376' || message.rawCommand == '422')
			c.send("PRIVMSG", "Q@Cserve.quakenet.org", "AUTH " + login + " " + pass);

	});

	setTimeout(c.disconnect(), 30000);
}

/*
login(process.argv[2], process.argv[3], function(success) {
	console.log(success ? "Logged in" : "Login failed");
});
*/
