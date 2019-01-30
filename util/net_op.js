/**
 * Module dependencies.
 */
const https = require('https');

var net_op = module.exports = {};

net_op.download = function(options){
	return new Promise((resolve, reject) => {
		https.get(options, function(res) {
			var data = [], dataLen = 0;

			res.on('data', function(chunk) {
				data.push(chunk);
				dataLen += chunk.length;
			}).on('end', function() {
				var buf = new Buffer(dataLen);

				for (var i=0, len = data.length, pos = 0; i < len; i++) {
					data[i].copy(buf, pos);
					pos += data[i].length;
				}

				resolve(buf);
			});
		}).on('error', (e) => {
			reject(e);
		});
	});
}