/**
 * Module dependencies.
 */

module.exports = (function(){
	return model_base;
})();

function model_base(){
	this.model = null;
}

model_base.prototype.promise_insert = function(obj){
	let self = this;
	
	return new Promise((resolve, reject) => {
		let doc = new self.model(obj);
		
		doc.save(function(err, product, numAffected){
			if(err){
				reject(err);
			}
			
			resolve(null);
		});
	});
}

model_base.prototype.promise_update = function(filter, doc, options){
	let self = this;

	options = options || {};
	// options = options || {
	// 	upsert: true,
	// 	setDefaultsOnInsert: true
	// };

	return new Promise((resolve, reject) => {
		self.model.update(filter, doc, options, function (err, res) {
			if(err){
				reject(err);
			}else{
				resolve(res);
			}
		});
	});
}

model_base.prototype.promise_count = function(cond){
	let self = this;
	
	return new Promise((resolve, reject) => {
		self.model.countDocuments(cond, function(err, count){
			if(err){
				console.log("count err:" + err);
			}
			
			resolve(count);
		});
	});
}

model_base.prototype.promise_find = function(filter, projection, limit, skip, sort){
	let self = this;
	
	projection = projection || {};
	limit = limit || 0;
	skip = skip || 0;
	sort = sort || {};
	
	return new Promise((resolve, reject) => {
		self.model.find(filter).select(projection).limit(limit).skip(skip).sort(sort).exec(function (err, docs) {
			if(err){
				reject(err);
			}else{
				resolve(docs);
			}
		});
	});
}

model_base.prototype.count = function(cond, cb){
	this.model.countDocuments(cond, function(err, count){
		if(err){
			console.log("count err:" + err);
		}
		
		cb(count);
	});
}

model_base.prototype.select = function(value, cb){
	this.find_one({[this.key]: value}, cb);

	/*
	this.model.where(this.key).equals(value).exec(function(err, doc){
		if(err){
			console.log(err);
			cb(null);
		}else{
			cb();
		}
	});
	*/
}

model_base.prototype.where = function(js, cb){
	this.model.find({ $where: js }).exec(function(err, docs){
		if(err){
			console.log(err);
			cb([]);
		}else{
			cb(docs);
		}
	});
}

model_base.prototype.find_many = function(condi, cb){
	this.model.find(condi).exec(function(err, docs){
		if(err){
			console.log(err);
			cb([]);
		}else{
			cb(docs);
		}
	});
}

model_base.prototype.find_one = function(condi, project, cb){
	this.model.findOne(condi).select(project).exec(function(err, adventure){
		if(err){
			console.log(err);
			cb(null);
		}else{
			cb(adventure);
		}
	});
}

model_base.prototype.update = function(cond, value, cb){
	this.model.update(cond, value, function(err, raw){
		cb(err, raw);
	});
}

model_base.prototype.self_inc = function(cond, key, cb){
	this.model.findOneAndUpdate(cond, {$inc: {[key]: 1}}, function(err, raw){
		cb(err, raw);
	});
}

/*
	cb(err)
*/
model_base.prototype.delete_one = function(cond, cb){
	this.model.deleteOne(cond, cb);
}

model_base.prototype.delete_many = function(cond, cb){
	this.model.deleteMany(cond, cb);
}
