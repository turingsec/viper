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
				resolve("");
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
	
	if(result.startsWith("PE32 executable") || 
		result.startsWith("PE32+ executable")){
		return true;
	}
	
	return false;
}

file_detector.prototype.allow_upload = async function(content){
	let result = await this.tell(content);
	
	return this.is_document(result);
}

file_detector.prototype.tell_os = function(mime){
	if(mime.startsWith("PE32 executable") || 
		mime.startsWith("PE32+ executable")){
		return "windows";
	}
	
	if(mime.startsWith("ELF")){
		return "linux";
	}

	if(mime.startsWith("Zip archive data")){
		return "android";
	}
	
	return "unknown";
}

file_detector.prototype.is_document = function(id){
	if(id.startsWith("PE32 executable") ||
		id.startsWith("PE32+ executable") ||
		id.startsWith("ELF") ||
		id.startsWith("Composite Document File") || 
		id.startsWith("Microsoft Word") || 
		id.startsWith("Microsoft Excel") ||
		id.startsWith("Microsoft PowerPoint") ||
		id.startsWith("PDF document") || 
		id.startsWith("ISO-8859 text") ||
		id.startsWith("ASCII text") ||
		id.startsWith("UTF-8 Unicode text") ||
		id.startsWith("Python script text executable") ||
		id.startsWith("Rich Text Format data") ||
		id.startsWith("Bourne-Again shell script text executable") ||
		id.startsWith("HTML document")){
		
		return true;
	}
	
	return false;
}