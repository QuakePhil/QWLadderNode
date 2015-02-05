var http = require('http')
var url = require('url')
var api_endpoints = require('./api/endpoints.js')
var render_view = require('./render/view.js')

http.createServer(function(request, response) {
        var parsed = url.parse(request.url, true)

	if (parsed.pathname.slice(0, 7) == "/api/v1") {
		api_endpoints(request, response)
	} else if (parsed.pathname == "/welcome") {
		render_view(request, response)
	} else {
		response.writeHead(404)
		response.write("oops")
		response.end()
	}
}).listen(8080 /*, 'optional interface' */)

