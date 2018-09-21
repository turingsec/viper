/**
 * Load and start ipc infrastructure.
 */
const cp = require('child_process');
const path = require('path');
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

var master = module.exports = {};
var self = master;

master.init = function(app, opts){
	opts = opts || {};
	
	self.child = null;
	self.child_module_path = opts.path;
}

master.start = function(cb) {
	self.child = cp.fork(self.child_module_path);
	
	self.child.on('message', function(message) {
		event_manager.emit(constants.EVENT.RECV_CHILD_MESSAGE, message, function(){
			
		});
	});
	
	self.child.on('error', function(e) {
		mlogger.error("child error " + e);
	});
	
	self.child.on('disconnect', function(e) {
		mlogger.error("child disconnect " + e);
		
		self.destroy();
		self.child = null;
	});
	
	cb();
};

master.stop = function(cb) {
	if(self.child){
		self.child.disconnect();
	}
};

master.destroy = function() {
	process.kill();
};

master.send2child = function(packet, opts){
	if(self.child){
		self.child.send({"packet" : packet, 
							"opts" : opts});
	}
}