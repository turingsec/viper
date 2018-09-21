/**
 * Module dependencies.
 */
const mongoose = require('mongoose');

module.exports = (function(){
	return new mongo_conn();
})();

function mongo_conn(){
	this.db = null;
}

mongo_conn.prototype.init = function(url, cb){
	this.db = mongoose.createConnection(url);
	
	this.db.on('connected', function(){
		console.log("mongodb connected");
		if(!!cb){
			cb(true);
		}
	});
	
	this.db.on('disconnected', function(){
		console.log("mongodb disconnected");
	});
}

mongo_conn.prototype.close = function(){
	this.db.close();
}

mongo_conn.prototype.model = function(name, schema){
	return this.db.model(name, schema);
}
