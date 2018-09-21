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
};

tcp_server.prototype.start = function(cb) {
	this.server = net.createServer((sock) => {
		//'connection' listener
		//console.log('client connected');
		event_manager.emit(constants.EVENT.TCP_CONNECTED, sock, function(){
			
		});
	});
	
	this.server.on('error', (err) => {
		if (error.code === PORT_IN_USE) {
			// try next port in range
			logger.verbose('port is in use:');
		}
	});
	
	this.server.listen(this.port, () => {
		console.log('server bound');
		cb();
	});
};

tcp_server.prototype.stop = function(cb){

};

module.exports = tcp_server;