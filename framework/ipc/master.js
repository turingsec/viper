/**
 * Load and start ipc infrastructure.
 */
const cp = require('child_process');
const event_manager = require("../../adaptor/event_manager");
const constants = require("../../util/constants");
const utils = require("../../util/utils");
const mlogger = require("../../common/mlogger");

var master = module.exports = {};
var self = master;

master.init = function(app, opts){
	opts = opts || {};
	
	self.children = [];
	self.child_module_path = opts.path;
	self.child_num = opts.num;
}

master.start = function(cb) {
	for(let i = 0;i < self.child_num;++i){
		let tmp_child = cp.fork(self.child_module_path);
		
		tmp_child.on('message', function(message) {
			event_manager.emit(constants.EVENT.RECV_CHILD_MESSAGE, message, function(){
				
			});
		});
		
		tmp_child.on('error', function(e) {
			mlogger.error("child error " + e);
		});
		
		tmp_child.on('disconnect', function(e) {
			mlogger.error("child disconnect " + e);
			
			self.destroy();
		});
		
		self.children.push(tmp_child);
	}
	
	cb();
};

master.stop = function(cb) {
	for(let c of self.children){
		c.disconnect();
	}
};

master.destroy = function() {
	process.kill();
};

master.send2child = function(packet, opts){
	let c = utils.random_in_array(self.children);
	
	c.send({"packet" : packet, 
			"opts" : opts});
};