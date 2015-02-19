var parseString = require('xml2js').parseString;
var http = require('http')
var bl = require('bl')

var serverlist = [];

http.get('http://www.quakeservers.net/shambler_servers.php', function(response) {
	response.pipe(bl(function (err, data) {
		if (err)
			return console.error(err)

		parseString(data, function(err, result) {
			result.rss.channel[0].item.forEach(function (val) {
				if (val.hostname.toString() !== '') {
					var item = {};
					var key = val.hostname + ':' + val.port;
					item[key] = val.map.toString();
					serverlist.push(item);
					}
				var item = {};
				var key = val.ip + ':' + val.port;
				item[key] = val.map.toString();
				serverlist.push(item);
				});
			console.log(serverlist);
			});
		}))
	})

