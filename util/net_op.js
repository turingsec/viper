/**
 * Module dependencies.
 */
const request = require('request');
const ip_mod = require('ip');
const randomip = require('random-ip');

var net_op = module.exports = {};

net_op.common_request = function (options) {
	options["timeout"] = options["timeout"] || 3000;
	options["followRedirect"] = false;
	options["rejectUnauthorized"] = false;

	return new Promise(function (resolve, reject) {
		request(options, function (err, res, body) {
			if (!err && res.statusCode == 200) {
				resolve({
					"success": true,
					"body": body,
					"headers": res.headers,
					"status_code": res.statusCode,
					"status_message": res.statusMessage
				});
				return;
			}

			if (err) {
				resolve({
					"success": false,
					"msg": "Internal Server Error",
					"body": "",
					"headers": {},
					"err": err
				});
			} else {
				resolve({
					"success": false,
					"msg": `${res.statusCode} with body: ${body}`,
					"body": body,
					"headers": res.headers,
					"status_code": res.statusCode,
					"status_message": res.statusMessage
				});
			}
		});
	});
}

net_op.random_public_ipv4 = function () {
	let self = this;
	let ip = randomip('0.0.0.0', 0);

	if (ip_mod.isPrivate(ip)) {
		return self.random_public_ipv4();
	}

	return ip;
}

net_op.is_private = function (ip) {
	return ip_mod.isPrivate(ip);
}

//获取用户 ip
net_op.get_caller_ip = (request) => {
	let ip = request.headers['x-forwarded-for'] ||
		request.connection.remoteAddress ||
		request.socket.remoteAddress ||
		request.connection.socket.remoteAddress;
	ip = ip.split(',')[0];
	ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
	return ip;
}