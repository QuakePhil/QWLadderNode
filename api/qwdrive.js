const serverlist = require('./serverlist');
const qwprotocol = require('./qwprotocol');

serverlist(function(mapsbyip, infobyip) {
	for (var val in infobyip) if (infobyip[val].players > 0) {
		// console.log(infobyip[val]);
		var c = new qwprotocol.QWClient(infobyip[val]);

		c.addListener('raw', function(message) {
			console.log('message: ' + message);
		});

		setTimeout(function(){c.disconnect()}, 1000);
		break;
	}
});

