//'use strict';
const http = require('http');
// use path for /local/pathnames ?
const url = require('url');
const api_endpoints = require('./api/endpoints.js');
const render_view = require('./render/view.js');
// const serveme = require('./api/serveme.js');
const config = require('./config.js');

http.createServer(function(request, response) {
        var parsed = url.parse(request.url, true)

	// add routing module here

	if (parsed.pathname.slice(0, 7) == "/api/v1") {
		api_endpoints(request, response)
	} else {
		render_view(request, response, parsed)
	}

//	} else {
//		response.writeHead(404)
//		response.write("oops")
//		response.end()
//	}
}).listen(config.port).on('listening', function() {
	console.log('Up and running');
});
