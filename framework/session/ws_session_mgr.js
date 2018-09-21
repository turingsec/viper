/**
 * Module dependencies.
 */
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

var ws_session_mgr = module.exports = {};
var self = ws_session_mgr;

ws_session_mgr.init = function(module){
	self.session_module = module;
	self.sessions = {};
}

ws_session_mgr.create = function(sock, cb){
	var session = new self.session_module();
	
	session.init(sock);
	self.sessions[session.get_id()] = session;
	
	if(cb){
		cb();
	}

	mlogger.info("create ws_session number:" + self.number());
}

ws_session_mgr.ready2send = function(message, cb){
	var opts = message["opts"];
	
	if(opts["role"] == constants.SOCKET_TYPE.WEBSOCKET){
		var session = self.get_session_by_id(opts["id"]);
		
		if(session){
			
			if(opts["closed"]){
				session.kill("initiative");
			}else{
				session.send(message["packet"]);
			}
			
			if(cb){
				cb();
			}
		}
	}
}

ws_session_mgr.get_session_by_id = function(id){
	return self.sessions[id];
}

ws_session_mgr.remove = function(id, cb){
	if(self.sessions.hasOwnProperty(id)){
		delete self.sessions[id];

		cb();

		mlogger.info("remove ws_session number:" + self.number());
	}
}

ws_session_mgr.number = function(){
	return Object.keys(self.sessions).length;
}