/**
 * Module dependencies.
 */
const request = require('request');
const ip_mod = require('ip');
const randomip = require('random-ip');

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

			if (err) {
				resolve({
					"success": false,
					"msg": "Internal Server Error",
					"body": "",
					"headers": {}
				});
			} else {
				resolve({
					"success": false,
					"msg": `${res.statusCode} with body: ${body}`,
					"body": body,
					"headers": res.headers
				});
			}
		});
	});
}

net_op.random_public_ipv4 = function () {
	let self = this;
	let ip = randomip('0.0.0.0', 0);

	if(ip_mod.isPrivate(ip)){
		return self.random_public_ipv4();
	}

	return ip;
}