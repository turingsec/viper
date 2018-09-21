/**
 * Module dependencies.
 */
module.exports = (function(app, opts) {
  return new parser();
})();

function parser(){
	
}

parser.prototype.handle_package = function(stream, cb){
	var buffer_len = stream.get_len();
	var payload = stream.get_data(0, buffer_len);
	
	stream.clear(buffer_len);
	
	try{
		cb(payload);
	}catch(e){
		console.log("parser error:", e);
	}
}