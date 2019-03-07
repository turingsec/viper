const qiniu = require("qiniu")
const mlogger = require("../common/mlogger");

module.exports = (function(){
	return new qiniu_mgr();
})();

function qiniu_mgr(){
	this.inited = false;
}

qiniu_mgr.prototype.init = function(CONFIG){
	if(!this.inited){
		this.CONFIG = CONFIG;
		this.mac = new qiniu.auth.digest.Mac(CONFIG.AK, CONFIG.SK);
		this.config = new qiniu.conf.Config();
		// 空间对应的机房
		this.config.zone = qiniu.zone.Zone_z0;
		// 是否使用https域名
		//config.useHttpsDomain = true;
		// 上传是否使用cdn加速
		this.config.useCdnDomain = true;
		
		this.formUploader = new qiniu.form_up.FormUploader(this.config);
		this.putExtra = new qiniu.form_up.PutExtra();
		this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
		
		this.inited = true;
	}
}

qiniu_mgr.prototype.upload_file = function(key, localFile){
	let upload_token = this.to_upload_token();
	let self = this;
	
	return new Promise(function (resolve, reject) {
		self.formUploader.putFile(upload_token, key, localFile, this.putExtra, function (respErr, respBody, respInfo) {
			if (respErr) {
				resolve(null);
			}
			
			if (respInfo.statusCode == 200) {
				resolve(respInfo.data);
			} else {
				resolve(null);
			}
		})
	});
}

qiniu_mgr.prototype.download_url_expired = function(key){
	return parseInt(Date.now() / 1000) + 3600; // 1小时过期
}

qiniu_mgr.prototype.create_download_url = function(key){
	var privateBucketDomain = `${this.CONFIG.OUTER_CHAIN}`;
	var deadline = this.download_url_expired();
	
	return this.bucketManager.privateDownloadUrl(privateBucketDomain, key, deadline);
}

//获取七牛云 upload_token //todo
qiniu_mgr.prototype.to_upload_token = function(){
	let options = {
		scope: this.CONFIG.BUCKET,
		expires: parseInt(this.CONFIG.EXPIRES),
		fsizeMin: 1,
		fsizeLimit: 1024 * 1024 * 100,//100M
		//mimeLimit: 'image/bmp;image/gif;image/jpeg;image/jpg;image/png;video/mp4;video/m4v'
	};
	
	let putPolicy = new qiniu.rs.PutPolicy(options);
	let uploadToken = putPolicy.uploadToken(this.mac);
	
	return uploadToken;
}

/**
 * 批量获取文件
 * @param options
 */
qiniu_mgr.prototype.list_prefix = function(options, cb){
    this.bucketManager.listPrefix(this.CONFIG.BUCKET, options, function (err, respBody, respInfo) {
        if (err) {
            console.log(err);
            throw err;
        }

        if (respInfo.statusCode == 200) {
            //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
            //指定options里面的marker为这个值
            var nextMarker = respBody.marker;
            var commonPrefixes = respBody.commonPrefixes;
            var items = respBody.items;
            items.forEach(function (item) {
                //console.log(item.key);
                cb(item.key);
                // console.log(item.putTime);
                // console.log(item.hash);
                // console.log(item.fsize);
                // console.log(item.mimeType);
                // console.log(item.endUser);
                // console.log(item.type);
            });
        } else {
            console.log(respInfo.statusCode);
            console.log(respBody);
        }
    });
}

/**
 * 批量删除
 *
 */
qiniu_mgr.prototype.remove_all_file = function(){
    let self = this;

    this.list_prefix({
        limit: 1000,
        prefix: '',
    }, function (key) {
        self.remove_file(key);
    })
}

/**
 * 删除文件
 * @param key 文件名
 */
qiniu_mgr.prototype.remove_file = function(key){
    this.bucketManager.delete(this.CONFIG.BUCKET, key, function (err, respBody, respInfo) {
        if (err) {
            mlogger.error(err);
		}
		
        if (respInfo.statusCode == 200) {
            mlogger.info(`删除成功: ${key}`);
        } else {
            mlogger.error({code: respInfo.statusCode, msg: respBody});
        }
    });
}