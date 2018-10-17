var udp_server = require("../framework/net/udp_server");

/**
 * Infrastructure factory function
 *	
 * @param  {Object} app  current application context
 * @return {Object}      component instances
 */
module.exports = function(app, opts) {
  return new Infrastructure(app, opts);
};

var Infrastructure = function(app, opts) {
	this.server = new udp_server(app, opts);
};

Infrastructure.prototype.start = function(cb) {
	this.server.start(cb);
};

Infrastructure.prototype.stop = function(force, cb) {
	this.monitor.stop(cb);
};