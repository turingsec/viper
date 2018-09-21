/**
 * Module dependencies.
 */
const uuid = require("../../util/uuid");
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const input = require("../stream/input");
const mlogger = require("../../common/mlogger");

function tcp_session(){
	this.id = null;
	this.name = null;
	
	this.sock = null;
	this.input = null;
	
	this.remote_ip = null;
	this.remote_port = null;
	
	this.state = null;
	this.create_time = null;
}

tcp_session.prototype.get_id = function(){
	return this.id;
}

tcp_session.prototype.get_opts = function(closed = false){
	return {
		"id" : this.id,
		"remote_ip" : this.remote_ip,
		"role" : constants.SOCKET_TYPE.SOCKET,
		"closed" : closed
	};
}

tcp_session.prototype.init = function(sock, timeout){
	this.id = uuid.v4();
	this.name = '{Socket ID:' + this.id + '|' + sock.remoteAddress + ':' + sock.remotePort; + '}';
	
	this.sock = sock;
	this.input = new input(constants.BUFFER.INPUT_SIZE);
	
	this.remote_ip = sock.remoteAddress;
	this.remote_port = sock.remotePort;
	
	this.create_time = Date.now();
	
	var self = this;
	
	sock.setKeepAlive(true);
	sock.setTimeout(timeout);
	
	/* TCP data is received by client */
	sock.on("data", function(data){
		self.input.write(data);
		
		event_manager.emit(constants.EVENT.PACKET_PARSING, self.input, function(packet){
			event_manager.emit(constants.EVENT.PROCESS_PACKET, packet, self.get_opts());
		});
	});
	
	/* TCP disconnected by client */
	sock.on("end", function(){
		self.kill();
	});
	
	/* TCP connection error detected */
	sock.on("error", function(error){
		self.kill(error);
	});
	
	/* the socket is fully closed */
	sock.on("close", function(error){
		self.close(error);
	});
	
	/* socket times out from inactivity */
	sock.on("timeout", function(error){
		self.close("TCP connection timeout");
	});
	
	event_manager.emit(constants.EVENT.PROCESS_PACKET, null, self.get_opts());
}

tcp_session.prototype.kill = function(error){
	if(this.sock) {
		try {
			if (error) {
				mlogger.error(this.name + ' TCP connection killed from server:' + error);
			} else {
				mlogger.info(this.name + ' TCP connection killed from server without error');
			}
			
			this.sock.destroy();
		} catch (e) {
			mlogger.error(this.name + ' TCP socket destroy failed:' + e);
		}
	}

	this.clear();
}

tcp_session.prototype.close = function(error){
	if (this.sock) {
		try {
			if (error) {
				mlogger.error(this.name + ' TCP connection closed by error:' + error);
				// force close (closed)
				this.sock.destroy();
			} else {
				mlogger.info(this.name + ' TCP connection closed without error');
				// send FIN packet (half-closed)
				this.sock.end();
			}
		} catch (e) {
			mlogger.error(this.name + ' TCP socket end failed:' + e);	
		}
	}

	this.clear();
}

tcp_session.prototype.clear = function(){
	var self = this;
	
	if (this.sock) {
		this.sock.removeAllListeners();
		
		try {
			this.sock.end();
			this.sock.destroy();
		} catch (err) {
			mlogger.error('Clearing tcp socket object error:', err);
		}
	}
	
	event_manager.emit(constants.EVENT.TCP_CLOSED, this.id, function(){
		event_manager.emit(constants.EVENT.PROCESS_PACKET, null, self.get_opts(true));
	});
}

tcp_session.prototype.send = function(packet){
	try{
		if(packet["type"] == "Buffer"){
			this.sock.write(Buffer.from(packet["data"]));
		}else{
			mlogger.error(this.name + " data is not a buffer");
			mlogger.error(packet);
		}
	}catch(e){
		mlogger.error(this.name + "send error:" + e);
	}
}

module.exports = tcp_session;