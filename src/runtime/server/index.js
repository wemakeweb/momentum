import MomentumServer from './MomentumServer';
import Path from 'path';
import MomentumData from '../../data/server/index';
import io from 'socket.io';

export default class ServerRuntime {
	constructor(instance, root){
		let config = require(Path.join(root, 'momentum.json'));
		config.root = root;
		this.config = config;

		this.checkEnvironment();
		console.log('Booting Momentum Server…');
		this.initializeTransports();
		this.initializeData();
	}

	checkEnvironment(){
		//check if all needed app folders are present etc
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