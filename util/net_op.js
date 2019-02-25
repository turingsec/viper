/**
 * Module dependencies.
 */
const request = require('request');

var net_op = module.exports = {};

net_op.common_request = function (options) {
	options["timeout"] = options["timeout"] || 3000;
	
	return new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				resolve({
					"success": true,
					"body": body,
					"headers": res.headers
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
					"msg": `${res.statusCode} with body: ${body}`
				});
			}
		});
	});
}