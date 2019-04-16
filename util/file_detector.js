/**
 * Module dependencies.
 */
const Magic = require('mmmagic').Magic;

module.exports = (function(){
	return new file_detector();
})();

function file_detector(){
	this.magic = new Magic();
}

file_detector.prototype.tell = function(content){
	let that = this;

	return new Promise(function (resolve, reject) {
		that.magic.detect(content, function(err, result) {
			if (err){
				reject(err);
			}else{
				resolve(result);
			}
		});
	});
}

//tcpdump capture file (little-endian) - version 2.4 (Ethernet, capture length 262144)
//pcap-ng capture file - version 1.0
file_detector.prototype.is_pcap = async function(content){
	let result = await this.tell(content);

	if(result.startsWith("tcpdump capture file")/* || result.startsWith("pcap-ng capture file")*/){
		return true;
	}
	
	return false;
}

file_detector.prototype.is_pe = async function(content){
	let result = await this.tell(content);
	
	if(result.startsWith("PE")){
		return true;
	}
	
	return false;
}

file_detector.prototype.is_executable = async function(content){
	let result = await this.tell(content);
	
	if(result.startsWith("ELF") || 
		result.startsWith("PE")){
			return true;
		}
		
	return false;
}