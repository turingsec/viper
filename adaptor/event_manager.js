/**
 * Module dependencies.
 */
const EventEmitter = require("events");
const inherits = require("util").inherits;
const constants = require("../util/constants");
const utils = require('../util/utils');

module.exports = (function(app, opts) {
  return new event_manager();
})();

function event_manager(){
	EventEmitter.call(this);
	
	this.maps = {};
}

inherits(event_manager, EventEmitter);

event_manager.prototype.init = function(){
	var self = this;

	for(let key in constants.EVENT){
		let event = constants.EVENT[key];

		this.on(event, function(){
			var cbs = self.maps[event];
			var args = Array.prototype.slice.call(arguments);
			
			cbs.forEach(function(cb){
				//console.log("========" + event + "=========");
				cb.apply(null, args);
			});
		});
	}
}

event_manager.prototype.regist = function(event, cb){
	if(Object.prototype.hasOwnProperty.call(this.maps, event)){
		this.maps[event].push(cb);
	}else{
		this.maps[event] = [cb];
	}
}