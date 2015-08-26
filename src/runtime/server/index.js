import MomentumServer from './MomentumServer';
import Path from 'path';
import MomentumData from '../../store/server/index';
import io from 'socket.io';
import Debug from 'debug';

let debug = Debug('momentum:runtime');

export default class ServerRuntime {
	constructor(instance, root){
		this.loadConfig(root);
		this.initializeEnvironment();
		this.initializeTransports();
		this.initializeStores();
	}

	loadConfig(rootPath){
		let config;

		/**
		 * We should add a testing env
		 * here which allows the running without
		 * momentum.json files
		 */
		
		try{
			config = require(Path.join(rootPath, 'momentum.json'));
			debug('using momentum.json config');
		} catch(err){
			console.log("Found no momentum.json file!");
			debug('using default config');
			config = { 
				"database": {
					"adapter": "RethinkAdapter",
					"tableName": "dev"
				},
	
				"http": {
					"port": 8000
				}
			};
		}
		
		config.root = rootPath;

		/**
		 * globalize config
		 */
		 
		Momentum.config = config;
		this.config = config;
	}

	initializeEnvironment(){
		/**
		 * determine in which mode we are running
		 * defaults to 'development'
		 */

		if(process){
			if(process.env && process.env.NODE_EV && process.env.NODE_EV === 'production'){
				Momentum.dev = false;
				Momentum.env = process.env.NODE_EV;
			}

			if(process.env && process.env.buildDir){
				this.config.buildDir = buildDir;
				debug('using buildDir %o', this.config.buildDir);
			}
		}

		debug('running in %o', Momentum.env);
	}

	initializeTransports(){
		this.http = new MomentumServer(this.config);
		this.socket = io(this.http.rawHttp);
		this.http.run();
	}

	initializeStores(){
		this.data = new MomentumData(this.config, this.socket);
	}
}