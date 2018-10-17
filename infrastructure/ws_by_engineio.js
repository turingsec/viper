var websocket = require("../framework/net/ws_server_by_engineio");

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
	this.server = new websocket(app, opts);
};

Infrastructure.prototype.start = function(cb) {
	this.server.start(cb);
};

Infrastructure.prototype.stop = function(force, cb) {
	this.monitor.stop(cb);
};