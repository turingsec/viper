var master = require("../framework/ipc/master");

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
	master.init(app, opts);
};

Infrastructure.prototype.start = function(cb) {
	master.start(cb);
};

Infrastructure.prototype.stop = function(force, cb) {
	master.stop(cb);
};