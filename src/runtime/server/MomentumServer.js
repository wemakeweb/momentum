import express from 'express';
import http from 'http';
import path from 'path';

export default class MomentumServer{
	constructor(config){
		this.config = config;

		let server = express(); 
		let rawHttp = http.Server(server);

		server.use(this.logErrors);
		server.use(this.clientErrorHandler);
		server.use(this.genericErrorHandler);

		// expose server
		this.server = server;
		this.rawHttp = rawHttp;

		this.bindServerRendering();
	}

	logErrors(err, req, res, next){
		console.error(err.stack);
  		next(err);
	}

	clientErrorHandler(err, req, res, next) {
		//handles special xhr casses here
		next(err);
	}

	genericErrorHandler(err, req, res, next){
		res.status(500);
	}

	bindServerRendering(){
		/**
		 * Only whitelist the folders 
		 * we want to serve
		 */
		this.server.use('/components',
			express.static(this.config.root + '/components')
		);

		this.server.use('/models',
			express.static(this.config.root + '/models')
		);

		this.server.use('/jspm_packages',
			express.static(this.config.root + '/jspm_packages')
		);

		this.serveStaticFiles({
			'/': this.config.root + '/index.html',
			'/config.js': this.config.root + '/config.js',
			'/index.js' : this.config.root + '/index.js'
		});
	}

	serveStaticFiles(map){
		for(let route in map){
			(function(server, file) {
				server.get(route, (req, res, next) => {
					res.sendFile(file);
				});
			})(this.server, map[route]);
		}
	}

	run(){
		let port = this.config.http.port || 3000;

		this.rawHttp.listen(port);
		console.log('Server listening at: %s', port);
	}
}