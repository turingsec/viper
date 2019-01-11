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