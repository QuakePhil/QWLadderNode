var parseString = require('xml2js').parseString;
var http = require('http')
var bl = require('bl')

var mapsbyip = [];
var serverlistAge = 0;

module.exports = function serverlist(cb) {
	var newAge = Date.now();
	var oldAge = serverlistAge;
	serverlistAge = newAge;
	if (newAge > oldAge + 5 * 60 * 1000)
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
						if (key.substring(0,3) == '75.')
							mapsbyip.push(item);
						}
					var item = {};
					var key = val.ip + ':' + val.port;
					item[key] = val.map.toString();
					if (key.substring(0,3) == '75.')
						mapsbyip.push(item);
					});
				// in the form of [ {ipport1: dm3}, {ipport2: dm4}, ... ] 
				cb(mapsbyip);
				});
			}))
		})
	else
		cb(mapsbyip);
	}

