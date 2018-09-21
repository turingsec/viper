/**
 * Module dependencies.
 */
const winston = require("winston");
const moment = require("moment");
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require('./daily-rotate-file');

module.exports = (function(){
	return new mlogger();
})();

function mlogger(){
	this.logger = null;
}

mlogger.prototype.init = function(dir, filename){
	const self = this;
	const tsFormat = format((info, opts) => {
		info.timestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss.SSS");
		return info;
	});
	
	self.logger = createLogger({
		format: combine(
			winston.format.colorize(),
			tsFormat(),
			printf(info => {
				//return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
				return `${info.timestamp} ${info.level}: ${info.message}`;
			}),
		),
		levels: winston.config.syslog.levels,
		transports: [
			new winston.transports.Console({ level: 'error' }),
			new DailyRotateFile({
				dirname: dir,
				filename: 'log_file.log'
			})
		]
	});

	["error", "warn", "info", "verbose", "debug", "silly"].forEach(function(level){
		Object.defineProperty(self, level, {
			get : function () {
				return self.logger[level];
			}
		});
	});
}