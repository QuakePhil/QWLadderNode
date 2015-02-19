const config = require('../config.js');
const fs = require('fs');

module.exports = function (request, response, parsed) {
	//request.setEncoding('utf8');
	if (config['assets'].indexOf(parsed.pathname) != -1 && fs.existsSync(config['asset_root'] + parsed.pathname)) {
		console.log("Rendering asset: " + parsed.pathname);
		var ext = parsed.pathname.substr(
			parsed.pathname.lastIndexOf('.') + 1
		);
		var types = {
			 'gif': 'image/gif',
			 'png': 'image/png',
			 'js': 'application/javascript',
			  'css': 'text/css',
		};			
		var type = 'text/html';
		if (types[ext]) type = types[ext];
		response.writeHead(200, {
			'Content-Type': type
		});

		fs.createReadStream(config['asset_root'] + parsed.pathname).pipe(response);
		//response.write("asset found: " + parsed.pathname);
		//response.end();
		}
	else if (parsed.pathname.indexOf('/levelshots/') == 0) {
		try {
			var map = parsed.pathname.split('/');
			if (config.levelshots.indexOf(map[2]) != -1) {
				response.writeHead(200, {
					'Content-Type': 'image/jpg'
					});
				fs.createReadStream(config['levelshot_root'] + map[2] + '.jpg').pipe(response);
				}
			}
		catch (e) {
			console.log(e);
			}
		}
	else {
		console.log("Rendering client view: " + parsed.pathname);
		response.writeHead(200, {
			'Content-Type': 'text/html'
		});
		fs.createReadStream(config['client_root']).pipe(response);
		//response.end();
		}
	}
