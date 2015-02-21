const qstat = require('./qstat');

qstat('qw.foppa.dk', 27501, function(status) {
	console.log(status);
	});
