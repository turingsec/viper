const net_op = require("./net_op");

module.exports = (function(){
	return new cybertek_api();
})();

function cybertek_api(){

}

cybertek_api.prototype.file_upload = async function(content, filename, config){
	return await net_op.common_request({
		url: `${config.URL}/file/upload`,
		method: 'POST',
		json: true,
		formData: {
			file: {
				value: content,
				options: {
					filename: filename
				}
			},
			apikey: `${config.APIKEY}`
		}
	});
}

cybertek_api.prototype.ipv4_geo = async function(ip, config){
	return await net_op.common_request({
		url: `${config.URL}/ipv4/geo?apikey=${config.APIKEY}&ip=${ip}`,
		method: 'GET',
		json: true
	});
}

cybertek_api.prototype.ipv4_report = async function(ip, config){
	return await net_op.common_request({
		url: `${config.URL}/ipv4/report?apikey=${config.APIKEY}&ip=${ip}`,
		method: 'GET',
		json: true
	});
}

cybertek_api.prototype.file_engine = async function(sha256, config){
	return await net_op.common_request({
		url: `${config.URL}/file/engine?apikey=${config.APIKEY}&file_hash=${sha256}`,
		method: 'GET',
		json: true
	});
}