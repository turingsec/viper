var time_op = module.exports = {};

time_op.now_seconds = function () {
	return Date.parse(new Date()) / 1000;
}

time_op.timestamp2locale = function (timestamp) {
	return new Date(timestamp * 1000).toLocaleString('en-US', { hour12: false });
}

time_op.timestring2locale = function (timestr) {
	return new Date(timestr).toLocaleString('en-US', { hour12: false });
}

time_op.timestamp2localedate = function (timestamp) {
	return new Date(timestamp * 1000).toLocaleDateString('en-US');
}

time_op.timestring2localedate = function (timestr) {
	return new Date(timestr).toLocaleDateString('en-US');
}

time_op.timestring2ts = function(timestr){
	return new Date(timestr).getTime() / 1000;
}

/*
 * Date format
 */
time_op.date_format = function (date, format) {
	format = format || 'MMddhhmm';
	var o = {
		"M+": date.getMonth() + 1, //month
		"d+": date.getDate(), //day
		"h+": date.getHours(), //hour
		"m+": date.getMinutes(), //minute
		"s+": date.getSeconds(), //second
		"q+": Math.floor((date.getMonth() + 3) / 3), //quarter
		"S": date.getMilliseconds() //millisecond
	};

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] :
				("00" + o[k]).substr(("" + o[k]).length));
		}
	}

	return format;
};