'use strict';
const http = require('http');
// use path for /local/pathnames ?
const url = require('url');
const mongojs = require('mongojs');
const api_endpoints = require('./api/endpoints.js');
const render_view = require('./render/view.js');
const ws_server = require('./api/serveme.js');

// ws_server.do_something()

http.createServer(function(request, response) {
        var parsed = url.parse(request.url, true)
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
}).listen(8080).on('listening', function() {
	console.log('Up and running');
});
