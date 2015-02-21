const config = require('../config.js');
const fs = require('fs');

module.exports = function (request, response, parsed) {
	//request.setEncoding('utf8');
	//if (config['assets'].indexOf(parsed.pathname) != -1 && 
	if (parsed.pathname == '/') {
		console.log("Rendering client view: " + parsed.pathname);
		response.writeHead(200, {
			'Content-Type': 'text/html'
		});
		fs.createReadStream(config['client_root']).pipe(response);
		//response.end();
		}
	// levelshot shortcut
	else if (parsed.pathname.indexOf('/ls/') == 0) {
		var levelshotDefault = 1;
		response.writeHead(200, {
			'Content-Type': 'image/jpg'
			});
		try {
			var map = parsed.pathname.split('/');
			//if (config.levelshots.indexOf(map[2]) != -1) {
			if (fs.existsSync(config['levelshot_root'] + map[2] + '.jpg')) {
				levelshotDefault = 0;
				fs.createReadStream(config['levelshot_root'] + map[2] + '.jpg').pipe(response);
				}
			}
		catch (e) {
			console.log(e);
			}
		if (levelshotDefault == 1) // unknown map/don't have levelshot
			fs.createReadStream(config['levelshot_root'] + '_notfound.jpg').pipe(response);
		}
	else if (fs.existsSync(config['asset_root'] + parsed.pathname)) {
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
	}
