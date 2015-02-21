// serveme formats:
// -qw- <(spec) nick> - qw://ip:port -- 1/2 : m e s s a g e
// -qw- <nick>        - qw://ip:port    7/8 : another message
// -qw- <ircnick> - <#chan> : message possible an hostname.ip:port here

module.exports = function servemeParse(line) { // todo: get stamp from irc line
	var newQW = {};
	var invalid = 0;
	var package = [];
	var contents = [];
	try {
		package = line.substring(5).split(' - ', 2);
		contents = package[1].split( ' : ', 2);
		}
	catch (e) {
		invalid = 1;
		}
	newQW.line = line;
	newQW.stamp = Date.now();
	if (invalid == 1)
		return newQW;

	newQW.nick = package[0];
	newQW.message = contents[1];

	switch (contents[0].substring(0, 1)) { // content type
		case 'q':
			var qwspec = contents[0].split(' ');
			newQW.link = qwspec[0]
			if (qwspec[1].length == 2) { // sometimes servme inserts a country code	
				newQW.country = qwspec[1]
				newQW.players = qwspec[2].split('/')
			} else {
				newQW.players = qwspec[1].split('/')
				}
			break;
		case '#':
			newQW.channel = contents[0];
			var words = contents[1].split(' ');
			for (var i = 0; i < words.length; ++i) if (words[i].indexOf('.') > 0) {
				newQW.link = words[i].toLowerCase();
				if (newQW.link.indexOf('qw://') !== 0)
					newQW.link = 'qw://' + newQW.link;
				}
			break;
		default:
		}

	if (newQW.link) {
		var ipport = newQW.link.substring(5).split(':');
		if (ipport.length == 2) {
			newQW.linkip = ipport[0];
			newQW.linkport = ipport[1];
			}
		}
		
	return newQW;
  	}

//console.log(servemeParse("-qw- Huckenbush - qw://91.236.53.124:27500 pl 3/26 : costam cvostam"));
//console.log(servemeParse("-qw- Panjabi - #paras : MIX last spots qw.foppa.dk:27503"));
//console.log(servemeParse("-qw- Panjabi - #paras : MIX last spots qw://qwfoppa.dk"));
//console.log(servemeParse("-qw- nick - qw://shkn.ws:28501 us 1/4 : duel east coast na i am newbie"));
//console.log(servemeParse("-qw- feari - qw://qw.foppa.dk:27501 4/8 : mix!"));
