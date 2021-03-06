var parseString = require('xml2js').parseString;
var http = require('http')
var bl = require('bl')

var mapsbyip = {};
var infobyip = {};
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
						var key = val.hostname + ':' + val.port;
						mapsbyip[key] = val.map.toString();
						}
					var key = val.ip + ':' + val.port;
					mapsbyip[key] = val.map.toString();

					infobyip[key] = val;
					});
				// in the form of [ {ipport1: dm3}, {ipport2: dm4}, ... ] 
				cb(mapsbyip, infobyip);
				});
			}))
		})
	else
		cb(mapsbyip, infobyip); //417 verizon
	}

