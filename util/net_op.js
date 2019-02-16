/**
 * Module dependencies.
 */
const https = require('https');
const http = require('http');

var net_op = module.exports = {};

net_op.request = function(obj, option, cb){
	return new Promise((resolve, reject) => {
		obj.get(option, function(res) {
			var data = [], dataLen = 0;

			res.on('data', function(chunk) {
				data.push(chunk);
				dataLen += chunk.length;
			}).on('end', function() {
				var buf = Buffer.alloc(dataLen);

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

net_op.https_request = function(option){
	return net_op.request(https, option);
}

net_op.http_request = function(option){
	return net_op.request(http, option);
}
