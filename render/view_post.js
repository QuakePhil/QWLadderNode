module.exports = function (request, response, parsed) {
	response.writeHead(200, {
		'Content-Type': 'text/html'
	});

	request.setEncoding('utf8');

	if (parsed.pathname.slice(0, 8) == "/assets/") {
		response.write("asset");
		response.end();
	} else {
		require('fs').createReadStream('/home/phil/ladderapi/client/index.html').pipe(response);
	//	response.end();
	}

/*
	var body = '';
	if (request.method == "POST") {
		request.on('data', function (data) {
			body += data;
			if (body.length > 1e6) // maximum upload file (1e6 - 1 million)
				request.connection.destroy();
		});
		request.on('end', function () {
			response.write("this is the view for " + require('parse').parse(request.url).pathname)));
			response.end();
		});
	}
	else {
		response.write("this is the view for " + require('parse').parse(request.url).pathname)));
		response.end();
	}*/
}
