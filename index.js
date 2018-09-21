/**
 * Module dependencies.
 */
const application = require("./application");
//const package = require("../package");
const fs = require("fs");
const path = require("path");

/**
 * Expose `createApplication()`.
 *	
 * @module
 */
var Viper = module.exports = {};

/**
 * Framework version.
 */
//Viper.version = package.version;

/**
 * infrastructure
 */
Viper.infrastructures = {};

/**
 * auto loaded components
 */
Viper.components = {};

/**
 * Create an Viper application.
 *
 * @return {Application}
 */
Viper.create_app = function (opts, cb) {
	var app = application;
	app.init(this, opts, cb);

	return app;
};

Viper.start = function(app, cb) {
	app.start(cb);
};

Viper.stop = function(app, cb) {
	app.stop(cb);
};

/**
 * Get application
 */
Object.defineProperty(Viper, 'app', {
	get : function () {
		return self.app;
	}
});

fs.readdirSync(__dirname + '/infrastructure').forEach(function (filename) {
	if (!/\.js$/.test(filename)) {
		return;
	}
	
	var name = path.basename(filename, '.js');
	var _load = load.bind(null, './infrastructure/', name);
	
	Viper.infrastructures.__defineGetter__(name, _load);
});

function load(path, name) {
	if (name) {
		return require(path + name);
	}
	return require(path);
}