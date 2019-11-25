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
	self.end_cb = opts.end_cb || process.exit;
}

master.start = function(cb) {
	for(let i = 0;i < self.child_num;++i){
		let tmp_child = cp.fork(self.child_module_path);
		
		tmp_child.on('message', function(message) {
			event_manager.emit(constants.EVENT.RECV_CHILD_MESSAGE, message, function(){
				
			});
		});
		
		tmp_child.on('close', (code) => {
			mlogger.error(`Child close stdio with code:${code}`);
			self.destroy();
		});
		
		tmp_child.on('exit', (code) => {
			mlogger.error(`Child exit with code:${code}`);
			self.destroy();
		});

		tmp_child.on('error', function(e) {
			mlogger.error(`Child error:${e}`);
			self.destroy();
		});
		
		tmp_child.on('disconnect', function() {
			mlogger.error(`Child disconnect`);
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
	self.end_cb();
};

master.send2child = function(packet, opts){
	let c = utils.random_in_array(self.children);
	
	c.send({"packet" : packet, 
			"opts" : opts});
};