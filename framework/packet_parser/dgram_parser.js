/**
 * Module dependencies.
 */
module.exports = (function(app, opts) {
  return new parser();
})();

function parser(){
	
}

parser.prototype.handle_package = function(stream, cb){
	cb(stream);
}