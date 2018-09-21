/**
 * Load and start websocket server infrastructure.
 */
const https = require('https');
const engine = require('engine.io');
const fs = require("fs");
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

var websocket_server = function(app, opts){
	opts = opts || {};

	this.server = null;
	this.port = opts.port;
	this.ssl = opts.ssl;
};

websocket_server.prototype.start = function(cb) {
	var port = this.port[0];
	var is_secure = this.port[1];

	if(is_secure){
		this.server = engine.attach(https.createServer({
			key: fs.readFileSync(this.ssl.key),
			cert: fs.readFileSync(this.ssl.cert)
		}).listen(port));
	}else{
		this.server = engine.listen(port);
	}

	this.server.on('connection', (sock) => {
		mlogger.info("new websocket connected");

		event_manager.emit(constants.EVENT.WEBSOCKET_CONNECTED, sock, function(){

		});
	});

	mlogger.info('Websocket server listening on ' + port);
	cb();
};

websocket_server.prototype.stop = function(cb){

};

module.exports = websocket_server;
