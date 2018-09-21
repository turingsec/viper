/**
 * Load and start tcp server infrastructure.
 */

const net = require("net");
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../../common/mlogger");

var tcp_server = function(app, opts){
	opts = opts || {};
	
	this.server = null;
	this.port = opts.port;
	this.timeout = opts.timeout;
};

tcp_server.prototype.start = function(cb) {
	var self = this;

	this.server = net.createServer((sock) => {
		mlogger.info("new client connected ip:" + sock.remoteAddress);
		
		event_manager.emit(constants.EVENT.TCP_CONNECTED, sock, self.timeout, function(){
			
		});
	});
	
	this.server.on('error', (err) => {
		if (error.code === PORT_IN_USE) {
			mlogger.info('port is in use:' + self.port);
		}
	});
	
	this.server.listen(this.port, "0.0.0.0", () => {
		mlogger.info('tcp_server listening on ' + self.port);
		cb();
	});
};

tcp_server.prototype.stop = function(cb){

};

module.exports = tcp_server;