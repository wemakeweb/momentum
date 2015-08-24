import express from 'express';
import http from 'http';
import path from 'path';
import colors from 'colors';
import fs from 'fs';
import Debug from 'debug';
import ejs from 'ejs';

let debug = Debug('momentum:server');

export default class MomentumServer{
	userIndexFile: false

	constructor(config, cb){
		this.config = config;
		let server = express(); 
		let rawHttp = http.Server(server);

		/**
		 * render .ejs and .html files with
		 * the ejs template engine
		 */

		server.set('view engine', 'ejs'); 
		server.engine('html', ejs.renderFile);
		server.set('views', __dirname + '/views');

		server.use(this.logErrors);
		server.use(this.clientErrorHandler);
		server.use(this.genericErrorHandler);

		// expose server
		this.server = server;
		this.rawHttp = rawHttp;

		this.bindServerRendering();
		this.bindCustomFolders();
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

		if(Momentum.dev){
			this.server.use('/components',
				express.static(this.config.root + '/components')
			);

			this.server.use('/stores',
				express.static(this.config.root + '/stores')
			);

			this.server.use('/jspm_packages',
				express.static(this.config.root + '/jspm_packages')
			);

			this.serveStaticFiles({
				'/config.js': this.config.root + '/config.js',
				'/index.js' : this.config.root + '/index.js'
			});
		} else {
			this.serveStaticFiles({
				'/momentumjs.bundle.js': this.config.buildDir + '/bundle.js',
				'/momentumjs.bundle.js.map': this.config.buildDir + '/bundle.js.map'
			});
		}
		
		if(fs.existsSync(this.config.root + '/index.html')){
			this.userIndexFile = true;
			debug('using custom index file');
		} else {
			debug('using default index file');
		}

		this.server.get('/', this.serveIndex.bind(this));
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

	serveIndex(req, res){
		let options = {
			body: '',
			title: 'Momentumjs Application',
			imports: ''
		};

		if(Momentum.dev){
			options.imports = [
				'socket.io/socket.io.js',
				'jspm_packages/system.js',
				'config.js'
			];
		} else {
			options.imports = [
				'socket.io/socket.io.js',
				'momentumjs.bundle.js'
			];
		}

		options.imports = options.imports.map((file) => {
			return '<script src="' + file + '"></script>';
		})

		if(Momentum.dev){
			options.imports.push('<script>System.import("momentumjs");</script>');
		}

		options.imports = options.imports.join('\n');

		if(this.userIndexFile){
			res.render(this.config.root + '/index.html', options);
		} else {
			res.render('index.ejs', options);
		}
	}

	bindCustomFolders(){
		if(!this.config.http.staticFolder){
			return;
		}

		let staticFolder = this.config.http.staticFolder;
		let folders = Array.isArray(staticFolder) ? staticFolder : [staticFolder];

		folders.forEach((folder) => {
			if(folder.charAt(0) !== '/'){
				folder = '/' + folder;
			}

			this.server.use(folder, express.static(this.config.root + '/' + folder));
			debug('serving custom folder %o', folder);
		});
	}

	run(){
		let port;

		if(this.config.http.port){
			port = this.config.http.port;
			debug('using custom port %o', port);
		} else {
			port = 3000;
			debug('using default port %o', port);
		}

		this.rawHttp.listen(port);
		
		console.log('Port: %s', port.toString().grey);
		console.log('Ready!');
	}
}