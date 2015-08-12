import express from 'express';
import http from 'http';

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

		this.server.use('/app',
			express.static(this.config.dirs.app)
		);

		this.server.use('/jspm_packages',
			express.static(this.config.dirs.root + '/jspm_packages')
		);

		this.server.use('/src',
			express.static(this.config.dirs.root + '/src')
		);

		this.serveStaticFiles({
			'/': 'index.html',
			'/config.js': 'config.js'
		});
	}

	serveStaticFiles(map){
		for(let route in map){
			(function(server, root, file) {
				server.get(route, (req, res, next) => {
					res.sendFile(root + '/' + file);
				});
			})(this.server, this.config.dirs.root, map[route]);
		}
	}

	run(){
		let port = this.config.http.port || 3000;

		this.rawHttp.listen(port);
		console.log('Server listening at: %s', port);
	}
}