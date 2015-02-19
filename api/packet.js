// test this method 
const net = require('net');
const dns = require('dns');

//dns.lookup('qw.foppa.dk', function (err, address, family) {
var socket = new net.Socket({readable: true, writable: true, allowHalfOpen: true});
console.log(socket);
var status = socket.connect({port: 27503, host: 'qw.foppa.dk'}, function () {
	console.log('Connect');
	socket.write('status');
	});
console.log(status);

socket.on('data', function(data) {
	console.log('Data: ' + data);
	socket.destroy();
	});

socket.on('close', function() {
	console.log('Socket closed:');
	});
