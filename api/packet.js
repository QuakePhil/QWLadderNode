const qstat = require('./qstat');

qstat('93.81.254.63', 27501, function(status) {
	console.log(status);
	});
