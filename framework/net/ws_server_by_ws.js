/**
 * Load and start websocket server infrastructure.
*/
const fs = require('fs');
const https = require('https');
const http = require('http');
const WebSocketServer = require('ws').Server;
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

var websocket_server = function(app, opts){
	opts = opts || {};

	this.wss = null;
	this.server = null;
	this.port = opts.port;
	this.ssl = opts.ssl;
};

websocket_server.prototype.start = function(cb) {
	var port = this.port[0];

	if(this.port[1]){
		this.server = new https.createServer({
			key: fs.readFileSync(this.ssl.key),
			cert: fs.readFileSync(this.ssl.cert)
		});
	}else{
		this.server = http.createServer();
	}

	this.wss = new WebSocketServer({ server: this.server });
	this.wss.on('connection', (sock) => {
		mlogger.info("new websocket connected");

		event_manager.emit(constants.EVENT.WEBSOCKET_CONNECTED, sock, function(){

		});
	});

	this.server.listen(port, function(){
		mlogger.info('websocket_server listening on ' + port);
		cb();
	});
};

websocket_server.prototype.stop = function(cb){

};

module.exports = websocket_server;
