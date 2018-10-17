/**
 * Module dependencies.
 */
const utils = require('./util/utils');
const async = require('async');
const constants = require('./util/constants');
const event_manager = require("./adaptor/event_manager.js");
const comp_manager = require("./adaptor/comp_manager.js");

/**
 * Application prototype.
 *	
 * @module
 */
var Application = module.exports = {};

/**
 * Application states
 */
var STATE_INITED  = 1;  // app has inited
var STATE_START = 2;  // app start
var STATE_STARTED = 3;  // app has started
var STATE_STOPPED = 4; // app has stoped

/**
 * Initialize the server.
 *	
 *   - setup default configuration
 */
Application.init = function(marsnake, opts, cb){
	opts = opts || {};
	
	this.start_time = null;
	this.loaded_infras = {};
	this.loaded_components = {};
	
	event_manager.init();
	comp_manager.init(opts);
	
	this.adaptor_init(cb);
	this.load_infrastructure(marsnake, opts, cb);
	
	this.state = STATE_INITED;
}

/**
 *	Adaptor between infrastructures and components
 *	This implement not abstractly enough
 */
Application.adaptor_init = function(cb){
	try{
		// Associate between component
		comp_manager.get(constants.COMPONENT.TCP_SESSION_MGR).init(comp_manager.get(constants.COMPONENT.TCP_SESSION));
		comp_manager.get(constants.COMPONENT.WS_SESSION_MGR).init(comp_manager.get(constants.COMPONENT.WS_SESSION));
		
		// Associate between event and component
		// TCP
		event_manager.regist(constants.EVENT.TCP_CONNECTED, comp_manager.get(constants.COMPONENT.TCP_SESSION_MGR).create);
		event_manager.regist(constants.EVENT.TCP_CLOSED, comp_manager.get(constants.COMPONENT.TCP_SESSION_MGR).remove);
		event_manager.regist(constants.EVENT.RECV_CHILD_MESSAGE, comp_manager.get(constants.COMPONENT.TCP_SESSION_MGR).ready2send);
		event_manager.regist(constants.EVENT.PACKET_PARSING, comp_manager.get(constants.COMPONENT.STREAM_PARSER).handle_package);
		
		// WEBSOCKET
		event_manager.regist(constants.EVENT.WEBSOCKET_CONNECTED, comp_manager.get(constants.COMPONENT.WS_SESSION_MGR).create);
		event_manager.regist(constants.EVENT.WEBSOCKET_CLOSED, comp_manager.get(constants.COMPONENT.WS_SESSION_MGR).remove);
		event_manager.regist(constants.EVENT.RECV_CHILD_MESSAGE, comp_manager.get(constants.COMPONENT.WS_SESSION_MGR).ready2send);
		
		// IPC
		event_manager.regist(constants.EVENT.PROCESS_PACKET, comp_manager.get(constants.COMPONENT.MASTER_PROCESS).send2child);

		//UDP
		event_manager.regist(constants.EVENT.UDP_PACKET_PARSING, comp_manager.get(constants.COMPONENT.DGRAM_PARSER).handle_package);
		
	}catch(e){
		cb(e)
	}
}

/**
 *	Load component or infrastructure
 *	
 */
Application.load = function(loaded, gadget, obj, cb) {
	var name = obj["name"];
	var opts = obj["opts"];
	
	if(typeof gadget === 'function') {
		if(name && loaded[name]) {
			// ignore duplicat component
			utils.invokeCallback(cb, 'ignore duplicate component: ' + name);
			return;
		}

		loaded[name] = gadget(this, opts);
	}else{
		utils.invokeCallback(cb, 'gadget not a function: ' + name);
		return;
	}
}

/**
 *	Load component or infrastructure
 *
 */
Application.load_infrastructure = function(marsnake, opts, cb) {
	var self = this;

	opts["infrastructures"].forEach(function(obj){
		if(marsnake.infrastructures.hasOwnProperty(obj["name"])){
			self.load(self.loaded_infras, marsnake.infrastructures[obj["name"]], obj, cb);
		}else{
			cutils.invokeCallback(cb, 'infrastructure not found in marsnake: ' + obj["name"]);
			return;
		}
	})
}

/**
 * Start application. It would load the default infrastructures and start all the loaded infrastructures.
 *	
 * @param  {Function} cb callback function
 * @memberOf Application
 */
Application.start = function(cb) {
	this.start_time = Date.now();

	if(this.state > STATE_INITED) {
		utils.invokeCallback(cb, new Error('application has already start.'));
		return;
	}

	var self = this;

	self.opt_infrastructures(self.loaded_infras, constants.LIFECYCLE.START, function(err) {
		self.state = STATE_START;
		
		if(err) {
			utils.invokeCallback(cb, err);
		} else {
			self.after_start(cb);
		}
	});
}

/**
 * Lifecycle callback for after start.
 *	
 * @param  {Function} cb callback function
 * @return {Void}
 */
Application.after_start = function(cb) {
	if(this.state !== STATE_START) {
		utils.invokeCallback(cb, new Error('application is not running now.'));
		return;
	}
	
	var self = this;
	
	this.opt_infrastructures(this.loaded_infras, constants.LIFECYCLE.AFTER_START, function(err) {
		self.state = STATE_STARTED;
		
		utils.invokeCallback(cb, err);
		
		var usedTime = Date.now() - self.start_time;
		//logger.info('%j startup in %s ms', id, usedTime);
	});
}

/**
 * Stop application. It would stop the loaded infrastructures.
 *	
 * @param  {Function} cb callback function
 * @memberOf Application
 */
Application.stop = function(cb) {
	var self = this;

	self.opt_infrastructures(self.loaded_infras, constants.LIFECYCLE.STOP, function(err) {
		self.state = STATE_STOPPED;
		
		utils.invokeCallback(cb, err);
	});
}

/**
 * Apply command to loaded components.
 * This method would invoke the component {method} in series.
 * Any component {method} return err, it would return err directly.
 *
 * @param {Array} comps loaded component list
 * @param {String} method component lifecycle method name, such as: start, stop
 * @param {Function} cb
 */
Application.opt_infrastructures = function(infras, method, cb) {

	async.eachSeries(infras, function(infra, done) {
		if (typeof infra[method] === 'function') {
			infra[method](done);
		} else {
			done();
		}
	}, function(err) {
		if (err) {
			utils.invokeCallback(cb, 'fail to operate component, method:' + method + ' , err:' + err);
		}

		utils.invokeCallback(cb, err);
	});
};