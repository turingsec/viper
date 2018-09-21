/**
 * Module dependencies.
 */
const constants = require('../../util/constants');

module.exports = (function(app, opts) {
  return new parser();
})();

function parser(){
	
}

parser.prototype.handle_package = function(stream, cb){
	while(true){
		var buffer_len = stream.get_len();
		
		if (buffer_len < constants.PACKET_FORMAT.HEAD + constants.PACKET_FORMAT.LEN){
			break;
		}
		
		var len_buf = stream.get_data(constants.PACKET_FORMAT.HEAD, constants.PACKET_FORMAT.LEN);
		
		if(len_buf){
			var len = len_buf.readInt32LE();
			var total = constants.PACKET_FORMAT.HEAD + constants.PACKET_FORMAT.LEN + len + constants.PACKET_FORMAT.TAIL;
			
			if(buffer_len < total){
				break;
			}
			
			var payload = stream.get_data(constants.PACKET_FORMAT.HEAD + constants.PACKET_FORMAT.LEN, len);
			stream.clear(total);
			
			try{
				cb(payload);
			}catch(e){
				console.log("parser error:", e);
				break;
			}
		}
	}
}