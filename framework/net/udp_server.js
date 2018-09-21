/**
 * Load and start tcp server infrastructure.
 */
const dgram = require('dgram');
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

var udp_server = function(app, opts){
	opts = opts || {};
	
	this.server = null;
	this.port = opts.port;
};

udp_server.prototype.start = function(cb) {
	var self = this;
	
	self.server = dgram.createSocket('udp4');
	
	// emits when any error occurs
	self.server.on('error',function(error){
		mlogger.error('UDP Server Error: ' + error);
		self.server.close();
	});
	
	// emits on new datagram msg
	self.server.on('message',function(msg, info){
		/*
		mlogger.info('Data received from client : ' + msg.toString());
		mlogger.info('Received %d bytes from %s:%d\n', msg.size, info.address, info.port);
		
		//sending msg
		server.send("xxxxxxxxxx",info.port,'localhost',function(error){
			if(error){
				client.close();
			}else{
				mlogger.info('Data sent !!!');
			}
		});
		*/
		event_manager.emit(constants.EVENT.UDP_PACKET_PARSING, msg, function(packet){
			event_manager.emit(constants.EVENT.PROCESS_PACKET, packet, {
				"remote_ip" : info.address,
				"remote_port" : info.port,
				"role" : constants.SOCKET_TYPE.UDP_SOCKET
			});
		});
	});
	
	//emits when socket is ready and listening for datagram msgs
	self.server.on('listening', function(){
		const address = self.server.address();
		mlogger.info('UDP Server is listening at ' + address.address + ':' + address.port);
		cb();
	});

	//emits after the socket is closed using socket.close();
	self.server.on('close',function(){
		mlogger.info('UDP Server is closed !');
	});

	self.server.bind(this.port);
};

udp_server.prototype.stop = function(cb){

};

module.exports = udp_server;