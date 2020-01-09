/**
 * Module dependencies.
 */
const fs = require('fs');

var file_op = module.exports = {};

file_op.load_file = function (file_path) {
	return new Promise((resolve, reject) => {
		let readStream = fs.createReadStream(file_path);
		let zipBuffer = {};
		let zipContent = [];

		readStream.on('data', function (chunk) {
			zipContent.push(chunk);
		});

		readStream.on('end', function () {
			zipBuffer = Buffer.concat(zipContent);
			resolve(zipBuffer);
		});

		readStream.on('error', function (err) {
			reject(err);
		});
	});
}

file_op.save_file = function (file_path, data) {
	return new Promise((resolve, reject) => {
		let writeStream = fs.createWriteStream(file_path);
		
		//读取文件发生错误事件
		writeStream.on('error', (err) => {
			reject(err)
		});

		//已打开要写入的文件事件
		writeStream.on('open', (fd) => {
			
		});

		//文件已经就写入完成事件
		writeStream.on('finish', () => {
			resolve(null);
		});
		
		//文件关闭事件
		writeStream.on('close', () => {
			
		});
		
		writeStream.write(data);
		writeStream.end();
	});
}

file_op.remove_file = function(file_path){
	if(!fs.existsSync(file_path)){
		return null;
	}
	
	return new Promise((resolve, reject) => {
		fs.unlink(file_path, function (err) {
			if (err){
				reject(err);
				return;
			}

			resolve(null);
		}); 
	});
}

file_op.read_file_sync = function (file_path, encode = "utf8") {
	return fs.readFileSync(file_path, { "encoding": encode })
}

file_op.write_file_sync = function (file_path, data) {
	fs.writeFileSync(file_path, data);
}

file_op.file_exists = function(file_path){
	return fs.existsSync(file_path);
}