/**
 * Load and start tcp server infrastructure.
 */
const udp = require('dgram');
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

	this.server = udp.createSocket('udp4');

	// emits when any error occurs
	server.on('error',function(error){
		mlogger.error('UDP Server Error: ' + error);
		server.close();
	});

	// emits on new datagram msg
	server.on('message',function(msg,info){
		/*
		mlogger.info('Data received from client : ' + msg.toString());
		mlogger.info('Received %d bytes from %s:%d\n',msg.length, info.address, info.port);
		
		//sending msg
		server.send("xxxxxxxxxx",info.port,'localhost',function(error){
			if(error){
				client.close();
			}else{
				mlogger.info('Data sent !!!');
			}
		});
		*/
	});
	
	//emits when socket is ready and listening for datagram msgs
	this.server.on('listening',function(){
		mlogger.info('UDP Server is listening at port' + self.port);
		cb();
	});

	//emits after the socket is closed using socket.close();
	this.server.on('close',function(){
		mlogger.info('UDP Server is closed !');
	});

	server.bind(this.port);
};

udp_server.prototype.stop = function(cb){

};

module.exports = udp_server;