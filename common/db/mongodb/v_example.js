/**
 * Module dependencies.
 */
const db_conn = require('./db_conn');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model_base = require('./model_base');
const inherits = require("util").inherits;

module.exports = (function(){
	return new v_example();
})();

function v_example(){
	model_base.call(this);
	
	this.model = db_conn.model('example', new Schema({
		uuid: String,
		create_at: { type: Date, default: Date.now }
	}));
	
	this.key = 'uuid';
}

inherits(v_example, model_base);

v_example.prototype.insert = function(uuid, value, cb){
	var self = this;

	self.count({'uuid': uuid}, function(count){
		if(count == 0){
			var doc = new self.model({
				uuid: uuid
			});

			doc.save(function(err, product, numAffected){
				if(err){
					console.log(err, product, numAffected);
				}

				if(!!cb){
					cb(err, product, numAffected);
				}
			});
		}else{
			if(!!cb){
				cb("uuid:" + uuid + " exists");
			}
		}
	});
}
