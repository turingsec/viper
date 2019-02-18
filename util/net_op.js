/**
 * Module dependencies.
 */
const https = require('https');
const http = require('http');
const request = require('request');

var net_op = module.exports = {};

net_op.request = function (obj, option, cb) {
	return new Promise((resolve, reject) => {
		obj.get(option, function (res) {
			var data = [], dataLen = 0;

			res.on('data', function (chunk) {
				data.push(chunk);
				dataLen += chunk.length;
			}).on('end', function () {
				var buf = Buffer.alloc(dataLen);

				for (var i = 0, len = data.length, pos = 0; i < len; i++) {
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

net_op.https_request = function (option) {
	return net_op.request(https, option);
}

net_op.http_request = function (option) {
	return net_op.request(http, option);
}

net_op.common_request = function (options) {
	return new Promise(function (resolve, reject) {
		request(options, function (err, resp, body) {
			if (!err && resp.statusCode == 200) {
				resolve({
					"success": true,
					"body": body
				});
				return;
			}
			
			if (err){
				resolve({
					"success": false,
					"msg": "Internal Server Error"
				});
			}else{
				resolve({
					"success": false,
					"msg": `${resp.statusCode} with body: ${body}`
				});
			}
		});
	});
}