/**
 * Module dependencies.
 */

var input_stream = function(size){
	this.size = size;
	this.buffer = Buffer.alloc(this.size);
	this.index = 0;
}

input_stream.prototype.write = function(data){
	if (data.length > 0) {
		if (this.index + data.length > this.size) {
			console.log('长度不合法: this.index:' + this.index + "数据长度:" + data.length + "接收的总长度:" + this.size);
			throw new Error("xxx");
		}

		for (var i = 0; i < data.length; i++) {
			this.buffer[this.index] = data[i];
			this.index += 1;
		}
	}
}

input_stream.prototype.get_len = function(){
	return this.index;
}

input_stream.prototype.get_data = function(start, len){
	if(this.index < start + len){
		return null;
	}

	var target = Buffer.alloc(len);

	this.buffer.copy(target, 0, start, start + len);

	return target;
}

input_stream.prototype.clear = function(total){
	var diff = this.index - total;

	if (diff == 0) {
		this.index = 0;
	} else if (diff > 0) {
		for (let i = 0; i < diff; i++) {
			this.buffer[i] = this.buffer[total + i];
		}

		this.index = diff;
	} else {
		log.write("error", "this.index < 0, this.index" + this.index + "plen:" + plen);
		throw new Error("xxxx");
	}
};

module.exports = input_stream;
