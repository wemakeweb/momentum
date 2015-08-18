import MomentumServer from './MomentumServer';
import Path from 'path';
import MomentumData from '../../data/server/index';
import io from 'socket.io';
import Debug from 'debug';

let debug = Debug('momentum:runtime');

export default class ServerRuntime {
	constructor(instance, root){
		let config = require(Path.join(root, 'momentum.json'));
		config.root = root;

		/**
		 * globalize config
		 */
		 
		Momentum.config = config;

		this.config = config;
		this.checkEnvironment();
		this.initializeTransports();
		this.initializeData();
	}

	checkEnvironment(){
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

	initializeData(){
		this.data = new MomentumData(this.config, this.socket);
	}
}