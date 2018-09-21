/**
 * Load and start websocket server infrastructure.
*/

const engine = require('engine.io');
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../../common/mlogger");

var websocket_server = function(app, opts){
	opts = opts || {};
	
	this.server = null;
	this.port = opts.port;
};

websocket_server.prototype.start = function(cb) {
	this.server = engine.listen(this.port);
	
	this.server.on('connection', (sock) => {
		mlogger.info("new websocket connected");

		event_manager.emit(constants.EVENT.WEBSOCKET_CONNECTED, sock, function(){
			
		});
	});

	mlogger.info('websocket_server listening on ' + this.port);
	cb();
};

websocket_server.prototype.stop = function(cb){

};

module.exports = websocket_server;