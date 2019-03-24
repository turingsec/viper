const net_op = require("./net_op");

module.exports = (function(){
	return new cybertek_api();
})();

function cybertek_api(){

}

cybertek_api.prototype.common_request = async function(options){
	let ret = await net_op.common_request(options);
	
	if(ret.success){
		switch(ret.body.code){
			case macro.ERROR_CODE.SUCCESS:
				return {
					"success": true,
					"body": ret.body
				};
			default:
				return {
					"success": false,
					"msg": ret.body.msg,
					"code": ret.body.code
				};
		}
	}
	
	return {
		"success": false,
		"msg": ret.msg
	};
}

cybertek_api.prototype.file_upload = function(content, filename, config){
	return this.common_request({
		url: `${config.URL}/file/upload`,
		method: 'POST',
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

cybertek_api.prototype.ipv4_geo = function(ip, config){
	return this.common_request({
		url: `${config.URL}/ipv4/geo?apikey=${config.APIKEY}&ip=${ip}`,
		method: 'GET'
	});
}

cybertek_api.prototype.ipv4_report = function(ip, config){
	return this.common_request({
		url: `${config.URL}/ipv4/report?apikey=${config.APIKEY}&ip=${ip}`,
		method: 'GET'
	});
}

cybertek_api.prototype.file_engine = function(sha256, config){
	return this.common_request({
		url: `${config.URL}/file/engine?apikey=${config.APIKEY}&file_hash=${sha256}`,
		method: 'GET'
	});
}