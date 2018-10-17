<<<<<<< HEAD
/**
 * Load and start tcp server infrastructure.
 */
const fs = require("fs");
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);
const RateLimit = require('express-rate-limit');
const debug = require('debug')('myapp:server');
const http = require('http');
const https = require('https');
const mlogger = require("../../common/mlogger");
const favicon = require('serve-favicon');

var express_server = function (_, opts) {
    opts = opts || {};

    this.server = null;

    this.use_https = opts.use_https;
    this.port = opts.port;
    this.secret = opts.secret;
    this.routes = opts.routes;
    this.cert = opts.cert;
    this.express = opts.express;
};

express_server.prototype.start = function (cb) {
    var app = express();
    var port = this.port;

    /*
    app.use(new RateLimit({
        windowMs: 1 * 60 * 1000,
        max: 100,
        delayMs: 1000
    }));
    */
    app.use(compression());

    if (this.express) {
        app.set('views', this.express.views);
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        app.use(favicon(this.express.favicon));
        app.use(express.static(this.express.static.path, this.express.static.value));
    }

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.raw());
    app.use(bodyParser.text());
    app.use(bodyParser.urlencoded({extended: false}));
// 解决微信支付通知回调数据
    app.use(bodyParser.xml({
        limit: '2MB', // Reject payload bigger than 1 MB
        xmlParseOptions: {
            normalize: true, // Trim whitespace inside text nodes
            normalizeTags: true, // Transform tags to lowercase
            explicitArray: false // Only put nodes in array if >1
        }
    }));
    app.use(cookieParser(this.secret));

    //setting route
    for (let dst in this.routes) {
        app.use(dst, this.routes[dst]);
    }

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function (err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        console.log(err);
        res.render('error');
    });

    app.set('port', port);

    if (this.use_https) {
        this.server = https.createServer({
            key: fs.readFileSync(this.cert.key),
            cert: fs.readFileSync(this.cert.cert)
        }, app);
    } else {
        this.server = http.createServer(app);
    }

    this.server.listen(port, "0.0.0.0");

    /**
     * Event listener for HTTP server "error" event.
     */
    this.server.on('error', function (error) {

        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                mlogger.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                mlogger.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }

    });

    /**
     * Event listener for HTTP server "listening" event.
     */
    this.server.on('listening', function () {
        mlogger.info("express server listening on port " + port);
        cb();
    });
};

express_server.prototype.stop = function (cb) {

};

module.exports = express_server;
=======
/**
 * Load and start tcp server infrastructure.
 */
const fs = require("fs");
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');
const http = require('http');
const https = require('https');
const mlogger = require("../../common/mlogger");
const favicon = require('serve-favicon');
const vhost = require('vhost');

var express_server = function(_, opts){
	opts = opts || {};

	this.servers = [];
	this.should_call_cb = false;

	this.port = opts.port;
	this.secret = opts.secret;
	this.subdomain = opts.subdomain;
	this.routes = opts.routes;
	this.ssl = opts.ssl;
	this.express = opts.express;
	this.allow_origin = opts.allow_origin;
};

express_server.prototype.start = function(cb) {
	var app = express();
	var count = this.port.length;
	var self = this;

	/*
	app.use(new RateLimit({
		windowMs: 1 * 60 * 1000,
		max: 100,
		delayMs: 1000
	}));
	*/
	app.use(compression());

	if(this.express){
		if(!!this.express.extra){
			app.use(this.express.extra);
		}

		if(!!this.express.https_require){
			app.use(this.express.https_require);
		}

		app.set('views', this.express.views);
		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');

		app.use(favicon(this.express.favicon));
		app.use(express.static(this.express.static.path, this.express.static.value));
	}

	app.use(logger('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.raw({limit: '50mb'}));
	app.use(bodyParser.text());
	app.use(bodyParser.urlencoded({ extended: false }));

	app.use(cookieParser(this.secret));

	if(this.allow_origin){
		app.all("*", function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
			res.header('Access-Control-Allow-Methods', 'POST, GET');
			
			if (req.method == 'OPTIONS') {
				res.send(200);
			} else {
				next();
			}
		});
	}

	//setting subdomain
	for(let dst in this.subdomain){
		app.use(vhost(dst, this.subdomain[dst]));
	}

	//setting route
	for(let dst in this.routes){
		app.use(dst, this.routes[dst]);
	}

	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handler
	app.use(function(err, req, res, next) {
		// set locals, only providing error in development
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		console.log(err);
		// render the error page
		res.status(err.status || 500);

		if(req.vhost){
			var hostname = req.vhost.host;
			res.redirect(req.protocol + "://" + hostname.substring(hostname.indexOf(".") + 1) + "/error");
		}else{
			res.redirect(req.protocol + "://" + req.hostname + "/error");
		}
	});

	this.port.forEach(function(item){
		var server = null;

		app.set('port', item[0]);

		if(item[1]){
			server = https.createServer({
				key: fs.readFileSync(self.ssl.key),
				cert: fs.readFileSync(self.ssl.cert)
			}, app);
		}else{
			server = http.createServer(app);
		}

		server.listen(item[0], "0.0.0.0");

		/**
		 * Event listener for HTTP server "error" event.
		 */
		server.on('error', function(error){

			if (error.syscall !== 'listen') {
				throw error;
			}

			var bind = typeof item[0] === 'string'
				? 'Pipe ' + item[0]
				: 'Port ' + item[0];

			// handle specific listen errors with friendly messages
			switch (error.code) {
				case 'EACCES':
					mlogger.error(bind + ' requires elevated privileges');
					process.exit(1);
					break;
				case 'EADDRINUSE':
					mlogger.error(bind + ' is already in use');
					process.exit(1);
					break;
				default:
					throw error;
			}

		});

		/**
		 * Event listener for HTTP server "listening" event.
		 */
		server.on('listening', function(){
			mlogger.info("express server listening on port " + item[0]);
			count -= 1;

			if(count == 0){
				cb();
			}
		});

		self.servers.push(server);
	});
};

express_server.prototype.stop = function(cb){

};

module.exports = express_server;
>>>>>>> 33532bcdbb330629b0fa69df8f240fad27ae3017
