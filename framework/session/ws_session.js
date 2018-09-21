/**
 * Module dependencies.
 */
const uuid = require("../../util/uuid");
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

function ws_session(){
	this.id = null;
	this.name = null;
	
	this.sock = null;
	
	this.remote_ip = null;
	this.remote_port = null;
	
	this.create_time = null;
}

ws_session.prototype.get_id = function(){
	return this.id;
}

ws_session.prototype.get_opts = function(closed = false){
	return {
		"id" : this.id,
		"remote_ip" : this.remote_ip,
		"role" : constants.SOCKET_TYPE.WEBSOCKET,
		"closed" : closed
	};
}

//https://github.com/socketio/engine.io
ws_session.prototype.init = function(sock){
	this.id = uuid.v4();
	this.name = '{Websocket ID:' + this.id + '}';
	
	this.sock = sock;
	
	//this.remote_ip = sock.remoteAddress;
	//this.remote_port = sock.remotePort;
	
	this.create_time = Date.now();
	
	var self = this;
	
	/* WS data is received by client */
	sock.on("message", function(packet){
		event_manager.emit(constants.EVENT.PROCESS_PACKET, packet, self.get_opts());
	});
	
	/* TCP connection error detected */
	sock.on("error", function(error){
		self.kill(error);
	});
	
	/* the socket is fully closed */
	sock.on("close", function(reason, description){
		self.close(reason, description);
	});
	
	event_manager.emit(constants.EVENT.PROCESS_PACKET, sock["request"] ? sock.request.url : null, self.get_opts());
}

ws_session.prototype.kill = function(error){
	if(this.sock) {
		try {
			if (error) {
				mlogger.error(this.name + ' Websocket connection killed from server:' + error);
			} else {
				mlogger.info(this.name + ' Websocket connection killed from server without error');
			}
			
			this.sock.close();
		} catch (e) {
			mlogger.error(this.name + ' Websocket socket destroy failed:' + e);
		}
	}

	this.clear();
}

ws_session.prototype.close = function(reason, description){
	if (this.sock) {
		try {
			if(reason){
				mlogger.error(this.name + ' Websocket connection closed with reason:' + reason);
			}else{
				mlogger.error(this.name + ' Websocket connection closed without reason without error');
			}

			this.sock.close();
		} catch (e) {
			mlogger.error(this.name + 'Websocket close failed:' + e);	
		}
	}

	this.clear();
}

ws_session.prototype.clear = function(){
	var self = this;

	if (this.sock) {
		try {
			this.sock.close();
		} catch (err) {
			mlogger.error('Clearing websocket object error:' + err);
		}
	}
	
	event_manager.emit(constants.EVENT.WEBSOCKET_CLOSED, this.id, function(){
		event_manager.emit(constants.EVENT.PROCESS_PACKET, null, self.get_opts(true));
	});
}

//Bug Not Opened
ws_session.prototype.send = function(data){
	try{
		if(data["type"] == "Buffer"){
			this.sock.send(Buffer.from(data["data"]));
		}else{
			this.sock.send(data);
		}
	}catch(e){
		mlogger.error(this.name + "send error:" + e);
	}
}

module.exports = ws_session;