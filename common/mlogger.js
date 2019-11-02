/**
 * Module dependencies.
 */
const winston = require("winston");
const path = require('path');
const dailyRoateFile = require('winston-daily-rotate-file');

module.exports = (function(){
	return new mlogger();
})();

function mlogger(){
	this.logger = null;
}

mlogger.prototype.init = function(config, prefix){
	let self = this;
	// logger directory
	let logDir = config.log_dir;

	// logger exception file
	let exceptionFile = path.join(logDir, `${prefix}_exceptions.log`);
	let errorFile = path.join(logDir, `${prefix}_error.log`);
	let logFile = path.join(logDir, `${prefix}_%DATE%.log`);

	// logger level
	let defaultLogLevel = 'debug';
	let defaultMaxSize = '50m';
	let defaultMaxFiles = '14d';

	// logger formatter
	let formatter = winston.format.combine(
		// string use util.format
		winston.format.splat(),
		// timestamp to format
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss.SSS'
		}),
		winston.format.printf(info => {
			return `${info.timestamp} ${info.level}:${info.message}`;
		})
	);

	// logger transports
	let logTransports = [
		new winston.transports.File({
			level: 'error',
			filename: errorFile
		}),
		new dailyRoateFile({
			filename: logFile,
			datePattern: 'YYYY-MM-DD-HH',
			maxFiles: defaultMaxFiles,
			maxSize: defaultMaxSize
		}),
		new winston.transports.Console({
			handleExceptions: true
		})
	];

	// create logger instance
	self.logger = winston.createLogger({
		level: defaultLogLevel,
		format: formatter,
		transports: logTransports,
		exceptionHandlers: [
			new winston.transports.File({
				filename: exceptionFile
			})
		],
		exitOnError: false
	});
	
	/*
	const levels = ["error", "warning", "info", "verbose", "debug", "silly"];

	levels.forEach(function(level){
		Object.defineProperty(self, level, {
			get : function () {
				return self.logger[level];
			}
		});
	});
	*/
}

mlogger.prototype.warning = function(data){
	this.logger.warn(data);
}

mlogger.prototype.info = function(data){
	this.logger.info(data);
}

mlogger.prototype.error = function(data){
	this.logger.info(data);
}