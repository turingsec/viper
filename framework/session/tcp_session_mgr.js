/**
 * Module dependencies.
 */
const constants = require("../../util/constants");
const mlogger = require("../../common/mlogger");

var tcp_session_mgr = module.exports = {};
var self = tcp_session_mgr;

tcp_session_mgr.init = function(module){
	self.session_module = module;
	self.sessions = {};
}

tcp_session_mgr.create = function(sock, timeout, cb){
	var session = new self.session_module();
	
	session.init(sock, timeout);
	self.sessions[session.get_id()] = session;
	
	if(cb){
		cb();
	}
	
	mlogger.info("create tcp_session number:" + self.number());
}

tcp_session_mgr.ready2send = function(message, cb){
	var opts = message["opts"];
	
	if(opts["role"] == constants.SOCKET_TYPE.SOCKET){
		var session = self.get_session_by_id(opts["id"]);
		
		if(session){
			if(opts["closed"]){
				session.kill(message["packet"]);
			}else{
				session.send(message["packet"]);
			}
			
			if(cb){
				cb();
			}
		}
	}
}

tcp_session_mgr.get_session_by_id = function(id){
	return self.sessions[id];
}

tcp_session_mgr.remove = function(id, cb){
	if(self.sessions.hasOwnProperty(id)){
		delete self.sessions[id];
		
		cb();
		
		mlogger.info("remove tcp_session number:" + self.number());
	}
}

tcp_session_mgr.number = function(){
	return Object.keys(self.sessions).length;
}