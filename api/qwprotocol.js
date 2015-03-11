exports.QWClient = QWClient;

const dgram = require('dgram');

// todo:
// implement constructor
// implement addListener
// implement disconnect

// socket is udp

// each buffer has its own data
// each stream has its own buffer
// each stream is little endian

// buffer      open mode
// in          read
// out unr     write
// out rel     write
// out         readwrite

function QWClient(host, port, cb) {
	return;

	// server:
	var server = dgram.createSocket('udp4');
	server.on('error', function (error) {
		console.log('dgram server error: ' + error.stack);
		server.close();
		});

	server.on('message', function (message, rinfo) {
		console.log('dgram ' + rinfo.address + ':' + rinfo.port + ' ' + message);

		var serverStatus = {};

		var lines = message.toString().split("\n");
		var keyvalues = lines[0].split("\\");
		if (keyvalues.length > 1) for (var keyvalue_index = 1; keyvalue_index < keyvalues.length; keyvalue_index += 2) {
			serverStatus[keyvalues[keyvalue_index]] = keyvalues[keyvalue_index+1];
			}
		serverStatus['playercount'] = lines.length - 2;
		cb(serverStatus);

		server.close();
		});

	server.on('listening', function () {
		var address = server.address();
		console.log('dgram listening on ' + address.address + ':' + address.port);
		});

	server.bind(27001, '192.168.1.102');

	// client:
	var ff = String.fromCharCode(0xFF);
	var message = new Buffer(ff+ff+ff+ff+'status', 'ascii');
	server.send(message, 0, message.length, port, host, function(err) {
		//if (err)
			console.log('dgram send: ' + err);
		});
	}

Client.prototype.connect = function() {
	};
